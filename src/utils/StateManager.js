const fs = require('fs');

class StateManager {
    constructor(statePath = 'state.json') {
        this.statePath = statePath;
        this.state = this.loadState();
    }

    loadState() {
        try {
            if (fs.existsSync(this.statePath)) {
                return JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
            }
        } catch (err) {
            console.warn('⚠️  Could not load state, starting fresh');
        }
        return this.getDefaultState();
    }

    getDefaultState() {
        return {
            asset: 'CSPR',
            risk_score: 0,
            status: 'SAFE',
            price_change: '0.00',
            threshold: 15,
            last_action: 'Initialized',
            last_tx_hash: null,
            last_updated: new Date().toISOString(),
            version: '2.0.0'
        };
    }

    updateState(riskAssessment, policy, txHash = null) {
        this.state = {
            ...this.state,
            asset: 'CSPR',
            risk_score: riskAssessment.score,
            status: riskAssessment.state,
            price_change: riskAssessment.rawChange,
            threshold: 15,
            last_action: policy.action,
            last_tx_hash: txHash || this.state.last_tx_hash,
            last_updated: new Date().toISOString(),
            version: '2.0.0'
        };
        this.persist();
        return this.state;
    }

    persist() {
        try {
            fs.writeFileSync(this.statePath, JSON.stringify(this.state, null, 2));
        } catch (err) {
            console.error('❌ Failed to persist state:', err.message);
        }
    }

    getState() {
        return this.state;
    }
}

module.exports = StateManager;
