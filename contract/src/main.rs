#![no_std]
#![no_main]

extern crate alloc;
use alloc::string::String;
use casper_contract::contract_api::{runtime, storage};
use casper_types::{Key, U512};

#[no_mangle]
pub extern "C" fn call() {
    let risk_score: u64 = runtime::get_named_arg("risk_score");
    let status: String = runtime::get_named_arg("status");
    let price_change: String = runtime::get_named_arg("price_change");
    let asset: String = runtime::get_named_arg("asset");
    let last_action: String = runtime::get_named_arg("last_action");
    
    // v2.1: Cryptographic verification fields
    let oracle_hash: String = runtime::get_named_arg("oracle_hash");
    let policy_hash: String = runtime::get_named_arg("policy_hash");
    let agent_version: String = runtime::get_named_arg("agent_version");

    runtime::put_key("risk_score", Key::from(storage::new_uref(U512::from(risk_score))));
    runtime::put_key("status", Key::from(storage::new_uref(status)));
    runtime::put_key("price_change", Key::from(storage::new_uref(price_change)));
    runtime::put_key("asset", Key::from(storage::new_uref(asset)));
    runtime::put_key("last_action", Key::from(storage::new_uref(last_action)));
    
    // v2.1: Store verification hashes
    runtime::put_key("oracle_hash", Key::from(storage::new_uref(oracle_hash)));
    runtime::put_key("policy_hash", Key::from(storage::new_uref(policy_hash)));
    runtime::put_key("agent_version", Key::from(storage::new_uref(agent_version)));
}
