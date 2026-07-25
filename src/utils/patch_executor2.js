const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'CasperExecutor.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Rename ALL occurrences of deployTransaction to sessionDeploy in method definitions
// This handles both 'deployTransaction(' and 'async deployTransaction('
content = content.replace(/(\s+)deployTransaction(\s*\()/g, '$1sessionDeploy$2');

// Now insert the new deployTransaction method before the last closing brace
const newMethod = `
    async deployTransaction(policy) {
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

        const script = \`#!/bin/bash
cd \${CONFIG.contractDir}
casper-client put-deploy \\\\
  --node-address https://node.testnet.casper.network \\\\
  --chain-name casper-test \\\\
  --secret-key \${CONFIG.secretKeyPath} \\\\
  --payment-amount 10000000000 \\\\
  --session-hash \${contractHash} \\\\
  --session-entry-point "record_risk" \\\\
  --session-arg "risk_score:u64='\${riskScore}'" \\\\
  --session-arg "status:string='\${state}'" \\\\
  --session-arg "oracle_hash:string='\${oracleHash}'" \\\\
  --session-arg "policy_hash:string='\${policyHash}'" \\\\
  --session-arg "timestamp:u64='\${timestamp}'"
\`;

        const deployScript = path.join(CONFIG.contractDir, 'deploy_risk.sh');
        fs.writeFileSync(deployScript, script, { mode: 0o755 });

        try {
            const output = execSync(\`bash \${deployScript}\`, {
                encoding: 'utf-8',
                timeout: 120000,
                cwd: CONFIG.contractDir
            });

            const deployHashMatch = output.match(/deploy_hash:\\s*([a-f0-9]{64})/i);
            const deployHash = deployHashMatch ? deployHashMatch[1] : null;

            if (deployHash) {
                console.log(\`✅ Risk recorded on stored contract: \${deployHash}\`);
                return { deployHash, contractHash };
            } else {
                console.error("❌ No deploy hash found in output");
                return null;
            }
        } catch (error) {
            console.error("❌ Stored contract call failed:", error.message);
            return null;
        }
    }
`;

// Find the last closing brace of the class and insert before it
const lastBrace = content.lastIndexOf('}');
if (lastBrace !== -1) {
    content = content.slice(0, lastBrace) + newMethod + '\n' + content.slice(lastBrace);
}

fs.writeFileSync(filePath, content);
console.log('✅ CasperExecutor.js patched successfully');
