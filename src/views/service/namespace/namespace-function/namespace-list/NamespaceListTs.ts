import {formatSeconds} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
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
import {MosaicNamespaceStatusType} from "@/core/model/MosaicNamespaceStatusType";

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
    pageSize: number = 4
    page: number = 1
    showNamespaceEditDialog = false
    showUnAliasDialog = false
    aliasDialogItem = {}
    showMosaicAliasDialog = false
    isShowAddressAliasDialog = false
    StatusString = MosaicNamespaceStatusType
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration

    get namespaceList() {
        const namespaceList = this.activeAccount.namespaces.map((item) => {
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
        console.log(namespaceList)
        return namespaceList
        
    }

    get slicedNamespaceList() {
        const start = (this.page - 1) * this.pageSize
        const end = this.page * this.pageSize
        return [...this.namespaceList].slice(start, end)
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get accountName(){
        return this.activeAccount.accountName
    }

    get availableMosaics() {
        const {currentHeight} = this
        const {address} = this.wallet
        return AppMosaics().getAvailableToBeLinked(currentHeight, address, this.$store)
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
        const expireTime = endHeight - currentHeight > namespaceGracePeriodDuration ? endHeight - currentHeight : MosaicNamespaceStatusType.EXPIRED
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
        const durationNum = Number(duration - this.currentHeight)
        return formatSeconds(durationNum * 12)
    }
    async handleChange(page) {
        this.page = page
    }
    async filterList(value) {
        const {currentHeight} = this
        if(value = "已过期"){
            this.namespaceList.filter((item,index) =>{
                return item.endHeight < currentHeight
            });
        }else{
            this.namespaceList.filter((item,index) =>{
                return item.endHeight > currentHeight
            });
        }
    }
    
}
