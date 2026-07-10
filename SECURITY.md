# Security Policy

## Known Dependencies

### wee_alloc (Critical - GHSA-rc23-xqgq-x27g)
- **Status:** Dismissed with justification
- **Reason:** Dependency of official Casper contract SDK (casper-contract crate). No patched release exists. The Casper team manages this allocator for WASM targets.
- **Impact:** The agent does not process untrusted user input. The allocator is used only for contract state storage on Casper Testnet.
- **Action:** Monitoring for upstream fix from Casper SDK team.

## Reporting Vulnerabilities

Please report security issues to abuchianah3@gmail.com.
