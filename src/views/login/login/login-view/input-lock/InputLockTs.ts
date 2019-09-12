import {Component, Vue, Watch} from 'vue-property-decorator'
import {AppLock, StoredCipher} from '@/core/utils/appLock'
import {standardFields} from '@/core/validation'
import {mapState} from "vuex"
import {localRead, getObjectLength, getTopValueInObject} from "@/core/utils/utils"
import {Message} from "@/config"

@Component({
    computed: {
        ...mapState({
            app: 'app',
        })
    }
})
export class InputLockTs extends Vue {
    app: any
    passwordFieldValidation = standardFields.previousPassword.validation
    cipher: string = ''
    cipherHint: string = ''
    errors: any
    activeError: string = ''
    isShowPrompt: boolean = false
    currentText: string = ''
    isShowClearCache: boolean = false
    walletMap: any = {}
    formItem = {
        currentAccountName: '',
        password: ''
    }

    showPrompt() {
        this.isShowPrompt = true
    }

    showIndexView() {
        this.$emit('showIndexView', 1)
    }

    get accountMap() {
        return localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
    }

    get accountList() {
        const walletMap = this.accountMap
        let walletList = []
        for (let key in walletMap) {
            walletList.push({
                value: key,
                label: key
            })
        }
        return walletList
    }


    jumpToDashBoard() {
        const {walletMap} = this
        if (getObjectLength(walletMap) == 0) {
            this.$router.push({
                name: 'walletCreate',
                params: {name: 'walletCreate'}
            })
            return
        }
        this.$store.commit('SET_CURRENT_ADDRESS', getTopValueInObject(walletMap).address)
        this.$router.push({name: 'monitorPanel'})
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({title: this.$t(text) + ''})
    }

    submit() {
        const {currentAccountName, password} = this.formItem
        const {cipher} = this
        const that = this
        if (this.errors.items.length > 0) {
            this.showErrorNotice(this.errors.items[0].msg)
            return
        }
        if (!currentAccountName) {
            this.showErrorNotice(Message.ACCOUNT_NAME_INPUT_ERROR)
            return
        }

        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                // return accountMap
                const accountMap = JSON.parse(AppLock.decryptString(cipher, password))
                // save mnemonic and password in store
                that.walletMap = accountMap.walletMap
                const nemonicCipher = JSON.stringify({
                    mnemonic: accountMap.mnemonic,
                    password: accountMap.password
                })
                that.$store.commit('SET_MNEMONIC', AppLock.encryptString(nemonicCipher, accountMap.password))
                that.$store.commit('SET_WALLET_MAP', accountMap.walletMap)
                that.$store.commit('SET_ACCOUNT_NAME', accountMap.name)
                that.jumpToDashBoard()
            })
    }


    @Watch('formItem.currentAccountName')
    onWalletChange() {
        const {accountMap} = this
        this.cipher = accountMap[this.formItem.currentAccountName].cipher
        this.cipherHint = accountMap[this.formItem.currentAccountName].hint
    }


    clearCache() {
        // localRead remove
        // localRemove('lock')
        // localRemove('wallets')
        // localRemove('loglevel:webpack-dev-server')
    }
}
