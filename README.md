# Liquidity Shield — Casper Agentic Buildathon 2026

## What
An autonomous risk monitoring agent that evaluates market conditions and executes protective state transitions on Casper Network without human intervention.

## Architecture
CoinGecko → Observer → Risk Analysis → Casper Transaction → Smart Contract → Dashboard
plain

## Components

| Layer | Tech | Purpose |
|-------|------|---------|
| Market Observer | Node.js | Fetches CSPR price data |
| Risk Analysis | Deterministic JS | Evaluates risk score against threshold |
| Casper Executor | casper-client | Signs and deploys state transitions |
| Smart Contract | Rust/WASM | Stores vault state on-chain |
| Dashboard | HTML/CSS/JS | Displays metrics and audit trail |

## Demo Video
https://www.loom.com/share/95bf4f11eecb43c88c0a464ee7d30202

## Live Transactions
- Vault created: `c1a4c00b...6533`
- Protection triggered: `0ddadb71...611c`, `2db68d0d...bfba`, `bf672cc4...25b3`, `5d7e60d5...0100`, `de5b6036...479f`

## Quick Start

```bash
# 1. Build contract
make build-contract

# 2. Deploy initial state
casper-client put-transaction session [args...]

# 3. Run agent
node agent.js

# 4. View dashboard
python3 -m http.server 8000
# Open http://localhost:8000/dashboard.html
Contact
abuchianah3@gmail.com

## Testing

### 1. Build the contract
```bash
make build-contract
```

### 2. Start the agent
```bash
node agent.js
```

### 3. Verify on Casper Testnet
- Check your account on https://testnet.cspr.live
- Look for new transactions every 5 minutes
- Transaction type should show "WASM deploy"

### 4. View the dashboard
```bash
python3 -m http.server 8000
# Open http://localhost:8000/dashboard.html
```

### 5. Check audit log
```bash
cat audit_log.json
```
Each entry contains timestamp, transaction hash, risk score, and status.

## Data Sources & Trust Model

- **Price Oracle:** CoinGecko API (trusted third-party source)
- **Action Attestation:** All agent decisions are recorded as permanent, verifiable transactions on Casper Testnet
- **Guarantee Scope:** The blockchain guarantees the agent acted deterministically based on the feed. Feed accuracy depends on CoinGecko's data integrity.
- **Verification:** Anyone can verify transactions independently at https://testnet.cspr.live using the account hash provided above.
