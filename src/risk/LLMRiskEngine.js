const OpenAI = require('openai');

class LLMRiskEngine {
  constructor(apiKey, model) {
    apiKey = apiKey || process.env.GROQ_API_KEY;
    model = model || 'llama-3.3-70b-versatile';
    if (!apiKey) {
      throw new Error('GROQ_API_KEY required. Get one free at console.groq.com/keys');
    }
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1'
    });
    this.model = model;
  }

  async calculateRisk(marketData) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a DeFi risk analyst for Casper Network. Respond with JSON only: {"score": 0-100, "state": "SAFE|WARNING|CRITICAL", "reasoning": "string", "action": "string"}'
          },
          {
            role: 'user',
            content: 'CSPR price: $' + marketData.currentPrice + ', 24h change: ' + marketData.priceChange + '%'
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      });
      const assessment = JSON.parse(response.choices[0].message.content);
      return {
        score: assessment.score,
        state: assessment.state,
        level: assessment.state,
        rawChange: parseFloat(marketData.priceChange).toFixed(2),
        reasoning: assessment.reasoning,
        recommendedAction: assessment.action,
        factors: {
          base: assessment.score,
          volatility: 0,
          trend: 0,
          llmSentiment: 'neutral'
        },
        source: 'llm',
        llmModel: this.model
      };
    } catch (err) {
      console.error('LLM failed, falling back:', err.message);
      return this.fallback(marketData);
    }
  }

  fallback(marketData) {
    const priceChange = parseFloat(marketData.priceChange);
    const abs = Math.abs(priceChange);
    const score = Math.min(100, Math.round((abs / 15) * 100));
    const state = score >= 90 ? 'CRITICAL' : score >= 70 ? 'WARNING' : score >= 50 ? 'MONITORING' : 'SAFE';
    return {
      score: score,
      state: state,
      level: state,
      rawChange: priceChange.toFixed(2),
      reasoning: 'Deterministic fallback (LLM unavailable).',
      recommendedAction: state === 'CRITICAL' ? 'Protection triggered' : 'Standard monitoring',
      factors: {
        base: score,
        volatility: 0,
        trend: 0,
        llmSentiment: 'unknown'
      },
      source: 'fallback_deterministic',
      llmModel: null
    };
  }
}

module.exports = LLMRiskEngine;
