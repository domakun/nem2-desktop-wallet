import {Message, networkTypeList, formData} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet.ts'
import {mapState} from 'vuex'
import {Password} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {
    ALLOWED_SPECIAL_CHAR,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
    passwordValidator
} from "@/core/validation"
import {AppLock} from "@/core/utils/appLock"
import {localRead} from "@/core/utils/utils"

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

// TODO GENERATE MNENONIC WALLET
export class WalletImportMnemonicTs extends Vue {
    activeAccount: any
    app: any
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    form = formData.walletImportMnemonicForm
    NetworkTypeList = networkTypeList
    account = {}
    showCheckPWDialog = false

    get getNode() {
        return this.activeAccount.node
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get currentXEM2() {
        return this.activeAccount.currentXEM2
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

    submit() {
        if (!this.checkImport()) return
        this.showCheckPWDialog = true
    }

    checkEnd(mnemonicObject) {
        if (!mnemonicObject) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
        // create wallet and put in localstorage/store
        this.importWallet(mnemonicObject.password)
    }


    checkImport() {
        if (this.form.networkType == 0) {
            this.$Notice.error({
                title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''
            })
            return false
        }
        if (!this.form.walletName || this.form.walletName == '') {
            this.$Notice.error({
                title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''
            })
            return false
        }
        if (!this.form.mnemonic || this.form.mnemonic === '' || this.form.mnemonic.split(' ').length != 12) {
            this.$Notice.error({
                title: this.$t(Message.MNENOMIC_INPUT_ERROR) + ''
            })
            return false
        }
        return true
    }

    importWallet(password) {
        const {accountName} = this
        const {derivePath, mnemonic, networkType, walletName} = this.form
        try {
            new AppWallet().createFromMnemonic(
                accountName,
                walletName,
                password,
                mnemonic,
                networkType,
                derivePath
            )
            this.toWalletDetails()
        } catch (error) {
            console.error(error)
            this.$Notice.error({
                title: this.$t(Message.OPERATION_FAILED_ERROR) + ''
            })
        }
    }

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    toBack() {
        this.$emit('closeImport')
    }
}
