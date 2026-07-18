class Logger {
    static banner() {
        console.log('╔══════════════════════════════════════════════════╗');
        console.log('║  LIQUIDITY SHIELD — POLICY AGENT v2.0            ║');
        console.log('║  Autonomous Risk Operations for Casper Network   ║');
        console.log('╚══════════════════════════════════════════════════╝');
        console.log();
    }

    static oracle(marketData) {
        console.log('📡 Market Observer: Fetching CSPR market data...');
        console.log(`📊 24h Price Change: ${marketData.priceChange > 0 ? '+' : ''}${marketData.priceChange.toFixed(2)}%`);
        console.log(`💰 Current Price: $${marketData.currentPrice}`);
        console.log();
    }

    static risk(riskAssessment) {
        console.log('🧠 Risk Engine: Evaluating risk...');
        console.log(`🎯 Risk Score: ${riskAssessment.score}/100 (${riskAssessment.level})`);
        console.log(`🛡️  System State: ${riskAssessment.state}`);
        console.log(`📈 Factors — Base: ${riskAssessment.factors.base}, Volatility: ${riskAssessment.factors.volatility}, Trend: ${riskAssessment.factors.trend}`);
        console.log();
    }

    static policy(policy) {
        console.log('📋 Policy Engine: Generating policy...');
        console.log(`🎯 Action: ${policy.action}`);
        console.log(`📝 Reason: ${policy.reason}`);
        console.log();
    }

    static transaction(result) {
        if (result.success) {
            console.log('✅ State transition confirmed:', result.hash);
            console.log(`🔗 Explorer: ${result.explorerUrl}`);
        } else {
            console.log('❌ Transaction failed:', result.error);
        }
        console.log();
    }

    static state(state) {
        console.log('📝 State written to state.json');
        console.log('📋 Audit trail updated');
        console.log();
    }

    static cycleComplete() {
        console.log('⏰ Policy Agent: Standby. Re-run to evaluate next cycle.');
        console.log('═════════════════════════════════════════════════════');
        console.log();
    }

    static error(component, err) {
        console.log(`❌ [${component}] Error: ${err.message || err}`);
        console.log();
    }
}

module.exports = Logger;
