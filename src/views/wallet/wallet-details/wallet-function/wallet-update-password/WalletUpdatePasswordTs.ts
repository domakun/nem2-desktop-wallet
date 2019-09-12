import {Message} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {Password} from 'nem2-sdk'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

@Component({
    components: {
        CheckPWDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletUpdatePasswordTs extends Vue {
    activeAccount: any
    app: any
    formItem = {
        prePassword: '111111111',
        newPassword: '111111111',
        repeatPassword: '111111111',
    }
    showCheckPWDialog = false
    isCompleteForm = false

    get getWallet() {
        return this.activeAccount.wallet
    }

    get walletList() {
        return this.app.walletList
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    get simpleWallet() {
        return this.activeAccount.wallet.simpleWallet
    }

    checkInfo() {
        // @TODO check password VeeValidate
        const {prePassword, newPassword, repeatPassword} = this.formItem

        if (prePassword == '' || newPassword == '' || repeatPassword == '') {
            this.showNotice('' + this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }

        if (newPassword !== repeatPassword) {
            this.showNotice('' + this.$t(Message.INCONSISTENT_PASSWORD_ERROR))
            return false
        }

        // check if passowrd is right
        const flag = new AppWallet({
            name: this.getWallet.walletName,
            simpleWallet: this.simpleWallet
        }).checkPassword(new Password(prePassword))
        if (!flag) {
            this.showNotice('' + this.$t(Message.WRONG_PASSWORD_ERROR))
            return false
        }
        return true
    }


    showNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: '' + text
        })
    }

    checkEnd(mnemonicObject) {
        if (!mnemonicObject) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return
        }
        this.closeCheckPWDialog()
        this.updatePassword(mnemonicObject.password)
    }

    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.showCheckPWDialog = true
    }

    updatePassword(accountPassword) {
        const {accountName} = this
        const oldPassword = new Password(this.formItem.prePassword)
        const newPassword = new Password(this.formItem.newPassword)
        new AppWallet(this.getWallet).updatePassword(accountName, oldPassword, newPassword, new Password(accountPassword), this.$store)
        this.init()
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    init() {
        this.formItem = {
            prePassword: '111111111',
            newPassword: '111111111',
            repeatPassword: '111111111',

        }
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {prePassword, newPassword, repeatPassword} = this.formItem
        this.isCompleteForm = prePassword !== '' && newPassword !== '' && repeatPassword !== ''
    }

    mounted() {
        this.init()
    }
}
