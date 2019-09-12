import {Message, networkTypeList, importKeystoreDefault} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet.ts'
import {Password} from "nem2-sdk"
import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {AppLock} from "@/core/utils/appLock"
import {localRead} from "@/core/utils/utils"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
    components: {
        CheckPWDialog
    }
})
export class WalletImportKeystoreTs extends Vue {
    activeAccount: any
    app: any
    file = ''
    fileList = []
    NetworkTypeList = networkTypeList
    formItem = importKeystoreDefault
    showCheckPWDialog = false

    get getNode() {
        return this.activeAccount.node
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get walletList() {
        return this.app.walletList
    }

    get currentXEM2() {
        return this.activeAccount.currentXEM2
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    submit() {
        if (!this.checkForm()) return
        this.showCheckPWDialog = true
    }

    checkEnd(mnemonicObject) {
        if (!mnemonicObject) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return
        }
        console.log(mnemonicObject)
        this.importWallet(mnemonicObject.password)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    importWallet(password) {
        const {accountName} = this
        const {walletName, keystoreStr, networkType,walletPassword, keystorePassword} = this.formItem
        try {
            const wallet = new AppWallet().createFromKeystore(
                accountName,
                walletName,
                new Password(walletPassword),
                new Password(password),
                keystoreStr,
                new Password(keystorePassword),
                networkType,
                this.$store
            )

            // save in localstorage
            // saveWalletInAccount(accountName, wallet, password)
            const walletMapString = AppLock.decryptString(JSON.parse(localRead('accountMap'))[accountName].cipher, password)
            const walletMap = JSON.parse(walletMapString).walletMap
            // refresh walletMap in store
            // this.$store.commit('SET_WALLET_MAP', walletMap)
            // this.$store.commit('SET_CURRENT_ADDRESS', wallet.address)
            this.toWalletDetails()
        } catch (error) {
            console.error(error)
            this.showErrorNotice(Message.OPERATION_FAILED_ERROR)
        }
    }

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    async checkForm() {
        const {keystoreStr, networkType, walletName, walletPassword, walletPasswordAgain} = this.formItem
        if (networkType == 0) {
            this.showErrorNotice(Message.PLEASE_SWITCH_NETWORK)
            return false
        }
        if (!walletName || walletName == '') {
            this.showErrorNotice(Message.WALLET_NAME_INPUT_ERROR)
            return false
        }
        if (!walletPassword || walletPassword.length < 8) {
            this.showErrorNotice(Message.PASSWORD_SETTING_INPUT_ERROR)
            return false
        }

        if (walletPassword != walletPasswordAgain) {
            this.$Notice.error({
                title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''
            })
            return false
        }
        return true
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: this.$t(text) + ''
        })
    }

    toBack() {
        this.$emit('closeImport')
    }
}
