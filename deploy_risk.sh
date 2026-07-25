#!/bin/bash
cd /home/abuchi/hackathon-project/liquidity-shield-contract
casper-client put-deploy \
  --node-address https://node.testnet.casper.network \
  --chain-name casper-test \
  --secret-key ../secret_key.pem \
  --payment-amount 10000000000 \
  --session-hash hash-3a3692c8c3628c5213603efa44a0d261cb11b17d5aa7e98d29f5f883cf4b6164 \
  --session-entry-point "record_risk" \
  --session-arg "risk_score:u64='85'" \
  --session-arg "status:string='CRITICAL'" \
  --session-arg "oracle_hash:string='192717ffb34f98e3794d17c6f8bb624b771bfaac916ab7f6f664ede06c47bd86'" \
  --session-arg "policy_hash:string='31c91883a14c4b91cd26e43fff48781a0ebbd85caee62c4bcb87e70cc44c1fca'" \
  --session-arg "timestamp:u64='1785008725584'"
