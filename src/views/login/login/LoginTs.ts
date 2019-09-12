import {localesMap, languageList} from "@/config/index.ts"
import {localSave, localRead, getObjectLength} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import GetStart from './login-view/get-start/GetStart.vue'
import InputLock from './login-view/input-lock/InputLock.vue'
import CreateLock from './login-view/create-lock/CreateLock.vue'
import BackupMnemonic from './login-view/backup-mnemonic/BackupMnemonic.vue'
import {mapState} from "vuex"
import {localAddInMap} from "@/core/utils/utils"

@Component({
    components: {
        GetStart,
        CreateLock,
        InputLock,
        BackupMnemonic
    },
    computed: {
        ...mapState({
            app: 'app',
        })
    }
})
export class LoginTs extends Vue {
    app: any
    languageList = languageList
    isShowDialog = true
    indexShowList = [true, false, false, false]
    mnemonic = ''
    accountObject: any = {}

    switchLanguage(language) {
        // @ts-ignore
        this.$i18n.locale = language
        localSave('locale', language)
    }

    get getWalletList() {
        return this.app.walletList || []
    }

    get language() {
        return this.$i18n.locale
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    updateMnemonic(mnemonic: string) {
        this.mnemonic = mnemonic
    }

    showIndexView(index) {
        let list = [false, false, false]
        if (index != 0 && localRead('lock')) {
            list[2] = true
        } else {
            list[index] = true
        }
        this.indexShowList = list
    }

    isCallShowIndexView() {
        if (this.$route.params.index) {
            this.showIndexView(this.$route.params.index)
            return
        }
        const walletMapString = localRead('accountMap')
        const walletMap = walletMapString ? JSON.parse(walletMapString) : []
        if (getObjectLength(walletMap) >= 1) {
            this.showIndexView(2)
        }
    }

    updateAccountData(accountObject) {
        this.accountObject = accountObject
    }

    saveDataInLocalStorage() {
        const {accountObject} = this
        // save in localstorage
        localAddInMap('accountMap', accountObject.name, accountObject)
    }

    mounted() {
        this.isCallShowIndexView()
    }
}
