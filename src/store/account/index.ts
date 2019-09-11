import {Account} from 'nem2-sdk'
import {nodeConfig} from "@/config/index.ts"

declare interface account {
    node: string,
    currentXem: string,
    currentXEM1: string,
    currentXEM2: string,
    account: Account,
    wallet: any,
    mosaic: any[],
    namespace: any[],
    UnconfirmedTx: any,
    ConfirmedTx: any,
    errorTx: Array<any>,
    mosaicMap: any,
    generationHash: string,
    addresAliasMap: any,
    xemDivisibility: number,
    mnemonic: string,
    walletMap: any

}

export default {
    state: {
        node: nodeConfig.node,
        currentXem: nodeConfig.currentXem,
        currentXEM1: nodeConfig.currentXEM1,
        currentXEM2: nodeConfig.currentXEM2,
        account: {},
        xemDivisibility: 6,
        wallet: {},
        mosaic: [],
        namespace: [],
        UnconfirmedTx: [],
        ConfirmedTx: [],
        errorTx: [],
        mosaicMap: {},
        addresAliasMap: {},
        generationHash: '',
        mnemonic: '',
        walletMap: {}
    },
    getters: {
        Address(state) {
            return state.account.address
        },
        PublicAccount(state) {
            return state.account.publicAccount
        },
        privateKey(state) {
            return state.account.privateKey
        },
        publicKey(state) {
            return state.account.publicKey
        }
    },
    mutations: {
        SET_ACCOUNT(state: account, account: Account): void {
            state.account = account
        },
        SET_WALLET(state: account, wallet: any): void {
            state.wallet = wallet
        },
        SET_MOSAICS(state: account, mosaic: any[]): void {
            state.mosaic = mosaic
        },
        SET_NAMESPACE(state: account, namespace: any[]): void {
            state.namespace = namespace
        },
        SET_NODE(state: account, node: string): void {
            state.node = node
        },
        SET_GENERATION_HASH(state: account, generationHash: string): void {
            state.generationHash = generationHash
        },
        SET_ERROR_TEXT(state: account, errorTx: Array<any>): void {
            state.errorTx = errorTx
        },
        SET_CURRENT_XEM_1(state: account, currentXEM1: string): void {
            state.currentXEM1 = currentXEM1
        },
        SET_MOSAIC_MAP(state: account, mosaicMap: any): void {
            state.mosaicMap = mosaicMap
        },
        SET_ADDRESS_ALIAS_MAP(state: account, addresAliasMap: any): void {
            state.addresAliasMap = addresAliasMap
        },
        SET_UNCONFIRMED_TX(state: account, UnconfirmedTx: any): void {
            state.UnconfirmedTx = UnconfirmedTx
        },
        SET_CONFIRMED_TX(state: account, ConfirmedTx: any): void {
            state.ConfirmedTx = ConfirmedTx
        },
        SET_XEM_DIVISIBILITY(state: account, xemDivisibility: number) {
            state.xemDivisibility = xemDivisibility
        },
        SET_WALLET_BALANCE(state: account, balance: number) {
            state.wallet.balance = balance
        },
        SET_MNEMONIC(state: account, mnemonic: string) {
            state.mnemonic = mnemonic
        },
        SET_WALLET_MAP(state: account, walletMap: any) {
            state.walletMap = walletMap
        },
    }
}
