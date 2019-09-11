import {mapState} from 'vuex'
import {AppWallet} from '@/core/utils/wallet.ts'
import {Component, Vue} from 'vue-property-decorator'
import DeleteWalletCheck from './delete-wallet-check/DeleteWalletCheck.vue'
import {formatXEMamount, formatNumber, getObjectLength} from '@/core/utils/utils.ts'

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
        AppWallet.switchWallet(newActiveWalletAddress, this.walletList, this.$store)
    }

    formatNumber(number) {
        return formatNumber(number)
    }

    formatXEMamount(text) {
        return formatXEMamount(text)
    }

    getWalletBalance(index) {
        const {balance} = this.walletList[index]
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
        walletList.map((item, index) => {
            if (index === 0) {
                item.active = true
            } else {
                item.active = false
            }
        })
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
