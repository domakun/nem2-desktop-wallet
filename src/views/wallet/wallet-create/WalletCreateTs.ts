import {Message, networkTypeList,defaultDerivePath} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {AppWallet, saveWalletInAccount} from '@/core/utils/wallet.ts'
import {Password} from 'nem2-sdk'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {
    passwordValidator,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    ALLOWED_SPECIAL_CHAR,
} from '@/core/validation'
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
        derivationPath: defaultDerivePath,
    }
    activeAccount: any
    showCheckPWDialog = false
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
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
        }
        this.createWalletByMnemonicSeed(mnemonicObject)
    }

    createWalletByMnemonicSeed(mnemonicObject: any) {
        const {accountName} = this
        const {mnemonic, password} = mnemonicObject
        const {currentNetType, walletName, derivationPath} = this.formItem
        const wallet = new AppWallet().createFromMnemonic(
            accountName,
            walletName,
            password,
            mnemonic,
            currentNetType,
            derivationPath
        )
        // save in localstorage
        // saveWalletInAccount(accountName, wallet, password)
        const walletMapString = AppLock.decryptString(JSON.parse(localRead('accountMap'))[accountName].cipher, password)
        const walletMap = JSON.parse(walletMapString).walletMap
        // refresh walletMap in store
        this.$store.commit('SET_WALLET_MAP', walletMap)
        // set current wallet , by set address,get current wallet by walletMap[address]
        this.$store.commit('SET_CURRENT_ADDRESS', wallet.address)
        // set left navigator click allowed
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
        // jump to dashborad
        this.$router.push({name: 'monitorPanel'})

    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({title: text + ''})
    }

    checkInput() {
        const {currentNetType, walletName, derivationPath} = this.formItem
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

        return true
    }

    createWallet() {
        if (!this.checkInput()) return
        this.showCheckPWDialog = true
        // input account password to get account menmonic
        //createWallet and save wallet in accountMap
        // this.$store.commit('SET_MNEMONIC', createMnemonic())
        // this.$emit('isCreated', this.formItem)
    }

}
