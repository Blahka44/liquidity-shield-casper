const https = require('https');

const RPC_URL = 'node.testnet.casper.network';
const RPC_PATH = '/rpc';

function rpcCall(method, params) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: params || [],
            id: 1
        });

        const options = {
            hostname: RPC_URL,
            port: 443,
            path: RPC_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log(`\n=== ${method} ===`);
                    console.log(JSON.stringify(parsed, null, 2));
                    resolve(parsed);
                } catch (e) {
                    reject(new Error('Parse error: ' + e.message));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error('Request error: ' + e.message));
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        // Replace with your actual account hash (not public key)
        // Your account hash is different from your public key
        // You can find it on testnet.cspr.live by searching your public key
        const accountHash = 'account-hash-YOUR_ACCOUNT_HASH_HERE';
        
        const result = await rpcCall('state_get_account_info', { 
            public_key: '016c9af86e958e3d67963936e69396ba5db8a355272aa06dd0298afb41ca1d940f' 
        });
        
        console.log('\n=== ACCOUNT INFO ===');
        console.log(JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
