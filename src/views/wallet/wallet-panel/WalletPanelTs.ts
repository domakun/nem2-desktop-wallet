import {localRead} from '@/core/utils/utils.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import GuideInto from '@/views/login/guide-into/GuideInto.vue'
import WalletFn from '@/views/wallet/wallet-fn/WalletFn.vue'
import WalletSwitch from '@/views/wallet/wallet-switch/WalletSwitch.vue'
import WalletDetails from '@/views/wallet/wallet-details/WalletDetails.vue'
import {getNamespaces} from "@/core/utils/wallet.ts"
import {mapState} from "vuex"

@Component({
    components: {
        WalletSwitch,
        WalletDetails,
        GuideInto,
        WalletFn
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletPanelTs extends Vue {
    activeAccount: any
    app: any
    tabIndex = 0
    toMethod = false

    get wallet() {
        return this.activeAccount.wallet || false
    }

    get walletList() {
        const walletMap = this.activeAccount.walletMap
        let walletList = []
        for (let key in walletMap) {
            walletList.push(walletMap[key])
        }
        return walletList
    }

    get reloadWalletPage() {
        return this.app.reloadWalletPage
    }

    get node() {
        return this.activeAccount.node
    }

    get ConfirmedTxList() {
        return this.activeAccount.ConfirmedTx
    }

    toCreate() {
        this.tabIndex = 0
        this.toMethod = true
    }

    toImport() {
        this.tabIndex = 1
        this.toMethod = true
    }

    toWalletDetails() {
        this.$router.replace({path: '/monitorPanel'})
        this.toMethod = false
    }

    backToGuideInto() {
        this.toMethod = false
    }

    copyObj(obj) {
        const newObj: any = Object.prototype.toString.call(obj) == '[object Array]' ? [] : {}
        for (const key in obj) {
            const value = obj[key]
            if (value && 'object' == typeof value) {
                newObj[key] = this.copyObj(value)
            } else {
                newObj[key] = value
            }
        }
        return newObj
    }

    noHasWallet() {
        this.toCreate()
        this.$store.commit('SET_HAS_WALLET', false)
    }

    setDefaultPage() {
        const name = this.$route.params['name']
        if (name == 'walletImportKeystore') {
            this.toImport()
            return
        } else if (name == 'walletCreate') {
            this.toCreate()
        }
    }

    setLeftSwitchIcon() {
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)
    }

    async getMyNamespaces() {
        if (!this.wallet.address) {
            this.$store.commit('SET_NAMESPACE', [])
            return
        }
        const list = await getNamespaces(this.wallet.address, this.node)
        this.$store.commit('SET_NAMESPACE', list)
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.getMyNamespaces()
    }

    @Watch('wallet')
    onGetWalletChange(n, o) {
        if (!n.address || o.address === n.address) return
        this.getMyNamespaces()
    }

    mounted() {
        this.setLeftSwitchIcon()
        this.setDefaultPage()
        this.getMyNamespaces()
    }
}
