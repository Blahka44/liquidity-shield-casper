const crypto = require('crypto');

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
            reason = 'Critical risk detected: ' + score + '/100. Price change: ' + rawChange + '%. Immediate protection required.';
        } else if (state === 'WARNING') {
            action = 'Elevated monitoring';
            requiresApproval = false;
            reason = 'Warning level: ' + score + '/100. Price change: ' + rawChange + '%. Enhanced monitoring active.';
        } else if (state === 'MONITORING') {
            action = 'Standard monitoring';
            requiresApproval = false;
            reason = 'Monitoring: ' + score + '/100. Price change: ' + rawChange + '%.';
        } else if (state === 'RECOVERING') {
            action = 'Recovery detected';
            requiresApproval = false;
            reason = 'Market recovering: ' + score + '/100. Price change: ' + rawChange + '%.';
        } else {
            action = 'Safe operation';
            requiresApproval = false;
            reason = 'Safe: ' + score + '/100. Price change: ' + rawChange + '%.';
        }

        // Build the base policy object (without policyHash)
        const basePolicy = {
            id: 'policy-' + Date.now(),
            timestamp: new Date().toISOString(),
            riskScore: score,
            riskLevel: level,
            state: state,
            action: action,
            reason: reason,
            requiresApproval: requiresApproval,
            oracleHash: marketData.oracleHash || null,
            marketData: {
                priceChange: rawChange,
                currentPrice: marketData.currentPrice,
                source: marketData.source
            },
            executed: false
        };

        // Compute SHA-256 hash of the base policy (BEFORE adding policyHash)
        const policyString = JSON.stringify(basePolicy, Object.keys(basePolicy).sort());
        const policyHash = crypto.createHash('sha256').update(policyString).digest('hex');

        // Now add the hash to the policy
        const policy = {
            ...basePolicy,
            policyHash: policyHash
        };

        this.policies.push(policy);
        
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
