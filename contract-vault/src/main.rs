#![no_std]
#![no_main]

extern crate alloc;
use alloc::string::String;
use casper_contract::contract_api::{runtime, storage};
use casper_types::{ApiError, Key, PublicKey, URef};

const ADMIN: &str = "admin";
const PAUSED: &str = "paused";

#[no_mangle]
pub extern "C" fn init() {
    let admin: PublicKey = runtime::get_named_arg("admin");
    runtime::put_key(ADMIN, Key::from(storage::new_uref(admin)));
    runtime::put_key(PAUSED, Key::from(storage::new_uref(false)));
}

fn get_admin() -> PublicKey {
    let uref: URef = runtime::get_key(ADMIN).unwrap().into_uref().unwrap();
    storage::read::<PublicKey>(uref).unwrap().unwrap()
}

fn set_paused(value: bool) {
    let uref: URef = runtime::get_key(PAUSED).unwrap().into_uref().unwrap();
    storage::write(uref, value);
}

#[no_mangle]
pub extern "C" fn pause() {
    let caller = runtime::get_caller();
    if caller != Key::from(get_admin()) {
        runtime::revert(ApiError::PermissionDenied);
    }
    set_paused(true);
}

#[no_mangle]
pub extern "C" fn resume() {
    let caller = runtime::get_caller();
    if caller != Key::from(get_admin()) {
        runtime::revert(ApiError::PermissionDenied);
    }
    set_paused(false);
}

#[no_mangle]
pub extern "C" fn get_paused() {
    let uref: URef = runtime::get_key(PAUSED).unwrap().into_uref().unwrap();
    let paused: bool = storage::read::<bool>(uref).unwrap().unwrap_or(false);
    runtime::ret(casper_types::CLValue::from_t(paused).unwrap_or_revert());
}
