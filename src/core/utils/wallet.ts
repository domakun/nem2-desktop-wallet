import {Message} from "@/config/index.ts"
import {localRead, localAddInMap, localSave, getObjectLength, getTopValueInObject} from "@/core/utils/utils.ts"
import {
    Account,
    Address,
    Crypto,
    NetworkType,
    Transaction,
    SimpleWallet,
    Password,
    WalletAlgorithm,
    Listener, Mosaic, MosaicInfo
} from 'nem2-sdk'
import CryptoJS from 'crypto-js'
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {MultisigApiRxjs} from "@/core/api/MultisigApiRxjs.ts"
import {BlockApiRxjs} from "@/core/api/BlockApiRxjs.ts"
import {formateNemTimestamp} from "@/core/utils/utils.ts"
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import {MosaicApiRxjs} from "@/core/api/MosaicApiRxjs"
import {createAccount, createSubWalletByPath} from "@/core/utils/hdWallet.ts"
import {AppLock} from "@/core/utils/appLock"
import {Store} from 'vuex'

export class AppWallet {
    constructor(wallet?: {
        name?: string,
        simpleWallet?: SimpleWallet
    }) {
        Object.assign(this, wallet)
    }

    walletName: string | undefined
    simpleWallet: SimpleWallet | undefined
    address: string | undefined
    publicKey: string | undefined
    networkType: NetworkType | undefined
    active: boolean | undefined
    style: string | undefined
    balance: number | 0
    isMultisig: boolean | undefined
    encryptedMnemonic: string | undefined
    derivationPath: string
    encryptedPrivateKey: any

    createFromPrivateKey(
        accountName: string,
        walletName: string,
        walletPassword: Password,
        password: Password,
        privateKey: string,
        networkType: NetworkType,
        store: any): AppWallet {
        try {
            this.simpleWallet = SimpleWallet.createFromPrivateKey(walletName, walletPassword, privateKey, networkType)
            this.walletName = walletName
            this.address = this.simpleWallet.address.plain()
            this.publicKey = Account.createFromPrivateKey(privateKey, networkType).publicKey
            this.networkType = networkType
            this.active = true
            this.encryptedPrivateKey = this.simpleWallet.encryptedPrivateKey
            saveWalletInAccount(accountName, this, password)
            this.addNewWalletToList(store, password.value, accountName)
            return this
        } catch (error) {
            throw new Error(error)
        }
    }

    createFromMnemonic(
        accountName: string,
        walletName: string,
        walletPassword: Password,
        password: Password,
        mnemonic: string,
        networkType: NetworkType,
        derivationPath: string,
        store: any
    ): AppWallet {
        try {
            const account = createSubWalletByPath(mnemonic, derivationPath)
            this.simpleWallet = SimpleWallet.createFromPrivateKey(walletName, walletPassword, account.privateKey, networkType)
            this.walletName = walletName
            this.address = this.simpleWallet.address.plain()
            this.publicKey = account.publicKey
            this.networkType = networkType
            this.active = true
            this.derivationPath = derivationPath
            this.encryptedMnemonic = AppLock.encryptString(mnemonic, walletPassword.value)
            saveWalletInAccount(accountName, this, password)
            this.addNewWalletToList(store, password.value, accountName)
            return this
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }


    createFromKeystore(
        accountName: string,
        walletName: string,
        walletPassword: Password,
        password: Password,  // account passoword
        keystoreStr: string,
        keystorePassword: Password,
        networkType: NetworkType,
        store: any
    ): AppWallet {
        try {
            this.walletName = walletName
            this.networkType = networkType
            const words = CryptoJS.enc.Base64.parse(keystoreStr)
            const keystore = words.toString(CryptoJS.enc.Utf8)
            this.simpleWallet = JSON.parse(keystore)
            const {privateKey} = this.getAccount(keystorePassword)
            this.createFromPrivateKey(accountName, walletName, walletPassword, password, privateKey, networkType, store)
            this.addNewWalletToList(store, password.value, accountName)
            return this
        } catch (error) {
            throw new Error(error)
        }
    }

    getAccount(password: Password): Account {
        // @TODO: update after nem2-sdk EncryptedPrivateKey constructor definition is fixed
        // https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/241
        const {encryptedKey, iv} = this.simpleWallet.encryptedPrivateKey

        const common = {password: password.value, privateKey: ''}
        const wallet = {encrypted: encryptedKey, iv}
        Crypto.passwordToPrivateKey(common, wallet, WalletAlgorithm.Pass_bip32)
        const privateKey = common.privateKey
        return Account.createFromPrivateKey(privateKey, this.simpleWallet.network)
    }

    getMnemonic(password: Password): string {
        if (this.encryptedMnemonic === undefined) throw new Error('This wallet has no encrypted mnemonic')
        try {
            return AppLock.decryptString(this.encryptedMnemonic, password.value)
        } catch (error) {
            throw new Error('Could not decrypt the mnemonic')
        }
    }

    getKeystore(): string {
        const parsed = CryptoJS.enc.Utf8.parse(JSON.stringify(this.simpleWallet))
        return CryptoJS.enc.Base64.stringify(parsed)
    }

    checkPassword(password: Password): boolean {
        console.log(this.simpleWallet.encryptedPrivateKey)
        try {
            this.getAccount(password)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    updatePassword(accountName: string, oldPassword: Password, newPassword: Password, accountPassword: Password, store: any): void {
        const account = this.getAccount(oldPassword)
        this.createFromPrivateKey(
            accountName,
            this.walletName,
            newPassword,
            accountPassword,
            account.privateKey,
            this.networkType,
            store)
    }

    addNewWalletToList(store: any, password: string, accountName: string): void {
        const accountMapCipher = localRead('accountMap') === '' ? '' : JSON.parse(localRead('accountMap'))[accountName].cipher
        if (!accountMapCipher) return

        let localWalletMapData: any = JSON.parse(AppLock.decryptString(accountMapCipher, password)).walletMap || {}

        this.style = this.style || `walletItem_bg_${String(getObjectLength(localWalletMapData) % 3)}`
        localWalletMapData[this.address] = this
        if (!getObjectLength(localWalletMapData)) {
            AppWallet.switchWallet(this.address, localWalletMapData, store)
            return
        }
        AppWallet.switchWallet(this.address, localWalletMapData, store)
    }


    deleteWallet(accountName: string, password: Password, store: any, that: any) {
        const walletMap = store.state.account.walletMap
        const {address} = this
        delete walletMap[address]
        store.commit('SET_WALLET_MAP', walletMap)
        // save in localstorage
        // decrypt=>update map=>encrypt=>save
        let accountInfo = JSON.parse(localRead('accountMap'))[accountName]
        let decryptInfo = JSON.parse(AppLock.decryptString(JSON.parse(localRead('accountMap'))[accountName].cipher, password.value))
        const encryptInfo = AppLock.encryptString(JSON.stringify(decryptInfo), password.value)
        decryptInfo.walletMap = walletMap
        accountInfo.cipher = encryptInfo
        localAddInMap('accountMap', accountName, accountInfo)

        if (getObjectLength(walletMap) < 1) {
            store.commit('SET_HAS_WALLET', false)
            store.commit('SET_WALLET', {})
        }

        if (store.state.account.wallet.address === this.address) {
            let topWallet = getTopValueInObject(walletMap)
            topWallet.active = true
            store.commit('SET_CURRENT_ADDRESS', topWallet.address)
        }

        that.$Notice.success({
            title: that['$t']('Delete_wallet_successfully') + '',
        })
        // this.$emit('hasWallet')
    }


    static switchWallet(newActiveWalletAddress: string, walletMap: any, store: any) {
        if (!walletMap[newActiveWalletAddress]) throw new Error('wallet not found when switching')
        for (let key in walletMap) {
            walletMap[key].active = false
        }
        walletMap[newActiveWalletAddress].active = true
        store.commit('SET_WALLET_MAP', walletMap)
        store.commit('SET_CURRENT_ADDRESS', newActiveWalletAddress)
    }

    async getAccountBalance(networkCurrencies: any, node: string): Promise<number> {
        try {
            const accountInfo = await new AccountApiRxjs()
                .getAccountInfo(this.address, node)
                .toPromise()
            if (!accountInfo.mosaics.length) return 0
            const xemIndex = accountInfo.mosaics
                .findIndex(mosaic => networkCurrencies.indexOf(mosaic.id.toHex()) > -1)
            if (xemIndex === -1) return 0
            return accountInfo.mosaics[xemIndex].amount.compact() / 1000000
        } catch (error) {
            return 0
        }
    }

    async updateAccountBalance(balance: number, store: any): Promise<void> {
        try {
            this.balance = balance
            this.updateWalletInStore(store)
            store.commit('SET_BALANCE_LOADING', false)
        } catch (error) {
            store.commit('SET_BALANCE_LOADING', false)
            // do nothing
        }
    }

    updateWalletInStore(store: any) {
        const address = this.address
        const walletMap = store.account.walletMap
        if (getObjectLength(walletMap) < 1) throw new Error('wallet not found when updating')
        walletMap[address] = this
        store.commit('SET_WALLET_MAP', walletMap)
        store.commit('SET_WALLET', this)
    }


    async setMultisigStatus(node: string, store: any): Promise<void> {
        try {
            await new AccountApiRxjs().getMultisigAccountInfo(this.address, node).toPromise()
            this.isMultisig = true
            this.updateWalletInStore(store)
        } catch (error) {
            // Do nothing
        }
    }

    signAndAnnounceNormal(password: Password, node: string, generationHash: string, transactionList: Array<any>, that: any): void {
        try {
            const account = this.getAccount(password)
            const signature = account.sign(transactionList[0], generationHash)
            const message = that.$t(Message.SUCCESS)
            console.log(signature)
            new TransactionApiRxjs().announce(signature, node).subscribe(() => {
                that.$Notice.success({title: message}) // quick fix
            })
        } catch (err) {
            console.error(err)
        }
    }

    signAndAnnounceBonded = (
        password: Password,
        lockFee: number,
        node: string,
        generationHash: string,
        transactionList: Array<any>,
        currentXEM1: string,
        networkType: NetworkType,
    ) => {
        const account = this.getAccount(password)
        const aggregateTransaction = transactionList[0]
        const listener = new Listener(node.replace('http', 'ws'), WebSocket)
        new TransactionApiRxjs().announceBondedWithLock(
            aggregateTransaction,
            account,
            listener,
            node,
            generationHash,
            networkType,
            lockFee,
            currentXEM1,
        )
    }
}

export const getNamespaces = async (address: string, node: string) => {
    let list = []
    let namespace = {}
    await new NamespaceApiRxjs().getNamespacesFromAccount(
        Address.createFromRawAddress(address),
        node
    ).then((namespacesFromAccount) => {
        namespacesFromAccount.result.namespaceList
            .sort((a, b) => {
                return a['namespaceInfo']['depth'] - b['namespaceInfo']['depth']
            }).map((item, index) => {
            if (!item) {
                return
            }
            if (!namespace.hasOwnProperty(item.namespaceInfo.id.toHex())) {
                namespace[item.namespaceInfo.id.toHex()] = item.namespaceName
            } else {
                return
            }
            let namespaceName = ''
            item.namespaceInfo.levels.map((item, index) => {
                namespaceName += namespace[item.id.toHex()] + '.'
            })
            namespaceName = namespaceName.slice(0, namespaceName.length - 1)
            const newObj = {
                value: namespaceName,
                label: namespaceName,
                isActive: item.namespaceInfo.active,
                alias: item.namespaceInfo.alias,
                levels: item.namespaceInfo.levels.length,
                name: namespaceName,
                duration: item.namespaceInfo.endHeight.compact(),
            }
            list.push(newObj)
        })
    })
    return list
}

export const createRootNamespace = (namespaceName, duration, networkType, maxFee) => {
    return new NamespaceApiRxjs().createdRootNamespace(namespaceName, duration, networkType, maxFee)
}

export const createSubNamespace = (rootNamespaceName, subNamespaceName, networkType, maxFee) => {
    return new NamespaceApiRxjs().createdSubNamespace(subNamespaceName, rootNamespaceName, networkType, maxFee)
}
export const multisigAccountInfo = (address, node) => {
    return new MultisigApiRxjs().getMultisigAccountInfo(address, node).subscribe((multisigInfo) => {
        return multisigInfo
    })
}

export const createBondedMultisigTransaction = (transaction: Array<Transaction>, multisigPublickey: string, networkType: NetworkType, fee: number) => {
    return new MultisigApiRxjs().bondedMultisigTransaction(networkType, fee, multisigPublickey, transaction)
}

export const createCompleteMultisigTransaction = (transaction: Array<Transaction>, multisigPublickey: string, networkType: NetworkType, fee: number) => {
    return new MultisigApiRxjs().completeMultisigTransaction(networkType, fee, multisigPublickey, transaction)
}

export const getBlockInfoByTransactionList = (transactionList: Array<any>, node: string, offset: number) => {
    const blockHeightList = transactionList.map((item) => {
        const height = item.transactionInfo.height.compact()
        new BlockApiRxjs().getBlockByHeight(node, height).subscribe((info) => {
            if (info) {
                item.time = formateNemTimestamp(info.timestamp.compact(), offset)
            }
            if (item.dialogDetailMap) {
                item.dialogDetailMap.timestamp = formateNemTimestamp(info.timestamp.compact(), offset)
            }
            return
        })
        return item.transactionInfo.height.compact()
    })
}

export const getMosaicList = async (address: string, node: string) => {
    let mosaicList: Mosaic[] = []
    await new AccountApiRxjs().getAccountInfo(address, node).toPromise().then(accountInfo => {
        mosaicList = accountInfo.mosaics
    }).catch((_) => {
        return
    })
    return mosaicList
}

export const getMosaicInfoList = async (node: string, mosaicList: Mosaic[], currentHeight: any, isShowExpired: boolean = true) => {
    let mosaicInfoList: MosaicInfo[] = []
    let mosaicIds: any = mosaicList.map((item) => {
        return item.id
    })
    await new MosaicApiRxjs().getMosaics(node, mosaicIds).toPromise().then(mosaics => {
        if (!isShowExpired) {
            let s = 0
            mosaics.map((mosaic) => {
                const duration = mosaic['properties'].duration.compact()
                const createHeight = mosaic.height.compact()
                if (duration === 0 || duration + createHeight > Number(currentHeight)) {
                    s++
                    mosaicInfoList.push(mosaic)
                }
            })
            return
        } else {
            mosaicInfoList = mosaics
        }
    }).catch((_) => {
        return
    })
    return mosaicInfoList
}

export const buildMosaicList = (mosaicList: Mosaic[], coin1: string, coin2: string, currentXem: string): any => {
    const mosaicListRst = mosaicList.map((mosaic: any) => {
        mosaic._amount = mosaic.amount.compact()
        mosaic.value = mosaic.id.toHex()
        if (mosaic.value == coin1 || mosaic.value == coin2) {
            mosaic.label = currentXem + ' (' + mosaic._amount + ')'
        } else {
            mosaic.label = mosaic.id.toHex() + ' (' + mosaic._amount + ')'
        }
        return mosaic
    })
    let isCoinExist = mosaicListRst.every((mosaic) => {
        if (mosaic.value == coin1 || mosaic.value == coin2) {
            return false
        }
        return true
    })
    if (isCoinExist) {
        mosaicListRst.unshift({
            value: coin1,
            label: 'nem.xem'
        })
    }
    return mosaicListRst
}

export const saveWalletInAccount = (accountName: string, wallet: any, password: Password) => {
    const cipher = JSON.parse(localRead('accountMap'))[accountName].cipher
    let accountObject: any = JSON.parse(AppLock.decryptString(cipher, password.value))
    accountObject.walletMap[wallet.address] = wallet
    // encrypt
    const cipherObject = {
        hint: accountObject.hint,
        name: accountObject.name,
        password: accountObject.password,
        walletMap: accountObject.walletMap,
        mnemonic: accountObject.mnemonic
    }
    const cipherStr = AppLock.encryptString(JSON.stringify(cipherObject), password.value)
    const accountResult = {
        cipher: cipherStr,
        hint: accountObject.hint,
        name: accountObject.name,
    }
    localAddInMap('accountMap', accountName, accountResult)
}
