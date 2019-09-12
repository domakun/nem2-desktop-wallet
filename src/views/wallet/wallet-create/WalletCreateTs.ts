import {Message, networkTypeList, defaultDerivePath} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {AppWallet, saveWalletInAccount} from '@/core/utils/wallet.ts'
import {Password} from 'nem2-sdk'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {mapState} from "vuex"
import {localRead} from "@/core/utils/utils"
import {AppLock} from "@/core/utils/appLock"

@Component({
    components: {
        CheckPWDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class WalletCreateTs extends Vue {
    formItem: any = {
        currentNetType: 144,
        walletName: 'wallet',
        walletPassword: '',
        walletPasswordAgain: '',
        derivationPath: defaultDerivePath,
    }
    activeAccount: any
    showCheckPWDialog = false
    networkTypeList = networkTypeList


    get accountName() {
        return this.activeAccount.accountName
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(mnemonicObject) {
        if (!mnemonicObject) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return
        }
        this.createWalletByMnemonicSeed(mnemonicObject)

    }

    createWalletByMnemonicSeed(mnemonicObject: any) {
        const {accountName} = this
        const {mnemonic, password} = mnemonicObject
        const {currentNetType, walletPassword, walletName, derivationPath} = this.formItem
        const wallet = new AppWallet().createFromMnemonic(
            accountName,
            walletName,
            new Password(walletPassword),
            new Password(password),
            mnemonic,
            currentNetType,
            derivationPath,
            this.$store
        )
        // save in localstorage
        // saveWalletInAccount(accountName, wallet, password)
        const walletMapString = AppLock.decryptString(JSON.parse(localRead('accountMap'))[accountName].cipher, password)
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
        // jump to dashborad
        this.$router.push({name: 'monitorPanel'})

    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({title: text + ''})
    }

    checkInput() {
        const {currentNetType, walletName, walletPassword, walletPasswordAgain, derivationPath} = this.formItem
        if (!currentNetType) {
            this.showErrorNotice(this.$t(Message.PLEASE_SWITCH_NETWORK))
            return false
        }
        if (!walletName || walletName.trim() == '') {
            this.showErrorNotice(this.$t(Message.WALLET_NAME_INPUT_ERROR))
            return false
        }
        if (!derivationPath || derivationPath.trim() == '') {
            this.showErrorNotice(this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }
        if (walletPassword.length < 8) {
            this.showErrorNotice(this.$t(Message.PASSWORD_SETTING_INPUT_ERROR))
            return false
        }
        if (walletPassword !== walletPasswordAgain) {
            this.showErrorNotice(this.$t(Message.INCONSISTENT_PASSWORD_ERROR))
            return false
        }

        return true
    }

    createWallet() {
        if (!this.checkInput()) return
        this.showCheckPWDialog = true
    }

}
