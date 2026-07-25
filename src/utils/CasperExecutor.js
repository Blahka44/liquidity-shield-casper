const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { CONFIG } = require('../types');

class CasperExecutor {
    constructor() {
        this.lastTxHash = null;
    }

    sessionDeploy(policy) {
        const { riskScore, state, rawChange, oracleHash, policyHash } = policy;
        
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
  --session-arg "last_action:string='${policy.action}'" \
  --session-arg "oracle_hash:string='${oracleHash || 'none'}'" \
  --session-arg "policy_hash:string='${policyHash || 'none'}'" \
  --session-arg "agent_version:string='2.1.0'"
`;

        const scriptPath = '/tmp/deploy_liquidity_shield.sh';
        const fs = require('fs');
        
        try {
            fs.writeFileSync(scriptPath, script);
            fs.chmodSync(scriptPath, '755');
            
            const output = execSync('bash ' + scriptPath + ' 2>&1', { 
                encoding: 'utf8', 
                timeout: 120000 
            });
            
            let hash = null;
            try {
                const json = JSON.parse(output);
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
                if (!hash && json.result?.deploy_hash) {
                    hash = json.result.deploy_hash;
                }
            } catch (e) {
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
                explorerUrl: 'https://testnet.cspr.live/deploy/' + hash
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

    deployTransaction(policy) {
        const contractHash = process.env.LIQUIDITY_SHIELD_CONTRACT_HASH;
        
        if (!contractHash) {
            console.log("⚠️ No stored contract hash found. Falling back to session deploy.");
            return this.sessionDeploy(policy);
        }

        const riskScore = policy.riskScore || 0;
        const state = policy.state || 'SAFE';
        const oracleHash = policy.oracleHash || 'none';
        const policyHash = policy.policyHash || 'none';
        const timestamp = Date.now();

        const script = `#!/bin/bash
cd ${CONFIG.contractDir}
casper-client put-deploy \\
  --node-address https://node.testnet.casper.network \\
  --chain-name casper-test \\
  --secret-key ${CONFIG.secretKeyPath} \\
  --payment-amount 10000000000 \\
  --session-hash ${contractHash} \\
  --session-entry-point "record_risk" \\
  --session-arg "risk_score:u64='${riskScore}'" \\
  --session-arg "status:string='${state}'" \\
  --session-arg "oracle_hash:string='${oracleHash}'" \\
  --session-arg "policy_hash:string='${policyHash}'" \\
  --session-arg "timestamp:u64='${timestamp}'"
`;

        const deployScript = path.join(CONFIG.contractDir, 'deploy_risk.sh');
        fs.writeFileSync(deployScript, script, { mode: 0o755 });

        try {
            const output = execSync(`bash ${deployScript}`, {
                encoding: 'utf-8',
                timeout: 120000,
                cwd: CONFIG.contractDir
            });

            const deployHashMatch = output.match(/"deploy_hash"\s*:\s*"([a-f0-9]{64})"/i);
            const deployHash = deployHashMatch ? deployHashMatch[1] : null;

            if (deployHash) {
                console.log(`✅ Risk recorded on stored contract: ${deployHash}`);
                return { success: true, hash: deployHash, explorerUrl: "https://testnet.cspr.live/deploy/" + deployHash, deployHash, contractHash };
            } else {
                console.error("❌ No deploy hash found in output");
                return { success: false };
            }
        } catch (error) {
            console.error("❌ Stored contract call failed:", error.message);
            return { success: false };
        }
    }



    callVaultPause() {
        const vaultHash = process.env.LIQUIDITY_SHIELD_VAULT_HASH;
        if (!vaultHash) {
            console.log("   ⚠️  No vault hash found. Skipping pause.");
            return null;
        }

        const scriptLines = [
            "#!/bin/bash",
            "cd " + CONFIG.contractDir,
            "casper-client put-deploy \\",
            "  --node-address https://node.testnet.casper.network \\",
            "  --chain-name casper-test \\",
            "  --secret-key " + CONFIG.secretKeyPath + " \\",
            "  --payment-amount 10000000000 \\",
            "  --session-hash " + vaultHash + " \\",
            "  --session-entry-point \"pause\""
        ];
        const script = scriptLines.join("\n");

        const deployScript = path.join(CONFIG.contractDir, "deploy_pause.sh");
        fs.writeFileSync(deployScript, script, { mode: 0o755 });

        try {
            const output = execSync("bash " + deployScript, {
                encoding: "utf-8",
                timeout: 120000,
                cwd: CONFIG.contractDir
            });

            const deployHashMatch = output.match(/"deploy_hash"\s*:\s*"([a-f0-9]{64})"/i);
            const deployHash = deployHashMatch ? deployHashMatch[1] : null;

            if (deployHash) {
                console.log("   🛡️  Vault PAUSED on-chain: " + deployHash);
                return { success: true, hash: deployHash };
            } else {
                console.error("   ❌ Vault pause failed: no deploy hash");
                return { success: false };
            }
        } catch (error) {
            console.error("   ❌ Vault pause error:", error.message);
            return { success: false };
        }
    }



}

module.exports = CasperExecutor;
