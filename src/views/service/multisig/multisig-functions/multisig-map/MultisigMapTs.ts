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
    pageSize = 7
    page = 1

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

    get multisigAndCosignerList() {
        for (let i = 0; i < 20; i++) {
            this.multisigAccountInfo.cosignatories.push(this.multisigAccountInfo.multisigAccounts[0])
        }
        return this.multisigAccountInfo.cosignatories
        // return this.multisigAccountInfo.cosignatories.concat(this.multisigAccountInfo.multisigAccounts)
    }

    async handleChange(page) {
        this.page = page
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
