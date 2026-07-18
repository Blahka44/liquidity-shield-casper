const fs = require('fs');
const path = require('path');

class AuditLogger {
    constructor(logPath = 'audit_log.json') {
        this.logPath = logPath;
        this.events = this.loadEvents();
    }

    loadEvents() {
        try {
            if (fs.existsSync(this.logPath)) {
                const data = fs.readFileSync(this.logPath, 'utf8');
                return JSON.parse(data);
            }
        } catch (err) {
            console.warn('⚠️  Could not load existing audit log, starting fresh');
        }
        return [];
    }

    logEvent(event) {
        const auditEvent = {
            id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            actor: event.actor || 'LiquidityShieldAgent',
            component: event.component || 'system',
            action: event.action,
            reason: event.reason,
            riskScore: event.riskScore,
            state: event.state,
            transactionHash: event.transactionHash || null,
            result: event.result || 'pending',
            metadata: event.metadata || {}
        };

        this.events.push(auditEvent);
        this.persist();
        return auditEvent;
    }

    logOracleFetch(marketData) {
        return this.logEvent({
            component: 'oracle',
            action: 'fetch_market_data',
            reason: `Fetched CSPR price: $${marketData.currentPrice}, change: ${marketData.priceChange}%`,
            riskScore: null,
            state: null,
            metadata: { source: marketData.source, timestamp: marketData.timestamp }
        });
    }

    logRiskAssessment(riskAssessment) {
        return this.logEvent({
            component: 'risk_engine',
            action: 'risk_assessment',
            reason: `Risk score: ${riskAssessment.score}/100 (${riskAssessment.level})`,
            riskScore: riskAssessment.score,
            state: riskAssessment.state,
            metadata: { factors: riskAssessment.factors }
        });
    }

    logPolicyGenerated(policy) {
        return this.logEvent({
            component: 'policy_engine',
            action: 'policy_generated',
            reason: policy.reason,
            riskScore: policy.riskScore,
            state: policy.state,
            metadata: { policyId: policy.id, action: policy.action }
        });
    }

    logTransaction(policy, txHash) {
        return this.logEvent({
            component: 'casper_executor',
            action: 'deploy_transaction',
            reason: policy.reason,
            riskScore: policy.riskScore,
            state: policy.state,
            transactionHash: txHash,
            result: 'success',
            metadata: { policyId: policy.id }
        });
    }

    logError(component, error, context = {}) {
        return this.logEvent({
            component: component,
            action: 'error',
            reason: error.message || error,
            riskScore: context.riskScore || null,
            state: context.state || null,
            result: 'failed',
            metadata: { stack: error.stack, context }
        });
    }

    persist() {
        try {
            fs.writeFileSync(this.logPath, JSON.stringify(this.events, null, 2));
        } catch (err) {
            console.error('❌ Failed to persist audit log:', err.message);
        }
    }

    getEvents() {
        return this.events;
    }

    getRecentEvents(count = 10) {
        return this.events.slice(-count);
    }
}

module.exports = AuditLogger;
