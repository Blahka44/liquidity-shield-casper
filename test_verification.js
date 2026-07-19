const OracleService = require('./src/oracle/OracleService');
const RiskEngine = require('./src/risk/RiskEngine');
const PolicyEngine = require('./src/policy/PolicyEngine');
const VerificationService = require('./src/utils/VerificationService');

async function demo() {
    console.log('=== LIQUIDITY SHIELD v2.1 — VERIFICATION DEMO ===\n');
    
    // Step 1: Fetch real data
    const oracle = new OracleService();
    const marketData = await oracle.fetchMarketData();
    
    // Step 2: Calculate risk and policy
    const riskEngine = new RiskEngine();
    const risk = riskEngine.calculateRisk(marketData);
    
    const policyEngine = new PolicyEngine();
    const policy = policyEngine.generatePolicy(risk, marketData);
    
    // Step 3: Verify the full chain
    const verifier = new VerificationService();
    const report = verifier.verifyFullChain(marketData, policy);
    
    // Step 4: Demonstrate tamper detection
    verifier.demonstrateTamperDetection(marketData, policy);
    
    console.log('\n=== DEMO COMPLETE ===');
}

demo().catch(console.error);
