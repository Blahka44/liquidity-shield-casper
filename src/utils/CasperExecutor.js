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
        
        try {
            require('fs').writeFileSync(scriptPath, script);
            require('fs').chmodSync(scriptPath, '755');
            
            const output = execSync(`bash ${scriptPath}`, { encoding: 'utf8', timeout: 120000 });
            
            // Extract transaction hash from output
            const hashMatch = output.match(/transaction_hash["\s:]+([a-f0-9]{64})/i) || 
                              output.match(/deploy_hash["\s:]+([a-f0-9]{64})/i);
            
            this.lastTxHash = hashMatch ? hashMatch[1] : null;
            
            if (!this.lastTxHash) {
                throw new Error('Could not extract transaction hash from deployment output');
            }

            return {
                success: true,
                hash: this.lastTxHash,
                explorerUrl: `https://testnet.cspr.live/deploy/${this.lastTxHash}`
            };
        } catch (err) {
            return {
                success: false,
                error: err.message,
                output: err.stdout || ''
            };
        }
    }

    getLastTxHash() {
        return this.lastTxHash;
    }
}

module.exports = CasperExecutor;
