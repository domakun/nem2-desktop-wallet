import {Component, Vue} from 'vue-property-decorator'
import AccountImportMnemonic from '@/views/login/init-seed/account-import-mnemonic/AccountImportMnemonic.vue'
import AccountCreateMnemonic from '@/views/login/init-seed/account-create-mnemonic/AccountCreateMnemonic.vue'
import AccountImportHardware from '@/views/login/init-seed/account-import-hardware/AccountImportHardware.vue'
import SeedCreatedGuide from '@/views/login/init-seed/seed-created-guide/SeedCreatedGuide.vue'
import {mapState} from "vuex"
import {walletFnNavConfig} from '@/config/view/wallet'
import {StoreAccount} from "@/core/model"
import CheckPasswordDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {AppLock, createMnemonic} from "@/core/utils"

@Component({
    components: {
        CheckPasswordDialog,
        AccountImportMnemonic,
        AccountCreateMnemonic,
        AccountImportHardware,
        SeedCreatedGuide
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class InitSeedTs extends Vue {
    activeAccount: StoreAccount
    pageIndex = 0
    createForm = {}
    walletCreated = false
    navList = walletFnNavConfig
    showCheckPWDialog = false

    get accountName() {
        return this.activeAccount.accountName
    }


    createNewMnemonic() {
        this.showCheckPWDialog = true
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    isCreated() {
        this.walletCreated = true
        this.updatePageIndex(-1)
    }

    updatePageIndex(index) {
        this.pageIndex = index
    }

    closeCreated() {
        this.walletCreated = false
    }

    toWalletDetails() {
        this.$router.push('dashBoard')
    }

    goToPage(item, index) {
        for (let i in this.navList) {
            if (this.navList[i].to == item.to) {
                this.navList[i].active = true
            } else {
                this.navList[i].active = false
            }
        }
        // create to input password
        if (index == 0) {
            this.showCheckPWDialog = true
            return
        }
        this.pageIndex = 1
    }

    checkEnd(password) {
        if (!password) return

        const seed = createMnemonic()
        this.$store.commit('SET_MNEMONIC', AppLock.encryptString(seed, password))
        this.createForm = {
            password,
            seed,
        }
        this.pageIndex = -1
        this.showCheckPWDialog = false

    }


    created() {
        if (this.$route.params.seed) {
            this.createForm = {
                seed: this.$route.params.seed,
                password: this.$route.params.password
            }
            this.isCreated()
            return
        }
        const initType = Number(this.$route.params.initType) || 0
        this.goToPage(this.navList[initType], initType)
    }

}
