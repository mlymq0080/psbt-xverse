import Cookies from 'js-cookie'

const Payment = 'runes-payment-address'
const Ordinals = 'runes-ordinals-address'

export function SetAddresses(addresses) {
   Cookies.set(Payment, JSON.stringify(addresses[0]))
   Cookies.set(Ordinals, JSON.stringify(addresses[1]))
}

export function SetAddressesIn(PaymentAddress,OrdinalsOrdinals) {
    Cookies.set(Payment, JSON.stringify(PaymentAddress))
    Cookies.set(Ordinals, JSON.stringify(OrdinalsOrdinals))
}

export function GetPaymentAddress() {
    return Cookies.get(Payment)
}

export function GetOrdinalsAddress() {
    return Cookies.get(Ordinals)
}

export function DelAddress() {
    Cookies.remove(Payment)
    Cookies.remove(Ordinals)
}