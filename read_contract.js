async function readContract() {
    const RPC_URL = "https://node.testnet.casper.network/rpc";
    const PUBLIC_KEY_HEX = "0176e5977e7bbe51e2df7d39436783ea9be7aca40d0216a604f7975116a726283e";
    const accountHash = "account-hash-76e5977e7bbe51e2df7d39436783ea9be7aca40d0216a604f7975116a726283e";

    const rpcCall = async (method, params) => {
        const response = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 })
        });
        return (await response.json()).result;
    };

    try {
        // 1. Get State Root Hash
        const block = await rpcCall("chain_get_block", []);
        const stateRootHash = block.block.header.state_root_hash;

        // 2. Get Account Info
        const accountInfo = await rpcCall("state_get_account_info", {
            block_identifier: { Hash: stateRootHash },
            account_identifier: { AccountHash: accountHash }
        });

        // 3. Find Key
        const namedKey = accountInfo.account.named_keys.find(k => k.name === "my-key-name");
        
        // 4. Fetch the value
        const item = await rpcCall("state_get_item", {
            state_root_hash: stateRootHash,
            key: namedKey.key
        });

        console.log("Stored value:", item.stored_value.CLValue.data);
    } catch (e) {
        console.error("Query failed:", e);
    }
}

readContract();
