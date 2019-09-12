import {Password} from 'nem2-sdk'
import {AppWallet} from '@/core/utils/wallet.ts'
import {Message} from "@/config/index.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {AppLock} from "@/core/utils/appLock"

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    }
})
export class DeleteWalletCheckTs extends Vue {
    activeAccount: any
    stepIndex = 0
    show = false
    wallet = {
        password: '123123123'
    }

    @Prop()
    showCheckPWDialog: boolean

    @Prop()
    walletToDelete: AppWallet

    get mnemonicCipher() {
        return this.activeAccount.mnemonic
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    checkPasswordDialogCancel() {
        this.show = false
    }

    submit() {
        const {mnemonicCipher, accountName} = this
        const {password} = this.wallet
        try {
            const nmenonicString = AppLock.decryptString(mnemonicCipher, password)
            const mnemonicObject = JSON.parse(nmenonicString)
            mnemonicObject.password = password
            if (mnemonicObject.password === password) {
                this.$emit('checkEnd', mnemonicObject)
                new AppWallet(this.walletToDelete).deleteWallet(accountName, new Password(password), this.$store, this)
                this.$emit('closeCheckPWDialog')
                // this.showSuccessNotice()
                return
            }
            this.showErrorNotice()
        } catch (e) {
            console.log(e)
            this.showErrorNotice()
        }
    }


    showSuccessNotice() {
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    showErrorNotice() {
        this.$Notice.error({
            title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
        })
    }

    //
    // submit() {
    //     try {
    //         const {accountName} = this
    //         const {password} = this.wallet
    //         const isPasswordCorrect = new AppWallet(this.walletToDelete).checkPassword(new Password(password))
    //         if (isPasswordCorrect) {
    //             new AppWallet(this.walletToDelete).deleteWallet(accountName, password, this.$store, this)
    //             this.$emit('closeCheckPWDialog')
    //         } else {
    //             this.$Notice.error({
    //                 title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
    //             })
    //         }
    //     } catch (error) {
    //         this.$Notice.error({
    //             title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
    //         })
    //     }
    // }

    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.wallet.password = ''
        this.show = this.showCheckPWDialog
    }
}
