import {Message, networkTypeList} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {createMnemonic} from "@/core/utils/hdWallet.ts"
import {
    passwordValidator,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    ALLOWED_SPECIAL_CHAR,
} from '@/core/validation'

@Component
export class WalletCreateTs extends Vue {
    formItem = {
        currentNetType: '',
        walletName: '',
        hdPath: `m/44'/43'/1'/0/0`,
    }
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    networkTypeList = networkTypeList


    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({title: text + ''})
    }

    checkInput() {
        const {currentNetType, walletName, hdPath} = this.formItem
        if (!currentNetType) {
            this.showErrorNotice(this.$t(Message.PLEASE_SWITCH_NETWORK))
            return false
        }
        if (!walletName || walletName.trim() == '') {
            this.showErrorNotice(this.$t(Message.WALLET_NAME_INPUT_ERROR))
            return false
        }
        if (!hdPath || hdPath.trim() == '') {
            this.showErrorNotice(this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }

        return true
    }

    createWallet() {
        if (!this.checkInput()) return
        // input account password to get account menmonic
        // createFromMnemonic(,hdPath)
        //createWallet and save wallet in accountMap
        // this.$store.commit('SET_MNEMONIC', createMnemonic())
        // this.$emit('isCreated', this.formItem)
    }

}
