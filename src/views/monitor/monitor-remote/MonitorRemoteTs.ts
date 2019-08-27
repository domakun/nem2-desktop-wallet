import {Message} from "@/config/index.ts"
import {walletApi} from "@/core/api/walletApi.ts"
import {Component, Vue} from 'vue-property-decorator'
import {transactionApi} from '@/core/api/transactionApi.ts'
import {AccountLinkTransaction, UInt64, LinkAction, NetworkType, Deadline, Account} from "nem2-sdk"
import {decryptKey} from "@/core/utils/wallet.ts"
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs.ts"


@Component
export class MonitorRemoteTs extends Vue {
    isLinked = false
    harvestBlockList = []
    isLinkToRemote = false
    isShowDialog = false
    remotePublickey = ''
    formItem = {
        remotePublickey: '',
        fee: 0,
        password: ''
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }


    initForm() {
        this.formItem = {
            remotePublickey: '',
            fee: 0,
            password: ''
        }
    }

    changePage() {

    }

    modalCancel() {
        this.isShowDialog = false
    }

    switchChan() {
        if (this.isLinked == false) {
            this.isShowDialog = true
        }
    }

    showErrorMessage(message: string) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    checkForm(): boolean {
        const {remotePublickey, fee, password} = this.formItem
        if (remotePublickey.length !== 64) {
            this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + '')
            return false
        }
        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
            return false
        }
        if (password == '' || password.trim() == '') {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
            return false
        }
        return true
    }

    confirmInput() {
        if (!this.checkForm()) return
        this.decryptKey()
    }

    decryptKey() {
        this.checkPrivateKey(decryptKey(this.getWallet, this.formItem.password))
    }

    checkPrivateKey(DeTxt) {
        const that = this
        walletApi.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.sendTransaction(DeTxt)
        }).catch(() => {
            that.$Notice.error({
                title: this.$t('password_error') + ''
            })
        })
    }

    sendTransaction(privatekey) {
        const {isLinked} = this
        const {remotePublickey, fee, password} = this.formItem
        const {networkType} = this.getWallet
        const {generationHash, node} = this.$store.state.account
        const account = Account.createFromPrivateKey(privatekey, networkType)
        const accountLinkTransaction = AccountLinkTransaction.create(Deadline.create(), remotePublickey, isLinked ? LinkAction.Link : LinkAction.Unlink, NetworkType.MIJIN_TEST, UInt64.fromUint(fee)
        )
        transactionApi._announce({
            transaction: accountLinkTransaction,
            node,
            account,
            generationHash
        })
        this.modalCancel()
    }

    toggleSwitch(status) {
        this.isShowDialog = true
    }

    getLinkPublicKey() {
        if (!this.$store.state.account.wallet) {
            return
        }
        const that = this
        const {address} = this.$store.state.account.wallet
        const {node} = this.$store.state.account
        new AccountApiRxjs().getLinkedPublickey(node, address).subscribe((resStr: string) => {
                that.remotePublickey = ''
                if (JSON.parse(resStr) && JSON.parse(resStr).account && JSON.parse(resStr).account.linkedAccountKey) {
                    let linkedPublicKey = JSON.parse(resStr).account.linkedAccountKey
                    that.remotePublickey = Buffer.from(linkedPublicKey, 'base64').toString('hex').toUpperCase()
                }
                that.remotePublickey = ''
                if (Number(that.remotePublickey) != 0) {
                    // switch on
                    that.formItem.remotePublickey = that.remotePublickey
                    that.isLinked = true
                    return
                }

            }
        )
    }

    created() {
        this.getLinkPublicKey()
    }
}
