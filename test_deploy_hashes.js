const OracleService = require('./src/oracle/OracleService');
const RiskEngine = require('./src/risk/RiskEngine');
const PolicyEngine = require('./src/policy/PolicyEngine');
const CasperExecutor = require('./src/utils/CasperExecutor');
const AuditLogger = require('./src/audit/AuditLogger');

async function deployTest() {
    console.log('=== DEPLOYMENT TEST WITH HASHES ===\n');

    const audit = new AuditLogger();

    const oracle = new OracleService();
    const marketData = await oracle.fetchMarketData();
    audit.logOracleFetch(marketData);

    const riskEngine = new RiskEngine();
    const risk = riskEngine.calculateRisk(marketData);
    audit.logRiskAssessment(risk);

    const policyEngine = new PolicyEngine();
    const policy = policyEngine.generatePolicy(risk, marketData);
    audit.logPolicyGenerated(policy);

    console.log('Policy has oracleHash:', !!policy.oracleHash);
    console.log('Policy has policyHash:', !!policy.policyHash);
    console.log('Oracle Hash:', policy.oracleHash.substring(0, 32) + '...');
    console.log('Policy Hash:', policy.policyHash.substring(0, 32) + '...');
    console.log();

    // Force deployment by overriding state
    policy.state = 'CRITICAL';
    policy.riskScore = 85;
    policy.action = 'Protection triggered';
    policy.rawChange = marketData.priceChange;

    console.log('Deploying to Casper with hashes...');
    const executor = new CasperExecutor();
    const result = executor.deployTransaction(policy);

    console.log('Deployment result:', JSON.stringify(result, null, 2));

    if (result.success) {
        audit.logTransaction(policy, result.hash);
        console.log('✅ Deployment recorded in audit log');
    } else {
        audit.logError('casper_executor', new Error(result.error), {
            riskScore: policy.riskScore,
            state: policy.state
        });
    }
}

deployTest().catch(console.error);
