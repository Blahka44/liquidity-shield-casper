#!/bin/bash
cd /home/abuchi/hackathon-project/liquidity-shield-contract
casper-client put-deploy \
  --node-address https://node.testnet.casper.network \
  --chain-name casper-test \
  --secret-key ../secret_key.pem \
  --payment-amount 10000000000 \
  --session-hash hash-755d37a7e53f4138146b9650720a6caea8a355722b055c91b85ca29db0f80fa8 \
  --session-entry-point "pause"