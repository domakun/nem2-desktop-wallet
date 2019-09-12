import {Message, formData} from "@/config/index.ts"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {AliasActionType, NamespaceId, MosaicId, Password} from "nem2-sdk"
import {AppWallet} from "@/core/utils/wallet.ts"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from "@/core/utils/utils"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class NamespaceMosaicAliasDialogTs extends Vue {
    activeAccount: any
    app: any
    show = false
    isCompleteForm = false
    formItem: any = formData.mosaicAliasForm

    @Prop()
    showMosaicAliasDialog: boolean
    @Prop()
    itemMosaic: any

    get getWallet() {
        return this.activeAccount.wallet
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get node() {
        return this.activeAccount.node
    }

    get namespaceList() {
        return this.activeAccount.namespace
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }
    get mosaics() {
        return this.activeAccount.mosaics
    }
    get unlinkMosaicList() {
        const {mosaics}: any = this
        return Object.values(mosaics)
                .filter(({name})=> name)
                .map((name) => ({label: name, value: name}))
    }

    mosaicAliasDialogCancel() {
        this.initForm()
        this.$emit('closeMosaicAliasDialog')
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.updateMosaic()
    }

    checkInfo() {
        const {formItem} = this

        if (formItem.fee === 0) {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItem.mosaicHex === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }
        if (formItem.password === '') {
            this.$Notice.error({
                title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
            })
            return false
        }

        if (formItem.password.length < 8) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(new Password(formItem.password))

        if (!validPassword) {
            this.$Notice.error({
                title: '' + this.$t('password_error')
            })
            return false
        }
        return true
    }

    async updateMosaic() {
        const {node, generationHash, xemDivisibility} = this
        const {networkType} = this.getWallet
        let {fee, name, mosaicHex} = this.formItem
        fee = getAbsoluteMosaicAmount(fee, xemDivisibility)
        const password = new Password(this.formItem.password)
        let transaction = new NamespaceApiRxjs().mosaicAliasTransaction(
            AliasActionType.Link,
            new NamespaceId(name),
            new MosaicId(mosaicHex),
            networkType,
            fee
        )
        this.initForm()
        new AppWallet(this.getWallet)
            .signAndAnnounceNormal(password, node, generationHash, [transaction], this)
        this.updatedMosaicAlias()
    }

    updatedMosaicAlias() {
        this.show = false
        this.mosaicAliasDialogCancel()
    }

    initForm() {
        this.formItem = {
            mosaicHex: '',
            fee: .5,
            password: ''
        }
    }

    @Watch('showMosaicAliasDialog')
    onShowMosaicAliasDialogChange() {
        this.show = this.showMosaicAliasDialog
        Object.assign(this.formItem, this.itemMosaic)
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {mosaicHex, fee, password} = this.formItem
        // isCompleteForm
        this.isCompleteForm = mosaicHex !== '' && fee > 0 && password !== ''
    }
}
