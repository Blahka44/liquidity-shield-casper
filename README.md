# Liquidity Shield

> **Liquidity Shield is an autonomous AI risk agent for Casper DeFi. It monitors live markets, explains its decisions in natural language, records them immutably on-chain, and automatically pauses protected vaults during critical market conditions.**

Traditional DeFi monitoring generates alerts that require human intervention. During rapid market events, delays of even a few minutes can lead to significant losses. Liquidity Shield demonstrates an alternative: an autonomous agent that reasons about risk, creates cryptographically verifiable decisions, and immediately executes protective actions on-chain — without human approval.

## 🔗 Current Casper Integrations

| Tool | Status | Usage |
|---|---|---|
| **casper-js-sdk** | ✅ Active | On-chain state queries (CasperSDKClient.js) |
| **Casper Client CLI** | ✅ Active | Autonomous transaction signing (casper-client put-deploy) |
| **CSPR.cloud REST API** | ✅ Evaluated | Contract state queries; planned for v2 dashboard |

## 🔄 Future Roadmap

| Tool | Planned Use |
|---|---|
| **Odra Framework** | AI-discoverable contract generation for v3 |
| **CSPR.click** | Browser wallet UX for dashboard v2 |
| **MCP Servers** | Multi-protocol agent orchestration |
| **x402 Micropayments** | Pay-per-request oracle monetization |

---

## 🎥 Live Demo
[Watch the 90-second demo](https://www.loom.com/share/c3944f7ec8b5484db2457faa67274666)

## 🎬 Demo Modes

**Production mode** (══════════════════════════════════════════════════
  LIQUIDITY SHIELD — FINALS DEMO
  AI-Powered Risk Analysis (Groq LLM)
══════════════════════════════════════════════════

📡 PHASE 1: Normal Market Monitoring
─────────────────────────────────────
   Price: $0.00160022
   24h Change: 4.25207%
   Risk Score: 80/100 (SAFE)
   💡 AI Reasoning: The 24-hour price change of 4.25% is relatively moderate, indicating a stable market condition for CSPR.
   ✅ System stable. No action needed.

📊 PHASE 6: Dashboard
─────────────────────────────────────
   Open: http://localhost:8000/dashboard.html
   (Shows full audit trail with transaction hash)

══════════════════════════════════════════════════
  DEMO COMPLETE
══════════════════════════════════════════════════):
- Fetches live CSPR price data from CoinGecko API
- Real Groq LLM 3.3 70B risk reasoning in natural language
- Deploys to Casper testnet only when risk score ≥ WARNING (51+)
- Vault pause triggered only on CRITICAL state (76+)

**Demo mode** (══════════════════════════════════════════════════
  LIQUIDITY SHIELD — FINALS DEMO
  AI-Powered Risk Analysis (Groq LLM)
══════════════════════════════════════════════════

📡 PHASE 1: Normal Market Monitoring
─────────────────────────────────────
   Price: $0.00160022
   24h Change: 4.25207%
   Risk Score: 80/100 (SAFE)
   💡 AI Reasoning: The 24-hour price change of 4.25% is relatively moderate, indicating a stable market condition for CSPR.
   ✅ System stable. No action needed.

📡 PHASE 2: Simulating Market Crash
─────────────────────────────────────
   Simulated Price: $0.00130418
   Simulated Change: -18.50%
   Risk Score: 85/100 (CRITICAL)
   💡 AI Reasoning: The 24-hour price change of -18.50% indicates a significant decline in CSPR's value, suggesting high market volatility and potential liquidity risks.
   🚨 CRITICAL STATE DETECTED

📋 PHASE 3: Policy Generation
─────────────────────────────────────
   Action: Protection triggered
   Oracle Hash: dfe5789259d52edbbb6d6b7a8347860e...
   Policy Hash: 138a3025f13cad60c641d2c4bff16692...

⛓️  PHASE 4: Deploying to Casper
─────────────────────────────────────
✅ Risk recorded on stored contract: bf50388ba7f57ef90d7a5b19298c4b16637ef50bcf21ce19a7388715125aed4d
   ✅ Deployed successfully
   Hash: bf50388ba7f57ef90d7a5b19298c4b16637ef50bcf21ce19a7388715125aed4d
   Explorer: https://testnet.cspr.live/deploy/bf50388ba7f57ef90d7a5b19298c4b16637ef50bcf21ce19a7388715125aed4d

🛡️  PHASE 4b: Pausing Vault
─────────────────────────────────────
   🛡️  Vault PAUSED on-chain: 5c8246e79a26850543223c00603207030e56a9ca42e9240f488dd59161a1ee3d
   ✅ Vault PAUSED on-chain
   Hash: 5c8246e79a26850543223c00603207030e56a9ca42e9240f488dd59161a1ee3d

🔍 PHASE 5: On-Chain Verification
─────────────────────────────────────
   Run: node verify.js --tx bf50388ba7f57ef90d7a5b19298c4b16637ef50bcf21ce19a7388715125aed4d
   (Verification runs independently)

📊 PHASE 6: Dashboard
─────────────────────────────────────
   Open: http://localhost:8000/dashboard.html
   (Shows full audit trail with transaction hash)

══════════════════════════════════════════════════
  DEMO COMPLETE
══════════════════════════════════════════════════):
- Identical pipeline, but injects a simulated -18.5% market crash
- Guarantees CRITICAL state for deterministic video demonstration
- Used for the 90-second demo video and judging walkthrough

---

## 🔗 Live Contracts (Casper Testnet)

| Contract | Hash | Entry Points |
|---|---|---|
| **Audit Contract** | `hash-3a3692c8c3628c5213603efa44a0d261cb11b17d5aa7e98d29f5f883cf4b6164` | `record_risk`, `get_latest_risk`, `get_state` |
| **Vault Contract** | `hash-755d37a7e53f4138146b9650720a6caea8a355722b055c91b85ca29db0f80fa8` | `pause`, `is_paused` |

---

# Liquidity Shield

> **Liquidity Shield is an autonomous AI risk agent for Casper DeFi. It monitors live markets, explains its decisions in natural language, records them immutably on-chain, and automatically pauses protected vaults during critical market conditions.**

Traditional DeFi monitoring generates alerts that require human intervention. During rapid market events, delays of even a few minutes can lead to significant losses. Liquidity Shield demonstrates an alternative: an autonomous agent that reasons about risk, creates cryptographically verifiable decisions, and immediately executes protective actions on-chain — without human approval.

**Verifiable Autonomous Risk Management for Casper Network**

Every autonomous decision is cryptographically linked to the exact market data that produced it, allowing any third party to independently verify that no data was altered before execution.

## Problem

DeFi liquidity providers lose billions to sudden market crashes because they cannot react fast enough. Manual monitoring fails when prices drop 20% in minutes while the operator is asleep. Existing solutions require trusting the agent's internal state — a black box that consumers cannot audit.

## What We Built (v2.2)

Liquidity Shield is an **autonomous LLM-powered risk agent** for Casper DeFi. It fetches live market data, reasons about risk in **natural language via Groq (Llama 3.3 70B)**, generates SHA-256 hashes of oracle data and policy decisions, and commits everything to an immutable **audit contract** on Casper testnet. When risk is **CRITICAL**, it automatically calls `pause()` on a separate **vault contract** to freeze deposits. Anyone can independently verify on-chain integrity using `verify.js`.

## Trust Architecture
CoinGecko API → SHA-256 Oracle Hash → LLM Risk Engine (Groq) → Policy Engine → SHA-256 Policy Hash → Casper Executor → Audit Contract + Vault Contract → Independent Verification
plain

**Traceability:** Oracle Hash → Policy Hash → Transaction Hash. Every object references its parent.

## System Invariants

| Invariant | Guarantee |
|---|---|
| Invariant 1 | Every policy references exactly one oracle snapshot |
| Invariant 2 | Every oracle snapshot has one immutable SHA-256 hash |
| Invariant 3 | Every blockchain transaction references one policy hash |
| Invariant 4 | Every audit record is independently reproducible |

## Components

| Module | Responsibility | Key Feature |
|---|---|---|
| **OracleService** | Fetch market data | SHA-256 hash of raw JSON before parsing |
| **LLMRiskEngine** | AI risk reasoning | Natural language explanation via Groq LLM |
| **PolicyEngine** | Generate decisions | Structured policy with cryptographic fingerprint |
| **CasperExecutor** | Deploy transactions | Calls stored contract entry points (`record_risk`, `pause`) |
| **AuditLogger** | Record history | Append-only structured events |
| **VerificationService** | Independent validation | Pulls on-chain data, recomputes hashes, detects tampering |

## State Machine
SAFE → MONITORING → WARNING → CRITICAL → RECOVERING → SAFE
plain

| State | Risk Score | Action |
|---|---|---|
| **SAFE** | 0–30 | No deployment |
| **MONITORING** | 31–50 | Standard monitoring |
| **WARNING** | 51–75 | Elevated monitoring + record to audit contract |
| **CRITICAL** | 76–100 | Record to audit contract + **pause vault on-chain** |
| **RECOVERING** | Variable | Recovery detected |

## Verification Demo

### Verify Authentic Data

```bash
node verify.js --tx <deploy_hash>
Expected output:
plain
✅ VERIFICATION SUCCESSFUL
On-chain data is valid and consistent.
Risk Score: 85 / 100
Status: CRITICAL
Detect Tampered Data
The VerificationService can detect if oracle data was modified after the fact by recomputing the hash and comparing to the on-chain record.
Live Transactions
Account: 016c9af86e958e3d67963936e69396ba5db8a355272aa06dd0298afb41ca1d940f
Table
Transaction	Action	Version
712b3b40...89b5ff	Vault contract deployed	v2.2
f8e36735...6d746	Audit contract record_risk (CRITICAL)	v2.2
d35c8e09...4588	Vault pause() triggered	v2.2
66604fac...43e9f	Protection triggered (with oracle_hash + policy_hash)	v2.1
12+ confirmed transactions. Dashboard updates in real-time.
Quick Start
bash
# 1. Set environment variables
export GROQ_API_KEY="gsk_..."
export LIQUIDITY_SHIELD_CONTRACT_HASH="hash-3a3692c8c3628c5213603efa44a0d261cb11b17d5aa7e98d29f5f883cf4b6164"
export LIQUIDITY_SHIELD_VAULT_HASH="hash-755d37a7e53f4138146b9650720a6caea8a355722b055c91b85ca29db0f80fa8"

# 2. Run the full demo (simulated crash)
node demo.js --crash

# 3. Verify the deploy independently
node verify.js --tx <hash_from_output>

# 4. View dashboard
python3 -m http.server 8000
# Open http://localhost:8000/dashboard.html
Tech Stack
Table
Layer	Technology
Agent Runtime	Node.js 20
Smart Contract	Rust + WASM (casper-contract 5.1.1 / casper-types 6.1.0)
Blockchain	Casper Network (Testnet)
Price Oracle	CoinGecko API
LLM	Groq API (Llama 3.3 70B)
Cryptography	Node.js crypto (SHA-256)
Dashboard	Vanilla HTML/CSS/JS
Why Casper?
Casper's account-based model and predictable gas costs make it ideal for autonomous agents that must operate reliably without human intervention. The stored contract model with entry points enables stateful, reusable contracts — critical for an audit trail that accumulates over time.
Future Roadmap
[ ] Multi-oracle aggregation (CoinGecko + Binance + Chainlink)
[ ] TEE-based execution environments for hardware attestation
[ ] Governance module for multi-sig critical actions
[ ] Mainnet deployment with production-grade monitoring
Contact
Abuchi Anah — abuchianah3@gmail.com
GitHub: https://github.com/Blahka44/liquidity-shield-casper
DoraHacks: https://dorahacks.io/buidl/46744
