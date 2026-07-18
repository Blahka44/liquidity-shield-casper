const OracleService = require('./src/oracle/OracleService');
const RiskEngine = require('./src/risk/RiskEngine');
const PolicyEngine = require('./src/policy/PolicyEngine');
const AuditLogger = require('./src/audit/AuditLogger');
const CasperExecutor = require('./src/utils/CasperExecutor');
const StateManager = require('./src/utils/StateManager');
const Logger = require('./src/utils/Logger');

class LiquidityShieldAgent {
    constructor() {
        this.oracle = new OracleService();
        this.riskEngine = new RiskEngine();
        this.policyEngine = new PolicyEngine();
        this.audit = new AuditLogger();
        this.executor = new CasperExecutor();
        this.stateManager = new StateManager();
    }

    async run() {
        Logger.banner();

        try {
            // Step 1: Fetch market data
            const marketData = await this.oracle.fetchMarketData();
            Logger.oracle(marketData);
            this.audit.logOracleFetch(marketData);

            // Step 2: Calculate risk
            const riskAssessment = this.riskEngine.calculateRisk(marketData);
            Logger.risk(riskAssessment);
            this.audit.logRiskAssessment(riskAssessment);

            // Step 3: Generate policy
            const policy = this.policyEngine.generatePolicy(riskAssessment, marketData);
            Logger.policy(policy);
            this.audit.logPolicyGenerated(policy);

            // Step 4: Execute if needed
            let txResult = { success: false };
            
            // Deploy on CRITICAL, WARNING, or significant state changes
            const shouldDeploy = (
                riskAssessment.state === 'CRITICAL' || 
                riskAssessment.state === 'WARNING' ||
                (riskAssessment.state === 'MONITORING' && riskAssessment.score >= 60)
            );

            if (shouldDeploy) {
                console.log('🚀 Policy Engine: Executing state transition on Casper...');
                txResult = this.executor.deployTransaction(policy);
                Logger.transaction(txResult);

                if (txResult.success) {
                    this.audit.logTransaction(policy, txResult.hash);
                } else {
                    this.audit.logError('casper_executor', new Error(txResult.error), {
                        riskScore: riskAssessment.score,
                        state: riskAssessment.state
                    });
                }
            } else {
                console.log('🟢 System state stable. No deployment required.');
                console.log();
            }

            // Step 5: Update state
            const newState = this.stateManager.updateState(
                riskAssessment, 
                policy, 
                txResult.success ? txResult.hash : null
            );
            Logger.state(newState);

        } catch (err) {
            Logger.error('agent', err);
            this.audit.logError('agent', err);
        }

        Logger.cycleComplete();
    }
}

// Run the agent
const agent = new LiquidityShieldAgent();
agent.run();
