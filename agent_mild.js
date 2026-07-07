const fs = require('fs');
const { execSync } = require('child_process');

const CONFIG = {
    contractDir: '/home/abuchi/hackathon-project/liquidity-shield-contract',
    wasmPath: 'contract/target/wasm32-unknown-unknown/release/contract.wasm',
    secretKeyPath: '../secret_key.pem',
    threshold: 15,
    asset: 'CSPR'
};

function calculatePolicy(priceChange) {
    const abs = Math.abs(priceChange);
    const score = Math.min(100, Math.round((abs / CONFIG.threshold) * 100));
    let action = 'Monitoring';
    let status = 'STANDBY';
    if (abs >= CONFIG.threshold) {
        action = 'Protection triggered';
        status = 'ACTIVE';
    } else if (abs >= CONFIG.threshold * 0.5) {
        action = 'Evaluating';
        status = 'STANDBY';
    }
    return { score, status, action, rawChange: priceChange.toFixed(2) };
}

function deployToCasper(riskScore, status, priceChange, lastAction) {
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
  --session-arg "status:string='${status}'" \
  --session-arg "price_change:string='${priceChange}'" \
  --session-arg "asset:string='${CONFIG.asset}'" \
  --session-arg "last_action:string='${lastAction}'"
`;
    const scriptPath = '/tmp/deploy_liquidity_shield.sh';
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, '755');
    try {
        const output = execSync(scriptPath, { encoding: 'utf8', timeout: 120000 });
        const result = JSON.parse(output);
        return result.result?.transaction_hash?.Version1;
    } catch (e) {
        console.error('Deploy failed:', e.stderr || e.message);
        return null;
    }
}

function writeState(policy, txHash) {
    const state = {
        asset: CONFIG.asset,
        risk_score: policy.score,
        status: policy.status,
        price_change: policy.rawChange,
        threshold: CONFIG.threshold,
        last_action: policy.action,
        agent_status: policy.status === 'ACTIVE' ? 'Protection triggered' : 'Monitoring',
        last_update: new Date().toISOString(),
        last_tx_hash: txHash || 'pending',
        agent_version: '1.0.0-policy'
    };
    fs.writeFileSync('state.json', JSON.stringify(state, null, 2));
}

function logAudit(policy, txHash) {
    const logFile = 'audit_log.json';
    let logs = [];
    if (fs.existsSync(logFile)) logs = JSON.parse(fs.readFileSync(logFile));
    logs.push({
        timestamp: new Date().toISOString(),
        tx_hash: txHash,
        risk_score: policy.score,
        status: policy.status,
        last_action: policy.action,
        price_change_24h: policy.rawChange,
        threshold: CONFIG.threshold
    });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

async function main() {
    console.log('MILD SCENARIO: -5% price change (STANDBY)');
    const priceChange = -5.0;
    const policy = calculatePolicy(priceChange);
    console.log(`Risk Score: ${policy.score}/100, Status: ${policy.status}`);
    const txHash = deployToCasper(policy.score, policy.status, policy.rawChange, policy.action);
    if (txHash) {
        writeState(policy, txHash);
        logAudit(policy, txHash);
        console.log('Transaction:', txHash);
    }
}

main().catch(console.error);
