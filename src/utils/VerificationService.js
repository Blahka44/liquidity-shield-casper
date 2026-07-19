const crypto = require('crypto');

class VerificationService {
    constructor() {
        this.results = [];
    }

    verifyOracleHash(rawJson, claimedHash) {
        try {
            const computedHash = crypto.createHash('sha256').update(rawJson).digest('hex');
            const isValid = computedHash === claimedHash;

            const result = {
                component: 'oracle',
                claimedHash: claimedHash,
                computedHash: computedHash,
                isValid: isValid,
                timestamp: new Date().toISOString(),
                message: isValid 
                    ? '✅ VERIFIED: Oracle response hash matches blockchain record'
                    : '❌ MISMATCH: Oracle response has been tampered with'
            };

            this.results.push(result);
            return result;

        } catch (err) {
            return {
                component: 'oracle',
                isValid: false,
                error: err.message,
                message: '❌ ERROR: Could not verify oracle hash'
            };
        }
    }

    verifyPolicyHash(policy, claimedHash) {
        try {
            const basePolicy = {
                id: policy.id,
                timestamp: policy.timestamp,
                riskScore: policy.riskScore,
                riskLevel: policy.riskLevel,
                state: policy.state,
                action: policy.action,
                reason: policy.reason,
                requiresApproval: policy.requiresApproval,
                oracleHash: policy.oracleHash,
                marketData: policy.marketData,
                executed: policy.executed
            };

            const policyString = JSON.stringify(basePolicy, Object.keys(basePolicy).sort());
            const computedHash = crypto.createHash('sha256').update(policyString).digest('hex');
            const isValid = computedHash === claimedHash;

            const result = {
                component: 'policy',
                claimedHash: claimedHash,
                computedHash: computedHash,
                isValid: isValid,
                timestamp: new Date().toISOString(),
                message: isValid
                    ? '✅ VERIFIED: Policy hash matches blockchain record'
                    : '❌ MISMATCH: Policy has been tampered with'
            };

            this.results.push(result);
            return result;

        } catch (err) {
            return {
                component: 'policy',
                isValid: false,
                error: err.message,
                message: '❌ ERROR: Could not verify policy hash'
            };
        }
    }

    verifyFullChain(marketData, policy) {
        console.log('══════════════════════════════════════════════════');
        console.log('  LIQUIDITY SHIELD — VERIFICATION SERVICE');
        console.log('  Independent Hash Verification');
        console.log('══════════════════════════════════════════════════');
        console.log();

        console.log('Step 1: Verifying Oracle Response...');
        const oracleResult = this.verifyOracleHash(marketData.rawResponse, marketData.oracleHash);
        console.log('  Claimed Hash:  ', oracleResult.claimedHash.substring(0, 32) + '...');
        console.log('  Computed Hash: ', oracleResult.computedHash.substring(0, 32) + '...');
        console.log('  Result:        ', oracleResult.message);
        console.log();

        console.log('Step 2: Verifying Policy Object...');
        const policyResult = this.verifyPolicyHash(policy, policy.policyHash);
        console.log('  Claimed Hash:  ', policyResult.claimedHash.substring(0, 32) + '...');
        console.log('  Computed Hash: ', policyResult.computedHash.substring(0, 32) + '...');
        console.log('  Result:        ', policyResult.message);
        console.log();

        const chainValid = oracleResult.isValid && policyResult.isValid;
        const oracleHashInPolicy = policy.oracleHash === marketData.oracleHash;

        console.log('Step 3: Chain Integrity Check...');
        console.log('  Oracle hash in policy:', oracleHashInPolicy ? '✅ MATCH' : '❌ MISMATCH');
        console.log('  Full chain valid:     ', chainValid && oracleHashInPolicy ? '✅ YES' : '❌ NO');
        console.log();

        const report = {
            timestamp: new Date().toISOString(),
            oracleVerification: oracleResult,
            policyVerification: policyResult,
            chainIntegrity: {
                oracleHashInPolicy: oracleHashInPolicy,
                fullChainValid: chainValid && oracleHashInPolicy
            },
            overallResult: chainValid && oracleHashInPolicy ? 'VERIFIED' : 'FAILED'
        };

        console.log('══════════════════════════════════════════════════');
        console.log('  OVERALL RESULT:', report.overallResult);
        console.log('══════════════════════════════════════════════════');

        return report;
    }

    demonstrateTamperDetection(marketData, policy) {
        console.log();
        console.log('══════════════════════════════════════════════════');
        console.log('  TAMPER DETECTION DEMO');
        console.log('══════════════════════════════════════════════════');
        console.log();

        // Parse the JSON, modify it, re-stringify
        const parsed = JSON.parse(marketData.rawResponse);
        const originalPrice = parsed.market_data.price_change_percentage_24h;
        
        // Tamper with the data
        parsed.market_data.price_change_percentage_24h = -99.99;
        const tamperedJson = JSON.stringify(parsed);
        
        console.log('Simulating data tampering...');
        console.log('Original price change: ' + originalPrice + '%');
        console.log('Tampered price change: -99.99%');
        console.log();

        const tamperResult = this.verifyOracleHash(tamperedJson, marketData.oracleHash);
        console.log('Verification of tampered data:');
        console.log('  ' + tamperResult.message);
        console.log();

        console.log('══════════════════════════════════════════════════');
        console.log('  TAMPER DETECTION: ' + (!tamperResult.isValid ? 'SUCCESS' : 'FAILED'));
        console.log('══════════════════════════════════════════════════');

        return tamperResult;
    }

    getResults() {
        return this.results;
    }
}

module.exports = VerificationService;
