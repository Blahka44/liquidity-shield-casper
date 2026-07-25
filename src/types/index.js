// Configuration
const CONFIG = {
    coingeckoUrl: 'https://api.coingecko.com/api/v3/coins/casper-network?market_data=true',
    contractDir: '/home/abuchi/hackathon-project/liquidity-shield-contract',
    wasmPath: 'contract/target/wasm32-unknown-unknown/release/contract.wasm',
    secretKeyPath: '../secret_key.pem',
    threshold: 15,
    asset: 'CSPR',
    vaultHash: "hash-3a3692c8c3628c5213603efa44a0d261cb11b17d5aa7e98d29f5f883cf4b6164",
};

// State Machine States
const STATES = {
    SAFE: 'SAFE',
    MONITORING: 'MONITORING',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL',
    RECOVERING: 'RECOVERING'
};

// Risk Levels
const RISK_LEVELS = {
    SAFE: { min: 0, max: 30, label: 'SAFE' },
    CAUTION: { min: 31, max: 50, label: 'CAUTION' },
    WARNING: { min: 51, max: 75, label: 'WARNING' },
    CRITICAL: { min: 76, max: 100, label: 'CRITICAL' }
};

module.exports = { CONFIG, STATES, RISK_LEVELS };
