import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {createMnemonic} from "@/core/utils/hdWallet.ts"
import {networkTypeList} from "@/config/view"
import {NetworkType, Password} from "nem2-sdk"
import CheckPasswordDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {AppAccounts} from '@/core/services/account'
import {mapState} from "vuex"
import {AppWallet} from '@/core/utils/wallet.ts'

@Component({
    components: {
        CheckPasswordDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletCreateTs extends Vue {
    activeAccount: any
    formItem = {
        currentNetType: NetworkType.MIJIN_TEST,
        walletName: 'wallet-create',
        path: `m/44'/43'/1'/0/0`
    }
    networkTypeList = networkTypeList

    showCheckPWDialog = false


    get accountName() {
        return this.activeAccount.accountName
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(password) {
        if (!password) return
        const {accountName} = this
        const {currentNetType, walletName, path} = this.formItem
        const appAccounts = AppAccounts()
        new AppWallet().createFromPath(walletName, new Password(password), path, currentNetType, this.$store)
        this.$router.push('dashBoard')

    }

    submit() {
        if (!this.checkInput()) return
        this.showCheckPWDialog = true
    }

    checkInput() {
        const {currentNetType, walletName, path} = this.formItem
        if (!currentNetType) {
            this.$Notice.error({title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''})
            return false
        }
        if (!walletName || walletName == '') {
            this.$Notice.error({title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''})
            return false
        }
        if (!path) {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''})
            return false
        }
        return true
    }

    toBack() {
        this.$emit('closeCreate')
    }
}
