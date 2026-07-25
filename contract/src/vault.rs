#![no_std]
#![no_main]

extern crate alloc;

use alloc::string::String;
use alloc::vec::Vec;
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_contract::contract_api::{runtime, storage};
use casper_types::{
    api_error::ApiError,
    addressable_entity::{
        EntityEntryPoint as EntryPoint, EntryPointAccess, EntryPointPayment, EntryPointType, EntryPoints,
    },
    CLType, CLValue, Key, NamedKeys, URef,
};

const CONTRACT_PACKAGE_NAME: &str = "liquidity_shield_vault_package";
const CONTRACT_ACCESS_UREF: &str = "liquidity_shield_vault_access_uref";
const CONTRACT_KEY: &str = "liquidity_shield_vault_contract";

const PAUSED: &str = "paused";
const PAUSE_COUNT: &str = "pause_count";

fn get_uref(name: &str) -> URef {
    runtime::get_key(name)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant)
}

#[no_mangle]
pub extern "C" fn pause() {
    let paused_uref: URef = get_uref(PAUSED);
    storage::write(paused_uref, true);

    let counter_uref: URef = get_uref(PAUSE_COUNT);
    let current: u64 = storage::read(counter_uref).unwrap_or_revert().unwrap_or_revert();
    storage::write(counter_uref, current + 1);
}

#[no_mangle]
pub extern "C" fn is_paused() {
    let paused_uref: URef = get_uref(PAUSED);
    let paused: bool = storage::read(paused_uref).unwrap_or_revert().unwrap_or_revert();
    runtime::ret(CLValue::from_t(paused).unwrap_or_revert());
}

#[no_mangle]
pub extern "C" fn call() {
    let paused_uref: URef = storage::new_uref(false);
    let counter_uref: URef = storage::new_uref(0u64);

    let mut named_keys = NamedKeys::new();
    named_keys.insert(PAUSED.to_string(), paused_uref.into());
    named_keys.insert(PAUSE_COUNT.to_string(), counter_uref.into());

    let mut entry_points = EntryPoints::new();

    entry_points.add_entry_point(EntryPoint::new(
        "pause",
        Vec::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        "is_paused",
        Vec::new(),
        CLType::Bool,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    let (contract_hash, _) = storage::new_contract(
        entry_points,
        Some(named_keys),
        Some(CONTRACT_PACKAGE_NAME.to_string()),
        Some(CONTRACT_ACCESS_UREF.to_string()),
        None,
    );

    runtime::put_key(CONTRACT_KEY, contract_hash.into());
}
