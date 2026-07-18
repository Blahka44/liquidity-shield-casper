const { CONFIG, RISK_LEVELS, STATES } = require('../types');

class RiskEngine {
    constructor() {
        this.history = [];
        this.maxHistory = 10;
    }

    calculateRisk(marketData) {
        const { priceChange } = marketData;
        const absChange = Math.abs(priceChange);
        
        // Base score from price change vs threshold
        let baseScore = Math.min(100, Math.round((absChange / CONFIG.threshold) * 100));
        
        // Volatility factor: if price is dropping fast, increase score
        const volatilityFactor = this.calculateVolatility();
        
        // Trend factor: consecutive negative changes increase risk
        const trendFactor = this.calculateTrend();
        
        // Combine factors
        let finalScore = Math.min(100, Math.round(
            baseScore * 0.6 + 
            volatilityFactor * 0.25 + 
            trendFactor * 0.15
        ));

        // Update history
        this.history.push({
            timestamp: new Date().toISOString(),
            priceChange,
            baseScore,
            volatilityFactor,
            trendFactor,
            finalScore
        });
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        const riskLevel = this.getRiskLevel(finalScore);
        const state = this.determineState(finalScore, priceChange);

        return {
            score: finalScore,
            level: riskLevel,
            state: state,
            rawChange: priceChange.toFixed(2),
            factors: {
                base: baseScore,
                volatility: volatilityFactor,
                trend: trendFactor
            }
        };
    }

    calculateVolatility() {
        if (this.history.length < 2) return 0;
        const changes = this.history.map(h => Math.abs(parseFloat(h.priceChange)));
        const avg = changes.reduce((a, b) => a + b, 0) / changes.length;
        const variance = changes.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / changes.length;
        const volatility = Math.sqrt(variance);
        return Math.min(100, Math.round(volatility * 5));
    }

    calculateTrend() {
        if (this.history.length < 3) return 0;
        const recent = this.history.slice(-3);
        const negativeCount = recent.filter(h => parseFloat(h.priceChange) < 0).length;
        return Math.min(100, negativeCount * 33);
    }

    getRiskLevel(score) {
        for (const [key, level] of Object.entries(RISK_LEVELS)) {
            if (score >= level.min && score <= level.max) {
                return level.label;
            }
        }
        return RISK_LEVELS.CRITICAL.label;
    }

    determineState(score, priceChange) {
        if (score >= 90) return STATES.CRITICAL;
        if (score >= 70) return STATES.WARNING;
        if (score >= 50) return STATES.MONITORING;
        if (score >= 30 && priceChange < 0) return STATES.RECOVERING;
        return STATES.SAFE;
    }

    getHistory() {
        return this.history;
    }
}

module.exports = RiskEngine;
