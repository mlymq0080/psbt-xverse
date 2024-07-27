import axios from "axios";

export function get_runes_information_by_runes_name(runes_name) {
    return axios.get("https://api-3.xverse.app/v1/runes/" + runes_name)
}


export function get_recommended() {
    return axios.get("https://mempool.space/api/v1/fees/recommended")
}
