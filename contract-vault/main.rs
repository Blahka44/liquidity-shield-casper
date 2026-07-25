#![no_std]
#![no_main]

extern crate alloc;
use alloc::string::String;
use alloc::vec::Vec;
use casper_contract::contract_api::{runtime, storage};
use casper_types::{ApiError, Key, URef};

const PAUSED: &str = "paused";

#[no_mangle]
pub extern "C" fn call() {
    let risk_score: u64 = runtime::get_named_arg("risk_score");
    let status: String = runtime::get_named_arg("status");
    let price_change: String = runtime::get_named_arg("price_change");
    let asset: String = runtime::get_named_arg("asset");
    let last_action: String = runtime::get_named_arg("last_action");
    let oracle_hash: String = runtime::get_named_arg("oracle_hash");
    let policy_hash: String = runtime::get_named_arg("policy_hash");
    let agent_version: String = runtime::get_named_arg("agent_version");

    let risk_uref: URef = storage::new_uref(risk_score);
    let status_uref: URef = storage::new_uref(status);
    let change_uref: URef = storage::new_uref(price_change);
    let asset_uref: URef = storage::new_uref(asset);
    let action_uref: URef = storage::new_uref(last_action);
    let oracle_uref: URef = storage::new_uref(oracle_hash);
    let policy_uref: URef = storage::new_uref(policy_hash);
    let version_uref: URef = storage::new_uref(agent_version);

    runtime::put_key("risk_score", Key::URef(risk_uref));
    runtime::put_key("status", Key::URef(status_uref));
    runtime::put_key("price_change", Key::URef(change_uref));
    runtime::put_key("asset", Key::URef(asset_uref));
    runtime::put_key("last_action", Key::URef(action_uref));
    runtime::put_key("oracle_hash", Key::URef(oracle_uref));
    runtime::put_key("policy_hash", Key::URef(policy_uref));
    runtime::put_key("agent_version", Key::URef(version_uref));

    // Initialize paused state
    let paused_uref: URef = storage::new_uref(false);
    runtime::put_key(PAUSED, Key::URef(paused_uref));
}

#[no_mangle]
pub extern "C" fn pause() {
    let paused_uref: URef = runtime::get_key(PAUSED)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::write(paused_uref, true);
}

#[no_mangle]
pub extern "C" fn resume() {
    let paused_uref: URef = runtime::get_key(PAUSED)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::write(paused_uref, false);
}

#[no_mangle]
pub extern "C" fn get_paused() {
    let paused_uref: URef = runtime::get_key(PAUSED)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    let paused: bool = storage::read(paused_uref).unwrap_or_revert().unwrap_or(false);
    runtime::ret(casper_types::CLValue::from_t(paused).unwrap_or_revert());
}
