import {Component, Vue} from 'vue-property-decorator'
import {settingPanelNavigationBar} from '@/config/index.ts'

@Component
export class SettingPanelTs extends Vue {
    navagatorList = settingPanelNavigationBar
    currentHeadText = ''

    jumpToView(n, index) {
        if (this.navagatorList[index].disabled) return
        let list = this.navagatorList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.navagatorList = list
        this.currentHeadText = n.title
        this.$router.push({
            name: n.name
        })
    }

    mounted() {
        this.currentHeadText = this.navagatorList[0].title
    }

}
