import {mapState} from "vuex"
import {Address, AliasType, MosaicId} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import EditDialog from './mosaic-edit-dialog/MosaicEditDialog.vue'
import MosaicAliasDialog from './mosaic-alias-dialog/MosaicAliasDialog.vue'
import MosaicUnAliasDialog from './mosaic-unAlias-dialog/MosaicUnAliasDialog.vue'
import {formatNumber} from '@/core/utils'


@Component({
    components: {
        MosaicAliasDialog,
        MosaicUnAliasDialog,
        EditDialog
    },
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class MosaicListTs extends Vue {
    activeAccount: any
    app: any
    isLoadingConfirmedTx = false
    currentTab: number = 0
    currentPage: number = 1
    pageSize: number = 10
    rootNameList: any[] = []
    screenMosaic: any = {}
    showCheckPWDialog = false
    showMosaicEditDialog = false
    showMosaicAliasDialog = false
    showMosaicUnAliasDialog = false
    mosaicMapInfo: any = {}
    selectedMosaic: any = {}

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get nowBlockHeight() {
        return this.app.chainStatus.currentHeight
    }

    get mosaicsLoading() {
        return this.app.mosaicsLoading
    }

    get namespaceMap() {
        let namespaceMap = {}
        this.activeAccount.namespaces.forEach((item) => {
            switch (item.alias.type) {
                case (AliasType.Address):
                    //@ts-ignore
                    namespaceMap[Address.createFromEncoded(item.alias.address).address] = item
                    break
                case (AliasType.Mosaic):
                    namespaceMap[new MosaicId(item.alias.mosaicId).toHex()] = item
            }
        })
        return namespaceMap
    }

    get filteredMosaics() {
        const mosaics: any = Object.values(this.mosaics)
        return [...mosaics].filter(mosaic => (
            mosaic.mosaicInfo &&
            mosaic.mosaicInfo.owner.publicKey === this.accountPublicKey
        ))
    }

    get currentMosaicPage() {
        const start = (this.currentPage - 1) * this.pageSize
        const end = this.currentPage * this.pageSize
        return [...this.filteredMosaics].slice(start, end)
    }

    get currentScreenMosaic() {
        this.screenMosaic = this.screenMosaic
        const start = (this.currentPage - 1) * this.pageSize
        const end = this.currentPage * this.pageSize
        return [...this.screenMosaic].slice(start, end)
    }


    showCheckDialog() {
        this.showCheckPWDialog = true
    }

    toggleChange(page) {
        this.currentPage = page
    }

    formatNumber(number) {
        return formatNumber(number)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    showAliasDialog(item) {
        document.body.click()
        this.selectedMosaic = item
        setTimeout(() => {
            this.showMosaicAliasDialog = true
        })
    }

    showUnAliasDialog(item) {
        document.body.click()
        this.selectedMosaic = item
        setTimeout(() => {
            this.showMosaicUnAliasDialog = true
        })
    }

    closeMosaicAliasDialog() {
        this.showMosaicAliasDialog = false
    }

    closeMosaicUnAliasDialog() {
        this.showMosaicUnAliasDialog = false
    }

    showEditDialog(item) {
        document.body.click()
        this.selectedMosaic = item
        setTimeout(() => {
            this.showMosaicEditDialog = true
        }, 0)
    }

    closeMosaicEditDialog(item) {
        this.showMosaicEditDialog = false
    }

    computeDuration(item) {
        if (!item.mosaicInfo) return 'Loading...'
        const {properties, height} = item.mosaicInfo
        if (properties.duration.compact() === 0) return 'Forever'
        return (height.compact() + properties.duration.compact()) - this.nowBlockHeight
    }

    // screenByDeadline(name) {
    //     this.screenMosaic = this.filteredMosaics.filter((item) => {
    //         if (JSON.parse(name)[1] < 1000000) {
    //             return (item.expirationHeight > JSON.parse(name)[0] - 1 && item.expirationHeight < JSON.parse(name)[1])
    //         }
    //         return (item.expirationHeight > JSON.parse(name)[0] || item.expirationHeight == 'Forever')
    //     })
    // }
}
