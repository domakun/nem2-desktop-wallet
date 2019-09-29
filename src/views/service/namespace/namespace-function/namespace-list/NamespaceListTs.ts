import {formatSeconds} from '@/core/utils/utils.ts'
import {Component, Watch, Vue} from 'vue-property-decorator'
import NamespaceEditDialog from './namespace-edit-dialog/NamespaceEditDialog.vue'
import {mapState} from "vuex"
import {networkConfig} from '@/config/index.ts'
import {Address, MosaicId, AliasType} from "nem2-sdk"
import NamespaceUnAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-unAlias-dialog/NamespaceUnAliasDialog.vue'
import NamespaceMosaicAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-mosaic-alias-dialog/NamespaceMosaicAliasDialog.vue'
import NamespaceAddressAliasDialog
    from '@/views/service/namespace/namespace-function/namespace-list/namespace-address-alias-dialog/NamespaceAddressAliasDialog.vue'
import {AppMosaics} from '@/core/services/mosaics'
import {MosaicNamespaceStatusType} from "@/core/model/MosaicNamespaceStatusType"
import {sortByBindInfo, sortByBindType, sortByduration, sortByName, sortByOwnerShip} from "@/core/services/namespace"
import {namespaceSortType} from "@/config/view/namespace"

@Component({
    components: {
        NamespaceEditDialog,
        NamespaceUnAliasDialog,
        NamespaceMosaicAliasDialog,
        NamespaceAddressAliasDialog

    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})

export class NamespaceListTs extends Vue {
    activeAccount: any
    app: any
    currentNamespace = ''
    pageSize: number = networkConfig.namespaceListSize
    page: number = 1
    showNamespaceEditDialog = false
    showUnAliasDialog = false
    aliasDialogItem = {}
    showMosaicAliasDialog = false
    isShowAddressAliasDialog = false
    StatusString = MosaicNamespaceStatusType
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration
    namespaceSortType = namespaceSortType
    currentNamespaceList = []
    currentSortType = ''
    isShowExpiredNamespace = true
    isShowMosaicAlias = false
    dataLength = 0

    get NamespaceList() {
        const NamespaceList = this.activeAccount.namespaces.map((item) => {
            switch (item.alias.type) {
                case (AliasType.None):
                    item.aliasTarget = MosaicNamespaceStatusType.NOALIAS
                    item.aliasType = MosaicNamespaceStatusType.NOALIAS
                    item.isLinked = false
                    break
                case (AliasType.Address):
                    //@ts-ignore
                    item.aliasTarget = Address.createFromEncoded(item.alias.address).address
                    item.aliasType = 'address'
                    item.isLinked = true
                    break
                case (AliasType.Mosaic):
                    item.aliasTarget = new MosaicId(item.alias.mosaicId).toHex()
                    item.aliasType = 'mosaic'
                    item.isLinked = true
            }
            return item
        })
        return NamespaceList

    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get availableMosaics() {
        const {currentHeight} = this
        const {address} = this.wallet
        return AppMosaics().getAvailableToBeLinked(currentHeight, address, this.$store)
    }

    get currentNamespaceListByPage() {
        return this.currentNamespaceList.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    }

    get unlinkMosaicList() {
        const {currentHeight} = this
        const {address} = this.wallet
        return AppMosaics().getAvailableToBeLinked(currentHeight, address, this.$store)

    }

    get namespaceLoading() {
        return this.app.namespaceLoading
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    getSortType(type) {
        this.currentSortType = type
        const currentNamespaceList = [...this.currentNamespaceList]
        switch (type) {
            case namespaceSortType.byName:
                this.currentNamespaceList = sortByName(currentNamespaceList)
                break
            case namespaceSortType.byDuration:
                this.currentNamespaceList = sortByduration(currentNamespaceList)
                break
            case namespaceSortType.byBindInfo:
                this.currentNamespaceList = sortByBindInfo(currentNamespaceList)
                break
            case namespaceSortType.byBindType:
                this.currentNamespaceList = sortByBindType(currentNamespaceList)
                break
            case namespaceSortType.byOwnerShip:
                this.currentNamespaceList = sortByOwnerShip(currentNamespaceList)
                break
        }
    }


    closeMosaicAliasDialog() {
        this.showMosaicAliasDialog = false
    }

    closeUnAliasDialog() {
        this.showUnAliasDialog = false
    }

    showEditDialog(namespaceName) {
        this.currentNamespace = namespaceName
        this.showNamespaceEditDialog = true
    }

    closeNamespaceEditDialog() {
        this.showNamespaceEditDialog = false
    }

    closeAddressAliasDialog() {
        this.isShowAddressAliasDialog = false
    }

    computeDuration(namespaceInfo) {
        const {endHeight, isActive} = namespaceInfo
        const {currentHeight, namespaceGracePeriodDuration} = this
        if (!isActive) {
            return MosaicNamespaceStatusType.EXPIRED
        }
        const expireTime = endHeight - currentHeight - namespaceGracePeriodDuration > 0 ? endHeight - currentHeight - namespaceGracePeriodDuration : MosaicNamespaceStatusType.EXPIRED
        return expireTime
    }

    showUnlinkDialog(aliasItem) {
        this.showUnAliasDialog = true
        this.aliasDialogItem = aliasItem
    }

    showMosaicLinkDialog(aliasItem) {
        this.showMosaicAliasDialog = true
        this.aliasDialogItem = aliasItem
    }

    showAddressLinkDialog(aliasItem) {
        this.isShowAddressAliasDialog = true
        this.aliasDialogItem = aliasItem

    }

    durationToTime(duration) {
        const {namespaceGracePeriodDuration} = this
        const durationNum = Number(duration - this.currentHeight - namespaceGracePeriodDuration)
        return formatSeconds(durationNum * 12)
    }

    async handleChange(page) {
        this.page = page
    }

    toggleIsShowExpiredNamespace() {
        const {isShowExpiredNamespace} = this
        const {currentHeight, namespaceGracePeriodDuration} = this
        const list = [...this.NamespaceList]
        this.currentNamespaceList = list.filter(item => isShowExpiredNamespace || item.endHeight - currentHeight > namespaceGracePeriodDuration)
        this.isShowExpiredNamespace = !isShowExpiredNamespace
    }

    @Watch('NamespaceList', {deep: true})
    onNamespaceListChange() {

        this.initNamespace()
    }

    initNamespace() {
        this.getSortType(namespaceSortType.byDuration)
        this.toggleIsShowExpiredNamespace()
    }

    mounted() {
        this.initNamespace()
    }

}
