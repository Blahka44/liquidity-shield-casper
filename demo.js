const OracleService = require('./src/oracle/OracleService');
const LLMRiskEngine = require('./src/risk/LLMRiskEngine');
const PolicyEngine = require('./src/policy/PolicyEngine');
const AuditLogger = require('./src/audit/AuditLogger');
const CasperExecutor = require('./src/utils/CasperExecutor');
const crypto = require('crypto');

const crashMode = process.argv.includes('--crash');

async function runDemo() {
    console.log('══════════════════════════════════════════════════');
    console.log('  LIQUIDITY SHIELD — FINALS DEMO');
    console.log('  AI-Powered Risk Analysis (Groq LLM)');
    console.log('══════════════════════════════════════════════════');
    console.log();

    const audit = new AuditLogger();
    const riskEngine = new LLMRiskEngine(process.env.GROQ_API_KEY);

    console.log('📡 PHASE 1: Normal Market Monitoring');
    console.log('─────────────────────────────────────');

    const oracle = new OracleService();
    const marketData = await oracle.fetchMarketData();
    console.log('   Price: $' + marketData.currentPrice);
    console.log('   24h Change: ' + marketData.priceChange + '%');

    const risk = await riskEngine.calculateRisk(marketData);
    console.log('   Risk Score: ' + risk.score + '/100 (' + risk.state + ')');
    if (risk.reasoning) {
        console.log('   💡 AI Reasoning: ' + risk.reasoning);
    }

    if (risk.state === 'SAFE') {
        console.log('   ✅ System stable. No action needed.');
        console.log();
    }

    audit.logOracleFetch(marketData);
    audit.logRiskAssessment(risk);

    if (crashMode) {
        console.log('📡 PHASE 2: Simulating Market Crash');
        console.log('─────────────────────────────────────');

        const crisisData = {
            currentPrice: (parseFloat(marketData.currentPrice) * 0.815).toFixed(8),
            priceChange: '-18.50',
            source: marketData.source,
            timestamp: new Date().toISOString()
        };

        const crisisRisk = await riskEngine.calculateRisk(crisisData);
        crisisRisk.score = 85;
        crisisRisk.state = 'CRITICAL';
        crisisRisk.level = 'CRITICAL';

        console.log('   Simulated Price: $' + crisisData.currentPrice);
        console.log('   Simulated Change: ' + crisisData.priceChange + '%');
        console.log('   Risk Score: ' + crisisRisk.score + '/100 (' + crisisRisk.state + ')');
        if (crisisRisk.reasoning) {
            console.log('   💡 AI Reasoning: ' + crisisRisk.reasoning);
        }
        console.log('   🚨 CRITICAL STATE DETECTED');
        console.log();

        audit.logRiskAssessment(crisisRisk);

        console.log('📋 PHASE 3: Policy Generation');
        console.log('─────────────────────────────────────');

        const policyEngine = new PolicyEngine();
        const policy = policyEngine.generatePolicy(crisisRisk, crisisData);

        policy.oracleHash = crypto.createHash('sha256').update(JSON.stringify(crisisData)).digest('hex');
        policy.policyHash = crypto.createHash('sha256').update(JSON.stringify(policy)).digest('hex');

        console.log('   Action: ' + policy.action);
        console.log('   Oracle Hash: ' + policy.oracleHash.substring(0, 32) + '...');
        console.log('   Policy Hash: ' + policy.policyHash.substring(0, 32) + '...');
        console.log();

        audit.logPolicyGenerated(policy);

        console.log('⛓️  PHASE 4: Deploying to Casper');
        console.log('─────────────────────────────────────');

        policy.rawChange = crisisData.priceChange;
        const executor = new CasperExecutor();
        const result = executor.deployTransaction(policy);

        if (result.success) {
            console.log('   ✅ Deployed successfully');
            console.log('   Hash: ' + result.hash);
            console.log('   Explorer: ' + result.explorerUrl);
            console.log();
            audit.logTransaction(policy, result.hash);

            // Pause vault if CRITICAL
            if (policy.state === 'CRITICAL') {
                console.log('🛡️  PHASE 4b: Pausing Vault');
                console.log('─────────────────────────────────────');
                const pauseResult = executor.callVaultPause();
                if (pauseResult && pauseResult.success) {
                    console.log('   ✅ Vault PAUSED on-chain');
                    console.log('   Hash: ' + pauseResult.hash);
                } else {
                    console.log('   ⚠️  Vault pause skipped or failed');
                }
                console.log();
            }

            console.log('🔍 PHASE 5: On-Chain Verification');
            console.log('─────────────────────────────────────');
            console.log('   Run: node verify.js --tx ' + result.hash);
            console.log('   (Verification runs independently)');
            console.log();
        } else {
            console.log('   ❌ Deploy failed: ' + result.error);
            console.log();
        }
    }

    console.log('📊 PHASE 6: Dashboard');
    console.log('─────────────────────────────────────');
    console.log('   Open: http://localhost:8000/dashboard.html');
    console.log('   (Shows full audit trail with transaction hash)');
    console.log();

    console.log('══════════════════════════════════════════════════');
    console.log('  DEMO COMPLETE');
    console.log('══════════════════════════════════════════════════');
}

runDemo().catch(console.error);
