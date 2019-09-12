import {AppWallet} from '@/core/utils/wallet.ts'
import {mapState} from 'vuex'
import {Message, networkTypeList, formData} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {Password, Account} from "nem2-sdk"
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
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
export class WalletImportPrivatekeyTs extends Vue {
    activeAccount: any
    app: any
    account = {}
    form = formData.walletImportPrivateKeyForm
    networkType = networkTypeList
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
        this.showCheckPWDialog = true
    }

    checkEnd(mnemonicObject) {
        if (!mnemonicObject) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return
        }
        // create wallet and put in localstorage/store
        this.importWallet(mnemonicObject.password)
    }


    importWallet(password) {
        const {networkType, privateKey, walletPassword,walletName} = this.form
        const {accountName} = this
        try {
            const wallet = new AppWallet().createFromPrivateKey(
                accountName,
                walletName,
                new Password(walletPassword),
                new Password(password),
                privateKey,
                networkType,
                this.$store
            )
            const walletMapString = AppLock.decryptString(JSON.parse(localRead('accountMap'))[accountName].cipher, password)
            const walletMap = JSON.parse(walletMapString).walletMap
            // refresh walletMap in store
            // this.$store.commit('SET_WALLET_MAP', walletMap)
            // this.$store.commit('SET_CURRENT_ADDRESS', wallet.address)
            // save in localstorage and store
            this.toWalletDetails()
        } catch (error) {
            console.error(error)
            this.$Notice.error({
                title: this.$t(Message.OPERATION_FAILED_ERROR) + ''
            })
        }
    }

    checkImport() {
        const {walletName, privateKey, walletPassword, walletPasswordAgain} = this.form
        if (!walletName || walletName == '') {
            this.showNotice(this.$t(Message.WALLET_NAME_INPUT_ERROR))
            return false
        }

        if (!walletPassword || walletPassword.length < 8 ) {
            this.showNotice(this.$t(Message.PASSWORD_SETTING_INPUT_ERROR))
            return false
        }
        if (walletPassword !== walletPasswordAgain) {
            this.showNotice(this.$t(Message.INCONSISTENT_PASSWORD_ERROR))
            return false
        }
        return true
    }

    checkPrivateKey() {
        const {privateKey, networkType} = this.form

        if (!networkType) {
            this.showNotice(this.$t(Message.PLEASE_SWITCH_NETWORK))
            return false
        }

        if (!privateKey || privateKey === '') {
            this.showNotice(this.$t(Message.PASSWORD_SETTING_INPUT_ERROR))
            return false
        }
        try {
            const account = Account.createFromPrivateKey(privateKey, networkType)
            this.account = account
            return true
        } catch (e) {
            this.showNotice(this.$t(Message.PASSWORD_SETTING_INPUT_ERROR))
            return false
        }
    }

    showNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: text + ''
        })
    }

    // @TODO: VeeValidate
    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Import_private_key_operation') + '',
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    toBack() {
        this.$emit('closeImport')
    }
}
