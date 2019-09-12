import {mapState} from 'vuex'
import {AppWallet} from '@/core/utils/wallet.ts'
import {Component, Vue} from 'vue-property-decorator'
import DeleteWalletCheck from './delete-wallet-check/DeleteWalletCheck.vue'
import {formatXEMamount, formatNumber, getObjectLength} from '@/core/utils/utils.ts'
import {localRead, localSave} from "@/core/utils/utils"

@Component({
    components: {DeleteWalletCheck},
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class WalletSwitchTs extends Vue {
    app: any
    activeAccount: any
    showCheckPWDialog = false
    deleteIndex = -1
    deletecurrent = -1
    walletToDelete: AppWallet | boolean = false
    walletList = []

    get walletMap() {
        return this.activeAccount.walletMap
    }

    get walletBalanceMap() {
        const walletBalanceMap = localRead('walletBalanceMap') ? JSON.parse(localRead('walletBalanceMap')) : {}

        return walletBalanceMap
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
        this.initWalletList()
    }

    updateWalletList() {
        const {walletMap} = this
        let walletList = []
        for (let key in walletMap) {
            walletList.push(walletMap[key])
        }
        this.walletList = walletList
    }

    switchWallet(newActiveWalletAddress) {
        AppWallet.switchWallet(newActiveWalletAddress, this.walletMap, this.$store)
    }

    formatNumber(number) {
        return formatNumber(number)
    }

    formatXEMamount(text) {
        return formatXEMamount(text)
    }

    getWalletBalance(address) {
        const balance = this.walletBalanceMap[address]
        if (!balance || balance === 0) return 0
        return this.formatXEMamount(balance)
    }

    // @TODO: this should probably not be here
    initWalletList() {
        this.updateWalletList()
        const {walletMap, walletList} = this
        if (getObjectLength(walletMap) == 0) {
            this.$emit('hasWallet')
            this.$store.commit('SET_HAS_WALLET', true)
            this.toCreate()
            return
        }
        for (let i in walletList) {
            this.$set(walletList, i, walletList[i])
        }
        this.$store.commit('SET_HAS_WALLET', false)
    }

    toImport() {
        this.$emit('toImport')
    }

    toCreate() {
        this.$emit('toCreate')
    }

    created() {
        this.updateWalletList()
        this.initWalletList()
    }
}
