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
        // Get latest state root hash
        const status = await rpcCall('info_get_status', []);
        const stateRootHash = status.result.last_added_block_info.state_root_hash;
        console.log('State Root Hash:', stateRootHash);
        
        // Your URef from the account query
        const myUref = "uref-86233e9df5bb2ba4eaa72acb4c03c0cae64566a30e16b7b84c0191e1861ac550-007";
        
        console.log("\n=== READING CONTRACT VALUE ===");
        const result = await rpcCall('state_get_item', {
            state_root_hash: stateRootHash,
            key: myUref,
            path: []
        });
        
        console.log(JSON.stringify(result, null, 2));
        
        // Try to decode if it's a CLValue
        if (result.result && result.result.stored_value && result.result.stored_value.CLValue) {
            const clValue = result.result.stored_value.CLValue;
            console.log('\n=== DECODED VALUE ===');
            console.log('Type:', clValue.cl_type);
            console.log('Bytes:', clValue.bytes);
            
            // If it's a string, decode from hex
            if (clValue.cl_type === 'String' && clValue.bytes) {
                const hexString = clValue.bytes;
                let decoded = '';
                for (let i = 0; i < hexString.length; i += 2) {
                    decoded += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
                }
                console.log('Decoded String:', decoded);
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
