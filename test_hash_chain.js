const OracleService = require('./src/oracle/OracleService');
const RiskEngine = require('./src/risk/RiskEngine');
const PolicyEngine = require('./src/policy/PolicyEngine');

async function test() {
    console.log('=== LIQUIDITY SHIELD v2.1 HASH VERIFICATION TEST ===\n');
    
    const oracle = new OracleService();
    const marketData = await oracle.fetchMarketData();
    console.log('1. ORACLE FETCH');
    console.log('   Price Change:', marketData.priceChange + '%');
    console.log('   Oracle Hash:', marketData.oracleHash.substring(0, 32) + '...');
    console.log('   Hash Length:', marketData.oracleHash.length, 'chars');
    console.log();
    
    const riskEngine = new RiskEngine();
    const risk = riskEngine.calculateRisk(marketData);
    console.log('2. RISK ASSESSMENT');
    console.log('   Score:', risk.score, '| State:', risk.state);
    console.log();
    
    const policyEngine = new PolicyEngine();
    const policy = policyEngine.generatePolicy(risk, marketData);
    console.log('3. POLICY GENERATED');
    console.log('   Action:', policy.action);
    console.log('   Oracle Hash:', policy.oracleHash ? policy.oracleHash.substring(0, 32) + '...' : 'null');
    console.log('   Policy Hash:', policy.policyHash.substring(0, 32) + '...');
    console.log();
    
    console.log('4. VERIFICATION CHAIN');
    console.log('   Oracle Hash in marketData:', !!marketData.oracleHash);
    console.log('   Oracle Hash in policy:', !!policy.oracleHash);
    console.log('   Policy Hash in policy:', !!policy.policyHash);
    console.log('   Hashes match:', marketData.oracleHash === policy.oracleHash ? 'YES' : 'NO');
    console.log();
    
    console.log('5. TRUST CHAIN');
    console.log('   CoinGecko API');
    console.log('        |');
    console.log('        v');
    console.log('   SHA-256(oracle_response) =', marketData.oracleHash.substring(0, 16) + '...');
    console.log('        |');
    console.log('        v');
    console.log('   RiskEngine calculates score');
    console.log('        |');
    console.log('        v');
    console.log('   PolicyEngine generates policy');
    console.log('        |');
    console.log('        v');
    console.log('   SHA-256(policy_object) =', policy.policyHash.substring(0, 16) + '...');
    console.log('        |');
    console.log('        v');
    console.log('   CasperExecutor deploys to blockchain');
    console.log('        |');
    console.log('        v');
    console.log('   On-chain: risk_score + oracle_hash + policy_hash');
    console.log();
    
    console.log('=== TEST COMPLETE ===');
}

test().catch(console.error);
