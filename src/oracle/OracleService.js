const https = require('https');
const { CONFIG } = require('../types');

class OracleService {
    constructor() {
        this.lastPrice = null;
        this.lastFetchTime = null;
    }

    async fetchMarketData() {
        return new Promise((resolve, reject) => {
            const req = https.get(CONFIG.coingeckoUrl, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        const priceChange = parsed.market_data?.price_change_percentage_24h || 0;
                        const currentPrice = parsed.market_data?.current_price?.usd || 0;
                        
                        this.lastPrice = currentPrice;
                        this.lastFetchTime = new Date().toISOString();
                        
                        resolve({
                            priceChange,
                            currentPrice,
                            timestamp: this.lastFetchTime,
                            source: 'coingecko'
                        });
                    } catch (err) {
                        reject(new Error(`Failed to parse market data: ${err.message}`));
                    }
                });
            });

            req.on('error', (err) => reject(new Error(`Oracle fetch failed: ${err.message}`)));
            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Oracle fetch timeout'));
            });
        });
    }

    getLastFetch() {
        return {
            price: this.lastPrice,
            time: this.lastFetchTime
        };
    }
}

module.exports = OracleService;
