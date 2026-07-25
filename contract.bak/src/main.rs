#![no_std]
#![no_main]

extern crate alloc;

use alloc::string::String;
use alloc::vec;
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_contract::contract_api::{runtime, storage};
use casper_types::{ApiError, CLValue, Key, URef, EntryPoints, EntryPointAccess, EntryPointType};
use casper_types::contracts::{EntryPoint, Parameter};

const CONTRACT_HASH: &str = "liquidity_shield_hash";
const PACKAGE_HASH: &str = "liquidity_shield_package";

const LATEST_RISK: &str = "latest_risk_score";
const LATEST_STATUS: &str = "latest_status";
const LATEST_ORACLE_HASH: &str = "latest_oracle_hash";
const LATEST_POLICY_HASH: &str = "latest_policy_hash";
const LAST_UPDATED: &str = "last_updated";
const DEPLOY_COUNT: &str = "deploy_count";

#[no_mangle]
pub extern "C" fn record_risk() {
    let risk_score: u64 = runtime::get_named_arg("risk_score");
    let status: String = runtime::get_named_arg("status");
    let oracle_hash: String = runtime::get_named_arg("oracle_hash");
    let policy_hash: String = runtime::get_named_arg("policy_hash");
    let timestamp: u64 = runtime::get_named_arg("timestamp");

    let risk_uref: URef = runtime::get_key(LATEST_RISK)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::write(risk_uref, risk_score);

    let status_uref: URef = runtime::get_key(LATEST_STATUS)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::write(status_uref, status);

    let oracle_uref: URef = runtime::get_key(LATEST_ORACLE_HASH)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::write(oracle_uref, oracle_hash);

    let policy_uref: URef = runtime::get_key(LATEST_POLICY_HASH)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::write(policy_uref, policy_hash);

    let time_uref: URef = runtime::get_key(LAST_UPDATED)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    storage::write(time_uref, timestamp);

    let counter_uref: URef = runtime::get_key(DEPLOY_COUNT)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    let current_count: u64 = storage::read(counter_uref)
        .unwrap_or_revert()
        .unwrap_or_revert();
    storage::write(counter_uref, current_count + 1);
}

#[no_mangle]
pub extern "C" fn get_latest_risk() {
    let risk_uref: URef = runtime::get_key(LATEST_RISK)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    let risk_score: u64 = storage::read(risk_uref)
        .unwrap_or_revert()
        .unwrap_or_revert();
    runtime::ret(CLValue::from_t(risk_score).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn get_state() {
    let status_uref: URef = runtime::get_key(LATEST_STATUS)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    let status: String = storage::read(status_uref)
        .unwrap_or_revert()
        .unwrap_or_revert();
    runtime::ret(CLValue::from_t(status).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn call() {
    let risk_uref: URef = storage::new_uref(0u64);
    runtime::put_key(LATEST_RISK, Key::URef(risk_uref));

    let status_uref: URef = storage::new_uref(String::from("INIT"));
    runtime::put_key(LATEST_STATUS, Key::URef(status_uref));

    let oracle_uref: URef = storage::new_uref(String::from("none"));
    runtime::put_key(LATEST_ORACLE_HASH, Key::URef(oracle_uref));

    let policy_uref: URef = storage::new_uref(String::from("none"));
    runtime::put_key(LATEST_POLICY_HASH, Key::URef(policy_uref));

    let time_uref: URef = storage::new_uref(0u64);
    runtime::put_key(LAST_UPDATED, Key::URef(time_uref));

    let counter_uref: URef = storage::new_uref(0u64);
    runtime::put_key(DEPLOY_COUNT, Key::URef(counter_uref));

    let mut entry_points = EntryPoints::new();
    
    entry_points.add_entry_point(EntryPoint::new(
        String::from("record_risk"),
        vec![
            Parameter::new(String::from("risk_score"), casper_types::CLType::U64),
            Parameter::new(String::from("status"), casper_types::CLType::String),
            Parameter::new(String::from("oracle_hash"), casper_types::CLType::String),
            Parameter::new(String::from("policy_hash"), casper_types::CLType::String),
            Parameter::new(String::from("timestamp"), casper_types::CLType::U64),
        ],
        casper_types::CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Called,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        String::from("get_latest_risk"),
        vec![],
        casper_types::CLType::U64,
        EntryPointAccess::Public,
        EntryPointType::Called,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        String::from("get_state"),
        vec![],
        casper_types::CLType::String,
        EntryPointAccess::Public,
        EntryPointType::Called,
    ));

    let (contract_hash, _version) = storage::new_contract(
        entry_points,
        None,
        Some(String::from(CONTRACT_HASH)),
        Some(String::from(PACKAGE_HASH)),
        None,
    );

    runtime::put_key(CONTRACT_HASH, Key::Hash(contract_hash.value()));
}
