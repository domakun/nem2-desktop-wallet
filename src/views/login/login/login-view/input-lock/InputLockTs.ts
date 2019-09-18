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
            activeAccount: 'account'
        })
    }
})
export class InputLockTs extends Vue {
    app: any
    passwordFieldValidation = standardFields.previousPassword.validation
    cipher: string = ''
    activeAccount: any
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

    get accountName() {
        return this.activeAccount.accountName
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
                name: 'dashBoard',
                params: {name: 'dashBoard'}
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
        const {accountMap, accountName} = this
        const that = this
        if (this.errors.items.length > 0) {
            this.showErrorNotice(this.errors.items[0].msg)
            return
        }
        if (!currentAccountName) {
            this.showErrorNotice(Message.ACCOUNT_NAME_INPUT_ERROR)
            return
        }


        if (!accountMap[accountName].seed) {
            this.$router.push('initAccount')
        }

        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                // save mnemonic and password in store
                const nemonicCipher = accountMap.seed
                const passwordCipher = accountMap.password
                // read account wallet data
                that.$store.commit('SET_ACCOUNT_NAME', accountMap.name)
                that.jumpToDashBoard()
            })
    }


    @Watch('formItem.currentAccountName')
    onWalletChange() {
        const {accountMap, accountName} = this
        this.cipher = accountMap[accountName].password
        this.cipherHint = accountMap[accountName].hint
    }


    clearCache() {
        // localRead remove
        // localRemove('lock')
        // localRemove('wallets')
        // localRemove('loglevel:webpack-dev-server')
    }
}
