import routers from '@/router/routers.ts'
import {Message, isWindows} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet'
import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
import monitorSeleted from '@/common/img/window/windowSelected.png'
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {localSave} from "@/core/utils/utils.ts"
import {Component, Vue} from 'vue-property-decorator'
import {windowSizeChange, minWindow, maxWindow, closeWindow} from '@/core/utils/electron.ts'
import {mapState} from 'vuex'
import {languageList, nodeList} from "@/config/view";
import {languageType} from "@/config/types";

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
    txStatusListener = null
    languageList = languageList
    localesMap = languageType

    get isNodeHealthy() {
        return this.app.isNodeHealthy
    }

    get wallet() {
        return this.activeAccount.wallet || false
    }

    get walletList() {
        return this.app.walletList || []
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

    get currentNode() {
        return this.activeAccount.node
    }

    get language() {
        return this.$i18n.locale
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
        AppWallet.switchWallet(newActiveWalletAddress, this.walletList, this.$store)
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
        if (!this.app.walletList.length) return
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

    created() {
        if (isWindows) windowSizeChange()
    }
}
