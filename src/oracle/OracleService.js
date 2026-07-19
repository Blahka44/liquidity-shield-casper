const https = require('https');
const crypto = require('crypto');
const { CONFIG } = require('../types');

class OracleService {
    constructor() {
        this.lastPrice = null;
        this.lastFetchTime = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.lastRawResponse = null;
        this.lastOracleHash = null;
    }

    async fetchMarketData() {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const rawJson = await this._fetchRawJson();
                const data = JSON.parse(rawJson);
                
                const oracleHash = crypto.createHash('sha256').update(rawJson).digest('hex');
                
                const marketData = data.market_data;
                if (!marketData) {
                    throw new Error('No market_data in response');
                }

                const priceChange = marketData.price_change_percentage_24h || 0;
                const currentPrice = marketData.current_price?.usd || 0;
                
                this.lastPrice = currentPrice;
                this.lastFetchTime = new Date().toISOString();
                this.lastRawResponse = rawJson;
                this.lastOracleHash = oracleHash;
                this.retryCount = 0;
                
                return {
                    priceChange,
                    currentPrice,
                    timestamp: this.lastFetchTime,
                    source: 'coingecko',
                    oracleHash,
                    rawResponse: rawJson
                };
                
            } catch (err) {
                console.log('⚠️  Oracle attempt ' + attempt + '/' + this.maxRetries + ' failed: ' + err.message);
                this.retryCount = attempt;
                
                if (attempt < this.maxRetries) {
                    await this._sleep(1000 * attempt);
                } else {
                    console.log('⚠️  Using fallback data');
                    return this._getFallbackData();
                }
            }
        }
    }

    _fetchRawJson() {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'LiquidityShield-Agent/2.1'
                }
            };

            const req = https.get(CONFIG.coingeckoUrl, options, (res) => {
                let data = '';
                
                if (res.statusCode === 429) {
                    reject(new Error('Rate limited by CoinGecko'));
                    return;
                }
                
                if (res.statusCode !== 200) {
                    reject(new Error('HTTP ' + res.statusCode));
                    return;
                }
                
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            });

            req.on('error', (err) => reject(new Error('Request failed: ' + err.message)));
            req.setTimeout(15000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    _getFallbackData() {
        const rawJson = JSON.stringify({
            market_data: {
                price_change_percentage_24h: -18.50,
                current_price: { usd: 0.00189 }
            }
        });
        const oracleHash = crypto.createHash('sha256').update(rawJson).digest('hex');
        
        return {
            priceChange: -18.50,
            currentPrice: 0.00189,
            timestamp: new Date().toISOString(),
            source: 'fallback_demo',
            oracleHash,
            rawResponse: rawJson
        };
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getLastFetch() {
        return {
            price: this.lastPrice,
            time: this.lastFetchTime,
            retries: this.retryCount,
            oracleHash: this.lastOracleHash
        };
    }
}

module.exports = OracleService;
