import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'
import {formatXEMamount, formatNumber, localRead} from '@/core/utils/utils.ts'
import {AppWallet, AppInfo, StoreAccount, AppAccounts} from "@/core/model"
import {CreateWalletType} from "@/core/model/CreateWalletType"
import {walletStyleSheetType} from '@/config/view/wallet.ts'
import {MultisigAccountInfo, Password} from 'nem2-sdk'
import TheWalletUpdate from "@/views/wallet/wallet-switch/the-wallet-update/TheWalletUpdate.vue"
import {Message, networkConfig} from "@/config"

@Component({
    components: {TheWalletDelete, TheWalletUpdate},
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class WalletSwitchTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    showDeleteDialog = false
    showUpdateDialog = false
    showCheckPWDialog = false
    deleteIndex = -1
    deletecurrent = -1
    walletToDelete: AppWallet | boolean = false
    thirdTimestamp = 0
    walletStyleSheetType = walletStyleSheetType
    walletToUpdate = {}


    get walletList() {
        let {walletList} = this.app
        walletList.sort((a, b) => {
            return b.createTimestamp - a.createTimestamp
        })
        return walletList.map(item => {
            const walletType = item.accountTitle.substring(0, item.accountTitle.indexOf('-'))
            switch (walletType) {
                case CreateWalletType.keyStore:
                case CreateWalletType.privateKey:
                    item.stylesheet = walletStyleSheetType.otherWallet
                    break
                case CreateWalletType.seed:
                    item.stylesheet = walletStyleSheetType.seedWallet
                    break
            }
            return item
        })
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    isMultisig(address: string): boolean {
        const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[address]
        if (!multisigAccountInfo) return false
        return multisigAccountInfo.cosignatories.length > 0
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    closeUpdateDialog() {
        this.showUpdateDialog = false
    }

    closeDeleteDialog() {
        this.showDeleteDialog = false
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

    toImport() {
        this.$emit('toImport')
    }

    showErrorDialog(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: this.$t(text) + ''
        })
    }

    toCreate() {
        const {accountName} = this
        const walletList = JSON.parse(localRead('accountMap'))[accountName].wallets
        // get sorted path list
        const seedPathList = walletList.filter(item => item.path).map(item => item.path.substr(-1)).sort()
        // check if seed wallets > 10
        if (seedPathList.length > networkConfig.seedWalletMaxAmount) {
            this.showErrorDialog(Message.SEED_WALLET_OVERFLOW_ERROR)
            return
        }
        //get min path to create
        let pathToCreate = 0
        // check if there is a jump number
        const flag = seedPathList.every((item, index) => {
            if (item == index) return true
            pathToCreate = index
            return false
        })
        pathToCreate = flag ? seedPathList.length : pathToCreate
        console.log(pathToCreate)
        // TODO CREATE NEW SEED WALLET
        // this.showCheckPWDialog = true
        // this.$emit('toCreate')
        // new AppWallet().createFromMnemonic('')
    }

    checkEnd(password) {
        if (!password) return
        const {accountName} = this
        const appAccounts = AppAccounts()
        // try {
        //     new AppWallet().createFromPath(walletName, new Password(password), path, currentNetType, this.$store)
        //     this.$router.push('dashBoard')
        // } catch (e) {
        //     this.$Notice.error({title: this.$t(Message.HD_WALLET_PATH_ERROR) + ''})
        // }
    }
}
