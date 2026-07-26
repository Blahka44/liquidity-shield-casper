## 🔗 Casper AI Toolkit Integration

| Tool | Status | Usage |
|---|---|---|
| **CSPR.cloud** | ✅ Integrated |  — REST API for contract state queries |
| **Odra Framework** | 🔄 Roadmap | Planned for v3 contract generation and AI-discoverable documentation |
| **CSPR.click** | 🔄 Roadmap | Planned for mainnet wallet management and transaction signing |
| **MCP Servers** | 🔄 Roadmap | Planned for multi-protocol agent queries and DeFi state access |
| **x402** | 🔄 Roadmap | Planned for pay-per-request oracle API monetization |

---

## 🎥 Live Demo
[Watch the 90-second demo](https://www.loom.com/share/c3944f7ec8b5484db2457faa67274666)

## 🔗 Live Contracts (Casper Testnet)
| Contract | Hash | Entry Points |
|---|---|---|
| **Audit Contract** |  | , ,  |
| **Vault Contract** |  | ,  |

---
# Liquidity Shield

> **Verifiable Autonomous Risk Management for Casper Network**
>
> Every autonomous decision is cryptographically linked to the exact market data that produced it, allowing any third party to independently verify that no data was altered before execution.

---

## Problem

DeFi liquidity providers lose billions to sudden market crashes because they cannot react fast enough. Manual monitoring fails when prices drop 20% in minutes while the operator is asleep. Existing solutions require trusting the agent's internal state — a black box that consumers cannot audit.

## What We Built

Liquidity Shield is an autonomous risk monitoring agent that evaluates market conditions and executes protective state transitions on Casper Network. Unlike conventional automation, every decision carries cryptographic proof of the data and policy that produced it, enabling independent verification without trusting the agent.

---

## System Invariants

| Invariant | Guarantee |
|-----------|-----------|
| **Invariant 1** | Every policy references exactly one oracle snapshot |
| **Invariant 2** | Every oracle snapshot has one immutable SHA-256 hash |
| **Invariant 3** | Every blockchain transaction references one policy hash |
| **Invariant 4** | Every audit record is reproducible |

---

## Trust Architecture
CoinGecko API
|
v
SHA-256 Oracle Hash
|
v
Risk Engine
|
v
Policy Engine
|
v
SHA-256 Policy Hash
|
v
Casper Executor
|
v
Casper Testnet
|
v
Independent Verification
plain

**Traceability:** Oracle Hash → Policy Hash → Transaction Hash. Every object references its parent.

---

## Components

| Module | Responsibility | Key Feature |
|--------|---------------|-------------|
| `OracleService` | Fetch market data | SHA-256 hash of raw JSON before parsing |
| `RiskEngine` | Multi-factor scoring | Price (60%) + Volatility (25%) + Trend (15%) |
| `PolicyEngine` | Generate decisions | Structured policy with cryptographic fingerprint |
| `CasperExecutor` | Deploy transactions | Handles Casper API v2.0 nested hash format |
| `AuditLogger` | Record history | Append-only structured events |
| `VerificationService` | Independent validation | Recomputes hashes, detects tampering |
| `StateManager` | Persist state | JSON storage with versioning |

---

## State Machine
SAFE --> MONITORING --> WARNING --> CRITICAL --> RECOVERING --> SAFE
plain

| State | Risk Score | Action |
|-------|-----------|--------|
| SAFE | 0-30 | No deployment |
| MONITORING | 31-50 | Standard monitoring |
| WARNING | 51-75 | Elevated monitoring + deploy |
| CRITICAL | 76-100 | Protection triggered + deploy |
| RECOVERING | Variable | Recovery detected |

---

## Verification Demo

### Verify Authentic Data

```bash
node test_verification.js
Expected output:
plain
VERIFIED: Oracle response hash matches blockchain record
VERIFIED: Policy hash matches blockchain record
YES: Full chain valid
OVERALL RESULT: VERIFIED
Detect Tampered Data
The VerificationService can detect if oracle data was modified after the fact by recomputing the hash and comparing to the on-chain record.
Live Transactions
Account: 016c9af86e958e3d67963936e69396ba5db8a355272aa06dd0298afb41ca1d940f
Table
Transaction	Action	Version
0ddadb71...611c	Vault creation	v1.0
eb26b40c...0443f	Protection triggered	v1.0
418b758f...de113	Protection triggered	v1.0
66604fac...43e9f	Protection triggered	v2.1 (with oracle_hash + policy_hash)
12+ confirmed transactions. Dashboard updates in real-time.
Quick Start
bash
# 1. Install dependencies
npm install

# 2. Build contract
make build-contract

# 3. Run agent
node agent.js

# 4. View dashboard
python3 -m http.server 8000
# Open http://localhost:8000/dashboard.html

# 5. Verify hashes
node test_verification.js
Tech Stack
Table
Layer	Technology
Agent Runtime	Node.js 20
Smart Contract	Rust + WASM
Blockchain	Casper Network (Testnet)
Price Oracle	CoinGecko API
Cryptography	Node.js crypto (SHA-256)
Dashboard	Vanilla HTML/CSS/JS
Why Casper?
Casper's account-based model and predictable gas costs make it ideal for autonomous agents that must operate reliably without human intervention. The put-transaction API v2.0 provides structured JSON responses that enable programmatic hash extraction — critical for verifiable automation.
Future Roadmap
[ ] Multi-oracle aggregation (CoinGecko + Binance + Chainlink)
[ ] TEE-based execution environments for hardware attestation
[ ] Governance module for multi-sig critical actions
[ ] Mainnet deployment with production-grade monitoring
Contact
Abuchi Anah — abuchianah3@gmail.com
GitHub: https://github.com/Blahka44/liquidity-shield-casper
DoraHacks: https://dorahacks.io/buidl/46744
