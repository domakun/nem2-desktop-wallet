import {Account} from 'nem2-sdk'

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
    generationHash: string
}

export default {
    state: {
        node: 'http://47.107.245.217:3000',
        currentXem: 'nem.xem',
        currentXEM1: '577cba5470751c05',
        currentXEM2: '1B47399ABD2C1E49',
        account: {},
        wallet: {},
        mosaic: [],
        namespace: [],
        UnconfirmedTx: [],
        ConfirmedTx: [],
        errorTx: [],
        generationHash: ''
    },
    getters: {
        Address(state) {
            return state.account.address;
        },
        PublicAccount(state) {
            return state.account.publicAccount;
        },
        privateKey(state) {
            return state.account.privateKey;
        },
        publicKey(state) {
            return state.account.publicKey;
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
        SET_GENERATE_HASH(state: account, generationHash: string): void {
            state.generationHash = generationHash
        },
        SET_ERROR_TEXT(state: account, errorTx: Array<any>): void {
            state.errorTx = errorTx
        },
        SET_CURRENT_XEM_1(state: account, currentXEM1: string): void {
            state.currentXEM1 = currentXEM1
        },

    },
}
