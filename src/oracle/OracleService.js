const https = require('https');
const { CONFIG } = require('../types');

class OracleService {
    constructor() {
        this.lastPrice = null;
        this.lastFetchTime = null;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async fetchMarketData() {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const data = await this._fetchWithTimeout();
                
                // Parse the response
                const marketData = data.market_data;
                
                if (!marketData) {
                    throw new Error('No market_data in response');
                }

                const priceChange = marketData.price_change_percentage_24h || 0;
                const currentPrice = marketData.current_price?.usd || 0;
                
                this.lastPrice = currentPrice;
                this.lastFetchTime = new Date().toISOString();
                this.retryCount = 0;
                
                return {
                    priceChange,
                    currentPrice,
                    timestamp: this.lastFetchTime,
                    source: 'coingecko',
                    raw: data
                };
                
            } catch (err) {
                console.log(`⚠️  Oracle attempt ${attempt}/${this.maxRetries} failed: ${err.message}`);
                this.retryCount = attempt;
                
                if (attempt < this.maxRetries) {
                    // Wait before retry (exponential backoff)
                    await this._sleep(1000 * attempt);
                } else {
                    // All retries failed — use fallback
                    console.log('⚠️  Using fallback data');
                    return this._getFallbackData();
                }
            }
        }
    }

    _fetchWithTimeout() {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'LiquidityShield-Agent/2.0'
                }
            };

            const req = https.get(CONFIG.coingeckoUrl, options, (res) => {
                let data = '';
                
                // Check for rate limiting
                if (res.statusCode === 429) {
                    reject(new Error('Rate limited by CoinGecko'));
                    return;
                }
                
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }
                
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch (err) {
                        reject(new Error(`JSON parse error: ${err.message}`));
                    }
                });
            });

            req.on('error', (err) => reject(new Error(`Request failed: ${err.message}`)));
            req.setTimeout(15000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    _getFallbackData() {
        // Use last known data or simulated data for testing
        if (this.lastPrice) {
            return {
                priceChange: -18.50, // Simulated for demo
                currentPrice: this.lastPrice,
                timestamp: new Date().toISOString(),
                source: 'fallback',
                raw: null
            };
        }
        
        // First run with no data — use demo values
        return {
            priceChange: -18.50,
            currentPrice: 0.00189,
            timestamp: new Date().toISOString(),
            source: 'fallback_demo',
            raw: null
        };
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getLastFetch() {
        return {
            price: this.lastPrice,
            time: this.lastFetchTime,
            retries: this.retryCount
        };
    }
}

module.exports = OracleService;
