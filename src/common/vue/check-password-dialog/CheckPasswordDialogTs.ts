import {mapState} from "vuex"
import {Message} from "@/config/index.ts"
import {Account, TransactionType} from "nem2-sdk"
import {decryptKey} from "@/core/utils/wallet.ts"
import {WalletApiRxjs} from "@/core/api/WalletApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {signAndAnnounceBonded, signAndAnnounceNormal} from '@/core/utils/wallet.ts'

@Component({
    computed: {...mapState({activeAccount: 'account'})},
})
export class CheckPasswordDialogTs extends Vue {
    stepIndex = 0
    show = false
    activeAccount: any
    wallet = {
        password: '111111'
    }

    @Prop()
    showCheckPWDialog: boolean

    @Prop({default: ''})
    transactionDetail: any

    @Prop({
        default: () => {
            return []
        }
    })
    transactionList: Array<any>

    @Prop({
        default: () => {
            return {}
        }
    })
    otherDetails

    get node() {
        return this.activeAccount.node
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    checkPasswordDialogCancel() {
        this.$emit('closeCheckPWDialog')
    }

    checkPassword() {
        const DeTxt = decryptKey(this.getWallet, this.wallet.password).trim()
        try {
            new WalletApiRxjs().getWallet(
                this.getWallet.name,
                DeTxt.length === 64 ? DeTxt : '',
                this.getWallet.networkType,
            )
            this.show = false
            this.$emit('checkEnd', Boolean(DeTxt))
            this.switchAnnounceType(DeTxt)
            this.checkPasswordDialogCancel()
        } catch (e) {
            console.log(e)
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.wallet.password = ''
        this.show = this.showCheckPWDialog
    }

    switchAnnounceType(privatekey) {
        const that = this
        const {node, generationHash, transactionList, currentXEM1} = this
        const {networkType} = this.getWallet
        const {lockFee} = this.otherDetails
        const account = Account.createFromPrivateKey(privatekey, networkType)
        if (transactionList[0].type !== TransactionType.AGGREGATE_BONDED) {
            // normal transaction
            signAndAnnounceNormal(account, node, generationHash, transactionList, this.showNotice)
            return
        }
        // bonded transaction
        signAndAnnounceBonded(
            account,
            lockFee,
            node,
            generationHash,
            transactionList,
            currentXEM1,
            networkType
        )
    }

    //
    // signAndAnnounceNormal(privatekey) {
    //     const that = this
    //     const {node, generationHash, transactionList} = this
    //     const {networkType} = this.getWallet
    //     try {
    //         const account = Account.createFromPrivateKey(privatekey, networkType)
    //         const signature = account.sign(transactionList[0], generationHash)
    //         new TransactionApiRxjs().announce(signature, node).subscribe(
    //             () => {
    //                 that.$Notice.success({
    //                     title: this.$t(Message.SUCCESS) + ''
    //                 })
    //             }, (error) => {
    //                 console.log(error)
    //             }
    //         )
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    //
    // signAndAnnounceBonded(privatekey) {
    //     const that = this
    //     const {node, generationHash, transactionList, currentXEM1} = this
    //     const {networkType} = this.getWallet
    //     const {lockFee} = this.otherDetails
    //     const account = Account.createFromPrivateKey(privatekey, networkType)
    //     const aggregateTransaction = transactionList[0]
    //     const listener = new Listener(node.replace('http', 'ws'), WebSocket)
    //     new TransactionApiRxjs().announceBondedWithLock(
    //         aggregateTransaction,
    //         account,
    //         listener,
    //         node,
    //         generationHash,
    //         networkType,
    //         lockFee,
    //         currentXEM1,
    //     )
    // }

    showNotice() {
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }
}
