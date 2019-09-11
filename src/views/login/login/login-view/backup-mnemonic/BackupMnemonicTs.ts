import {Message, defaultDerivePath} from "@/config/index.ts"
import {Password} from "nem2-sdk"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {randomMnemonicWord} from "@/core/utils/hdWallet.ts"
import {AppWallet} from "@/core/utils/wallet.ts"
import {mapState} from "vuex"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class BackupMnemonicTs extends Vue {
    app: any
    activeAccount: any
    tags = 0
    mosaics = []
    storeWallet = {}
    showCover = true
    mnemonicRandomArr = []

    @Prop()
    mnemonic: string


    get mnemonicList() {
        return this.mnemonic.split(' ')
    }


    get walletList() {
        return this.app.walletList
    }


    hideCover() {
        this.showCover = false
    }

    sureWord(index) {
        const word = this.mnemonicRandomArr[index]
        this.mnemonicRandomArr.splice(index, 1)
        const wordSpan = document.createElement('span')
        wordSpan.innerText = word
        wordSpan.onclick = () => {
            this.$refs['mnemonicWordDiv']['removeChild'](wordSpan)
        }
        this.$refs['mnemonicWordDiv']['append'](wordSpan)
    }

    checkMnemonic() {
        const mnemonicDiv = this.$refs['mnemonicWordDiv']
        const mnemonicDivChild = mnemonicDiv['getElementsByTagName']('span')
        let childWord = []
        for (let i in mnemonicDivChild) {
            if (typeof mnemonicDivChild[i] !== "object") continue
            childWord.push(mnemonicDivChild[i]['innerText'])
        }
        if (JSON.stringify(childWord) != JSON.stringify(this.mnemonic)) {
            if (childWord.length < 1) {
                this.$Notice.warning({title: '' + this.$t(Message.PLEASE_ENTER_MNEMONIC_INFO)})
            } else {
                this.$Notice.warning({title: '' + this.$t(Message.MNEMONIC_INCONSISTENCY_ERROR)})
            }
            return false
        }
        return true
    }

    changeTabs(index) {
        switch (index) {
            case 0:
                this.tags = index
                break
            case 1:
                this.mnemonicRandomArr = randomMnemonicWord(this.mnemonicList)
                this.tags = index
                break
            case 2:
                if (!this.checkMnemonic()) {
                    return
                }
                this.tags = index
                break
        }
    }

    skipInput(index) {
        this.tags = index
    }


    toWalletPage() {
        // save account base info
        this.$emit('saveDataInLocalStorage')
        // jump to create wallet
        this.$emit('showIndexView', 2)
    }

    toBack() {
        this.$emit('closeCreated')
    }
}
