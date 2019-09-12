import routers from '@/router/routers.ts'
import {Message, isWindows, languageList, localesMap, nodeList} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet'
import {ListenerApiRxjs} from "@/core/api/ListenerApiRxjs.ts"
import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
import monitorSeleted from '@/common/img/window/windowSelected.png'
import {Address, Listener, NamespaceHttp, NamespaceId} from "nem2-sdk"
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {localSave} from "@/core/utils/utils.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {windowSizeChange, minWindow, maxWindow, closeWindow} from '@/core/utils/electron.ts'
import {mapState} from 'vuex'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MenuBarTs extends Vue {
    app: any
    activeAccount: any
    isShowNodeList = false
    isWindows = isWindows
    inputNodeValue = ''
    nodeList = nodeList
    isNowWindowMax = false
    isShowDialog = true
    activePanelList = [false, false, false, false, false]
    monitorSeleted = monitorSeleted
    monitorUnselected = monitorUnselected
    accountAddress = ''
    unconfirmedTxListener = null
    confirmedTxListener = null
    txStatusListener = null
    languageList = languageList
    localesMap = localesMap

    get isNodeHealthy() {
        return this.app.isNodeHealthy
    }

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

    get walletMap() {
        return this.activeAccount.walletMap
    }

    get currentPanelIndex() {
        return this.app.currentPanelIndex
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get node() {
        return this.activeAccount.node
    }

    get UnconfirmedTxList() {
        return this.activeAccount.UnconfirmedTx
    }

    get ConfirmedTxList() {
        return this.activeAccount.ConfirmedTx
    }

    get errorTxList() {
        return this.activeAccount.errorTx
    }

    get currentNode() {
        return this.activeAccount.node
    }

    get language() {
        return this.$i18n.locale
    }

    get confirmedTxList() {
        return this.activeAccount.ConfirmedTx
    }

    get unconfirmedTxList() {
        return this.activeAccount.UnconfirmedTx
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    set confirmedTxList(confirmedTx) {
        this.$store.commit('SET_CONFIRMED_TX', confirmedTx)
    }

    set isNodeHealthy(isNodeHealthy) {
        this.$store.commit('SET_IS_NODE_HEALTHY', isNodeHealthy)
    }

    set unconfirmedTxList(unconfirmedTx) {
        this.$store.commit('SET_UNCONFIRMED_TX', unconfirmedTx)
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    get currentWalletAddress() {
        if (!this.wallet) return false
        return this.activeAccount.wallet.address
    }

    set currentWalletAddress(newActiveWalletAddress) {
        AppWallet.switchWallet(newActiveWalletAddress, this.walletMap, this.$store)
    }

    closeWindow() {
        closeWindow()
    }

    maxWindow() {
        this.isNowWindowMax = !this.isNowWindowMax
        maxWindow()
    }

    minWindow() {
        minWindow()
    }

    selectEndpoint(index) {
        this.nodeList.forEach(item => item.isSelected = false)
        this.nodeList[index].isSelected = true
        this.$store.commit('SET_NODE', this.nodeList[index].value)
    }

    // @TODO: vee-validate
    changeEndpointByInput() {
        let inputValue = this.inputNodeValue
        if (inputValue == '') {
            this.$Message.destroy()
            this.$Message.error(this['$t'](Message.NODE_NULL_ERROR))
            return
        }
        if (inputValue.indexOf(':') == -1) {
            inputValue = "http://" + inputValue + ':3000'
        }
        this.$store.commit('SET_NODE', inputValue)
    }

    toggleNodeList() {
        this.isShowNodeList = !this.isShowNodeList
    }

    switchPanel(index) {
        if (!this.walletList.length) return
        const routerIcon = routers[0].children

        this.$router.push({
            params: {},
            name: routerIcon[index].name
        })
        this.$store.commit('SET_CURRENT_PANEL_INDEX', index)
    }

    accountQuit() {
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
        this.$router.push({
            name: "login",
            params: {
                index: '2'
            }
        })
    }

    async getGenerationHash(node) {
        const that = this
        await new BlockApiRxjs().getBlockByHeight(node, 1).subscribe((blockInfo) => {
            that.$store.commit('SET_GENERATION_HASH', blockInfo.generationHash)
        })
    }

    unconfirmedListener() {
        if (!this.wallet.address) return
        const node = this.node.replace('http', 'ws')
        this.unconfirmedTxListener && this.unconfirmedTxListener.close()
        this.unconfirmedTxListener = new Listener(node, WebSocket)
        new ListenerApiRxjs().listenerUnconfirmed(this.unconfirmedTxListener, Address.createFromRawAddress(this.wallet.address), this.disposeUnconfirmed)
    }

    confirmedListener() {
        if (!this.wallet.address) return
        const node = this.node.replace('http', 'ws')
        this.confirmedTxListener && this.confirmedTxListener.close()
        this.confirmedTxListener = new Listener(node, WebSocket)
        new ListenerApiRxjs().listenerConfirmed(this.confirmedTxListener,
            Address.createFromRawAddress(this.wallet.address), this.disposeConfirmed)
    }

    txErrorListener() {
        if (!this.wallet.address) return
        const node = this.node.replace('http', 'ws')
        this.txStatusListener && this.txStatusListener.close()
        this.txStatusListener = new Listener(node, WebSocket)
        new ListenerApiRxjs().listenerTxStatus(this.txStatusListener, Address.createFromRawAddress(this.wallet.address), this.disposeTxStatus)
    }

    disposeUnconfirmed(transaction) {
        let list = this.unconfirmedTxList
        if (!list.includes(transaction.transactionInfo.hash)) {
            list.push(transaction.transactionInfo.hash)
            this.unconfirmedTxList = list
            this.$Notice.success({
                title: this.$t('Transaction_sending').toString(),
                duration: 20,
            })
        }
    }

    disposeConfirmed(transaction) {
        let list = this.confirmedTxList
        let unList = this.unconfirmedTxList
        if (!list.includes(transaction.transactionInfo.hash)) {
            list.push(transaction.transactionInfo.hash)
            if (unList.includes(transaction.transactionInfo.hash)) {
                unList.splice(unList.indexOf(transaction.transactionInfo.hash), 1)
            }
            this.confirmedTxList = list
            this.unconfirmedTxList = unList
            this.$Notice.destroy()
            this.$Notice.success({
                title: this.$t('Transaction_Reception').toString(),
                duration: 4,
            })
        }
    }


    disposeTxStatus(transaction) {
        let list = this.errorTxList
        if (!list.includes(transaction.hash)) {
            list.push(transaction.hash)
            this.$store.commit('SET_ERROR_TEXT', list)
            this.$Notice.destroy()
            this.$Notice.error({
                title: transaction.status.split('_').join(' '),
                duration: 10,
            })
        }
    }

// languageList

    @Watch('currentNode')
    onCurrentNode() {
        const {currentNode} = this
        const that = this
        const linkedMosaic = new NamespaceHttp(currentNode).getLinkedMosaicId(new NamespaceId('nem.xem'))
        linkedMosaic.subscribe((mosaic) => {
            this.$store.commit('SET_CURRENT_XEM_1', mosaic.toHex())
        })
        that.isNodeHealthy = false
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()

        that.$Notice.destroy()
        that.$Notice.error({
            title: that.$t(Message.NODE_CONNECTION_ERROR) + ''
        })
        if (!currentNode) {
            return
        }
        new BlockApiRxjs().getBlockchainHeight(currentNode).subscribe((info) => {
            that.isNodeHealthy = true
            that.getGenerationHash(currentNode)
            that.$Notice.destroy()
            that.$Notice.success({
                title: that.$t(Message.NODE_CONNECTION_SUCCEEDED) + ''
            })
        }, () => {
            that.isNodeHealthy = false
        })
    }

    @Watch('wallet.address')
    onGetWalletChange() {
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
    }

    created() {
        if (isWindows) windowSizeChange()
        this.onCurrentNode()
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
    }
}
