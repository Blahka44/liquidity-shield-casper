const OracleService = require('./src/oracle/OracleService');
const RiskEngine = require('./src/risk/RiskEngine');
const PolicyEngine = require('./src/policy/PolicyEngine');
const CasperExecutor = require('./src/utils/CasperExecutor');

async function deployTest() {
    console.log('=== DEPLOYMENT TEST WITH HASHES ===\n');

    const oracle = new OracleService();
    const marketData = await oracle.fetchMarketData();

    const riskEngine = new RiskEngine();
    const risk = riskEngine.calculateRisk(marketData);

    const policyEngine = new PolicyEngine();
    const policy = policyEngine.generatePolicy(risk, marketData);

    console.log('Policy has oracleHash:', !!policy.oracleHash);
    console.log('Policy has policyHash:', !!policy.policyHash);
    console.log('Oracle Hash:', policy.oracleHash.substring(0, 32) + '...');
    console.log('Policy Hash:', policy.policyHash.substring(0, 32) + '...');
    console.log();

    // Force deployment by overriding state
    policy.state = 'CRITICAL';
    policy.riskScore = 85;
    policy.action = 'Protection triggered';

    console.log('Deploying to Casper with hashes...');
    const executor = new CasperExecutor();
    const result = executor.deployTransaction(policy);

    console.log('Deployment result:', JSON.stringify(result, null, 2));
}

deployTest().catch(console.error);
