const { CONFIG } = require('../types');

class PolicyEngine {
    constructor() {
        this.policies = [];
    }

    generatePolicy(riskAssessment, marketData) {
        const { score, state, level, rawChange } = riskAssessment;
        
        let action = 'Monitoring';
        let requiresApproval = false;
        let reason = '';

        if (state === 'CRITICAL') {
            action = 'Protection triggered';
            requiresApproval = false;
            reason = `Critical risk detected: ${score}/100. Price change: ${rawChange}%. Immediate protection required.`;
        } else if (state === 'WARNING') {
            action = 'Elevated monitoring';
            requiresApproval = false;
            reason = `Warning level: ${score}/100. Price change: ${rawChange}%. Enhanced monitoring active.`;
        } else if (state === 'MONITORING') {
            action = 'Standard monitoring';
            requiresApproval = false;
            reason = `Monitoring: ${score}/100. Price change: ${rawChange}%.`;
        } else if (state === 'RECOVERING') {
            action = 'Recovery detected';
            requiresApproval = false;
            reason = `Market recovering: ${score}/100. Price change: ${rawChange}%.`;
        } else {
            action = 'Safe operation';
            requiresApproval = false;
            reason = `Safe: ${score}/100. Price change: ${rawChange}%.`;
        }

        const policy = {
            id: `policy-${Date.now()}`,
            timestamp: new Date().toISOString(),
            riskScore: score,
            riskLevel: level,
            state: state,
            action: action,
            reason: reason,
            requiresApproval: requiresApproval,
            marketData: {
                priceChange: rawChange,
                currentPrice: marketData.currentPrice,
                source: marketData.source
            },
            executed: false
        };

        this.policies.push(policy);
        
        // Keep only last 50 policies
        if (this.policies.length > 50) {
            this.policies.shift();
        }

        return policy;
    }

    getPolicies() {
        return this.policies;
    }

    getLatestPolicy() {
        return this.policies[this.policies.length - 1] || null;
    }
}

module.exports = PolicyEngine;
