import {Message} from "@/config/index.ts"
import {Mosaic, MosaicId, UInt64} from 'nem2-sdk'
import {Component, Vue, Watch, Provide} from 'vue-property-decorator'
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {clone} from '@/core/utils/utils'
import ErrorTooltip from '@/views/other/forms/errorTooltip/ErrorTooltip.vue'
import {standardFields} from '@/core/validation'
import {mapState} from 'vuex';
import { getMosaicList, buildMosaicList } from '@/core/utils/wallet';

@Component({
    components: {CheckPWDialog, ErrorTooltip},
    computed: {...mapState({activeAccount: 'account'})},
})
export default class TransferTransactionTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: any
    standardFields: object = standardFields
    errors: any
    submitDisabled: boolean = false
    mosaicList = []
    transactionList = []
    transactionDetail = {}
    showCheckPWDialog = false
    isCompleteForm = false

    formFields = {
        fee: 50000,
        remark: '',
        address: '',
        mosaic: '',
        amount: 0,
    }

    formModel = clone(this.formFields)

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    resetFields() {
        this.formModel = clone(this.formFields)
        this.$nextTick(() => this.$validator.reset())
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.showDialog()
            });
    }

    showDialog() {
        const {address, mosaic, amount, remark, fee} = this.formModel
        this.transactionDetail = {
            "transaction_type": 'ordinary_transfer',
            "transfer_target": address,
            "asset_type": mosaic,
            "quantity": amount,
            "fee": fee + 'gas',
            "remarks": remark
        }
        this.showCheckPWDialog = true
        this.generateTransaction()
    }

    generateTransaction() {
        const that = this
        let {node, generationHash} = this
        let {address, mosaic, amount, remark, fee} = this.formModel
        const {networkType} = this.wallet
        // const account = Account.createFromPrivateKey(key, networkType)
        const transaction = new TransactionApiRxjs().transferTransaction(
            networkType,
            fee,
            address,
            [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
            0,
            remark
        )
        this.transactionList = [transaction]
        // const signature = account.sign(transaction, generationHash)
        // new TransactionApiRxjs().announce(signature, node).subscribe(
        //     () => {
        //         that.$Notice.success({
        //             title: this.$t(Message.SUCCESS) + ''
        //         })
        //         that.resetFields()
        //     }, (error) => {
        //         console.log(error)
        //     }
        // )
    }

    async initMosaic(){
        this.mosaicList = []
        const that = this
        let {accountAddress, node} = this
        const {currentXEM1, currentXEM2} = this.activeAccount
        const mosaicList:Mosaic[] = await getMosaicList(accountAddress,node)
        that.mosaicList  = await buildMosaicList(mosaicList,currentXEM1,currentXEM2)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    @Watch('accountAddress')
    onAcountAddressChange() {
        this.resetFields()
        this.initMosaic()
    }

    @Watch('errors.items')
    onErrorsChanged() {
        this.submitDisabled = this.errors.items.length > 0
    }

    created() {
        this.initMosaic()
    }

    mounted() {
        this.resetFields()
    }
}
