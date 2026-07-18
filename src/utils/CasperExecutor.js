const { execSync } = require('child_process');
const { CONFIG } = require('../types');

class CasperExecutor {
    constructor() {
        this.lastTxHash = null;
    }

    deployTransaction(policy) {
        const { riskScore, state, rawChange } = policy;
        
        const script = `#!/bin/bash
cd ${CONFIG.contractDir}
casper-client put-transaction session \
  --node-address https://node.testnet.casper.network/rpc \
  --chain-name casper-test \
  --secret-key ${CONFIG.secretKeyPath} \
  --payment-amount 5000000000 \
  --standard-payment true \
  --gas-price-tolerance 1 \
  --wasm-path ${CONFIG.wasmPath} \
  --session-arg "risk_score:u64='${riskScore}'" \
  --session-arg "status:string='${state}'" \
  --session-arg "price_change:string='${rawChange}'" \
  --session-arg "asset:string='${CONFIG.asset}'" \
  --session-arg "last_action:string='${policy.action}'"
`;

        const scriptPath = '/tmp/deploy_liquidity_shield.sh';
        const fs = require('fs');
        
        try {
            fs.writeFileSync(scriptPath, script);
            fs.chmodSync(scriptPath, '755');
            
            const output = execSync(`bash ${scriptPath} 2>&1`, { 
                encoding: 'utf8', 
                timeout: 120000 
            });
            
            // Parse JSON response
            let hash = null;
            try {
                const json = JSON.parse(output);
                // Handle nested format: transaction_hash.Version1
                if (json.result?.transaction_hash) {
                    const txHash = json.result.transaction_hash;
                    if (typeof txHash === 'string') {
                        hash = txHash;
                    } else if (txHash.Version1) {
                        hash = txHash.Version1;
                    } else if (txHash.Deploy) {
                        hash = txHash.Deploy;
                    }
                }
                // Also check for deploy_hash
                if (!hash && json.result?.deploy_hash) {
                    hash = json.result.deploy_hash;
                }
            } catch (e) {
                // Fallback: try regex patterns
                const match = output.match(/([a-f0-9]{64})/i);
                if (match) hash = match[1];
            }
            
            this.lastTxHash = hash;
            
            if (!hash) {
                return {
                    success: false,
                    error: 'Could not extract transaction hash',
                    output: output.substring(0, 2000)
                };
            }

            return {
                success: true,
                hash: hash,
                explorerUrl: `https://testnet.cspr.live/deploy/${hash}`
            };
        } catch (err) {
            return {
                success: false,
                error: err.message,
                output: err.stdout || err.stderr || ''
            };
        }
    }

    getLastTxHash() {
        return this.lastTxHash;
    }
}

module.exports = CasperExecutor;
