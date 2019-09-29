import {mapState} from 'vuex'
import {Message} from "@/config/index.ts"
import {copyTxt} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MultisigMapTs extends Vue {
    dom: any = {}
    activeAccount: any
    app: any
    spinShow = true
    notMultisigNorCosigner = true

    get address() {
        return this.activeAccount.wallet.address
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get node() {
        return this.activeAccount.node
    }

    get multisigLoading() {
        return this.app.multisigLoading
    }

    get multisigAccountInfo() {
        return this.activeAccount.multisigAccountInfo[this.address]
    }

    get multisigAndCosignerList(){
        return this.multisigAccountInfo.cosignatories.concat(this.multisigAccountInfo.multisigAccounts)
    }

    copyText(publicKey) {
        const that = this
        copyTxt(publicKey).then(() => {
            that.$Notice.destroy()
            that.$Notice.success(
                {
                    title: this.$t(Message.COPY_SUCCESS) + ''
                }
            )
        })
    }
}
