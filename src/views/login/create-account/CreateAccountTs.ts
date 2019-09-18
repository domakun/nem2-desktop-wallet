import {Component, Vue} from 'vue-property-decorator'
import {Message} from "@/config"
import {AppLock, createMnemonic, localRead} from "@/core/utils"
import {AppAccounts, AppAccount} from '@/core/services/account'

@Component
export class CreateAccountTs extends Vue {
    formItem = {
        accountName: 'account-1',
        password: '123123123',
        passwordAgain: '123123123',
        hint: '123123123'
    }

    checkInput() {
        const {accountName, password, passwordAgain} = this.formItem
        const appAccounts = AppAccounts()
        if (appAccounts.getAccountFromLocalStorage(accountName)) {
            this.$Notice.error({title: this.$t(Message.ACCOUNT_NAME_EXISTS_ERROR) + ''})
            return false
        }
        if (!accountName || accountName == '') {
            this.$Notice.error({title: this.$t(Message.ACCOUNT_NAME_INPUT_ERROR) + ''})
            return false
        }
        if (!password || password.length < 8) {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''})
            return false
        }
        if (passwordAgain !== password) {
            this.$Notice.error({title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''})
            return false
        }
        return true
    }

    createAccount() {
        const appAccounts = AppAccounts()
        let {accountName, password, hint} = this.formItem

        if (!this.checkInput()) return
        password = AppLock.encryptString(password, password)
        let accountMap = localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
        const appAccount = new AppAccount(accountName, [], password, hint)
        appAccounts.saveAccountInLocalStorage(appAccount)
        this.$Notice.success({title: this.$t(Message.OPERATION_SUCCESS) + ''})
        this.$router.push('initAccount')
    }

    toBack() {
        this.$router.push('login')
    }
}
