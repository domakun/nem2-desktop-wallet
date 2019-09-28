import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from "vuex"
import {Password, NetworkType} from 'nem2-sdk'
import {Message, networkConfig, DEFAULT_FEES, FEE_GROUPS, defaultNetworkConfig, formDataConfig} from "@/config/index.ts"
import {MosaicApiRxjs} from "@/core/api/MosaicApiRxjs.ts"
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {AppWallet, AppMosaic, DefaultFee, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    }
})
export class MosaicEditDialogTs extends Vue {
    activeAccount: StoreAccount
    isCompleteForm = false
    changedSupply = 0
    totalSupply = networkConfig.maxMosaicAtomicUnits
    formItems = formDataConfig.mosaicEditForm
    XEM = defaultNetworkConfig.XEM

    @Prop()
    showMosaicEditDialog: boolean

    @Prop()
    itemMosaic: AppMosaic
  
    get show() {
        return this.showMosaicEditDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }
    get defaultFees(): DefaultFee[] {
        return DEFAULT_FEES[FEE_GROUPS.SINGLE]
    }

    get feeAmount() {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.xemDivisibility)
    }

    get supply() {
        return this.itemMosaic.mosaicInfo.supply.compact()
    }

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get mosaicId(): string {
      return this.itemMosaic.hex
    }
    
    get networkType(): NetworkType {
        return this.wallet.networkType
    }

    mosaicEditDialogCancel() {
        this.initForm()
        this.$emit('closeMosaicEditDialog')
    }

    // @TODO: make get newSupply() instead
    changeSupply() {
        this.formItems.delta = Math.abs(this.formItems.delta)
        let supply = 0
        if (this.formItems.supplyType === 1) {
            supply = Number(this.formItems.delta) + Number(this.supply)
            if (supply > this.totalSupply * Math.pow(10, this.formItems['_divisibility'])) {
                supply = this.totalSupply * Math.pow(10, this.formItems['_divisibility'])
                this.formItems.delta = supply - this.supply
            }
        } else {
            supply = this.supply - this.formItems.delta
            if (supply <= 0) {
                supply = 0
                this.formItems.delta = this.supply
            }
        }

        this.changedSupply = supply
    }

    checkInfo() {
        const {formItems} = this

        if (formItems.delta === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItems.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        if (formItems.password.length < 8) {
            this.$Notice.error({
                title: '' + Message.WRONG_PASSWORD_ERROR
            })
            return false
        }

        const validPassword = new AppWallet(this.wallet).checkPassword(new Password(formItems.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + Message.WRONG_PASSWORD_ERROR
            })
            return false
        }
        return true
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    updateMosaic() {
        const {node, generationHash, feeAmount, mosaicId, networkType} = this
        const password = new Password(this.formItems.password)
        const {delta, supplyType} = this.formItems
        const transaction = new MosaicApiRxjs().mosaicSupplyChange(
            mosaicId,
            delta,
            supplyType,
            networkType,
            feeAmount
        )
        this.show = false
        new AppWallet(this.wallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
    }

    updatedMosaic() {
        this.show = false
        this.mosaicEditDialogCancel()
        this.$Notice.success({
            title: this.$t('mosaic_operation') + '',
            desc: this.$t('update_completed') + ''
        })
    }

    initForm() {
        this.formItems = formDataConfig.mosaicEditForm
    }

    @Watch('formItems', {immediate: true, deep: true})
    onFormItemChange() {
        const {delta, password} = this.formItems
        this.isCompleteForm = parseInt(delta.toString()) >= 0 && password !== ''
    }
}
