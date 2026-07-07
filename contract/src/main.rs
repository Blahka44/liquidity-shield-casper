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
    
    runtime::put_key("risk_score", Key::from(storage::new_uref(U512::from(risk_score))));
    runtime::put_key("status", Key::from(storage::new_uref(status)));
    runtime::put_key("price_change", Key::from(storage::new_uref(price_change)));
    runtime::put_key("asset", Key::from(storage::new_uref(asset)));
    runtime::put_key("last_action", Key::from(storage::new_uref(last_action)));
}
