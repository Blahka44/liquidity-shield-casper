# Liquidity Shield — Casper Agentic Buildathon 2026

## Problem

DeFi liquidity providers lose billions to sudden market crashes because they can't react fast enough. Manual monitoring fails when prices drop 20% in minutes while you're asleep. Liquidity Shield is an autonomous agent that never sleeps, never panics, and executes protective state transitions based on code — not emotion.

## What

An autonomous risk monitoring agent that evaluates market conditions and executes protective state transitions on Casper Network without human intervention.

## Architecture

CoinGecko → Observer → Risk Analysis → Casper Transaction → Smart Contract → Dashboard

## Components

| Layer | Tech | Purpose |
|-------|------|---------|
| Market Observer | Node.js | Fetches CSPR price data |
| Risk Analysis | Deterministic JS | Evaluates risk score against threshold |
| Casper Executor | casper-client | Signs and deploys state transitions |
| Smart Contract | Rust/WASM | Stores vault state on-chain |
| Dashboard | HTML/CSS/JS | Displays metrics and audit trail |

## How it works

1. **Observe** — Fetches CSPR price data from CoinGecko API
2. **Evaluate** — Calculates risk score based on 24h price change vs configurable threshold
3. **Act** — Automatically deploys state transitions to Casper Testnet when risk exceeds threshold
4. **Audit** — Every action is recorded with transaction hashes on-chain and displayed in real-time dashboard

## Demo Video

https://www.loom.com/share/95bf4f11eecb43c88c0a464ee7d30202

## Live Transactions

Account: `016c9af86e958e3d67963936e69396ba5db8a355272aa06dd0298afb41ca1d940f`

| Transaction | Action |
|-------------|--------|
| [0ddadb71...611c](https://testnet.cspr.live/deploy/0ddadb71e096f2976428ab56c904f76a5e26237245421560b07e4aee4f3b611c) | Vault creation |
| [eb26b40c...0443f](https://testnet.cspr.live/deploy/eb26b40cfbc5f87434536516b9e82b5ac9db6f9a19dceb218bdce76b1280443f) | Protection triggered |
| [418b758f...de113](https://testnet.cspr.live/deploy/418b758fa2dc027f6e907467b34843aecc4f28b7d5556a7bd27d31f7711de113) | Protection triggered |
| [455a8209...dc622](https://testnet.cspr.live/deploy/455a820927e8c7aa37a15c91752c6a4c77ad2bdeea6eca2f9f7d3ce4609dc622) | Monitoring (STANDBY) |

10+ confirmed transactions with full audit trail. Dashboard updates in real-time.

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

Testing
1. Build the contract
bash
make build-contract

2. Start the agent
bash
node agent.js

3. Verify on Casper Testnet
Check your account on https://testnet.cspr.live
Look for new transactions every 5 minutes
Transaction type should show "WASM deploy"

4. View the dashboard
bash
python3 -m http.server 8000
# Open http://localhost:8000/dashboard.html5. Check audit log
5.Check audit log
bash
cat audit_log.json
Each entry contains timestamp, transaction hash, risk score, and status.

Data Sources and Trust Model
Price Oracle: CoinGecko API (trusted third-party source)
Action Attestation: All agent decisions are recorded as permanent, verifiable transactions on Casper Testnet
Guarantee Scope: The blockchain guarantees the agent acted deterministically based on the feed. Feed accuracy depends on CoinGecko data integrity.
Verification: Anyone can verify transactions independently at https://testnet.cspr.live using the account hash provided above.

Contact
abuchianah3@gmail.com
