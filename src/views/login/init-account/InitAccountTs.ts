import {Component, Vue} from 'vue-property-decorator'
import {Message} from "@/config"
import {AppLock, createMnemonic, localRead} from "@/core/utils"
import {AppAccounts, AppAccount} from '@/core/services/Account/appAccount.ts'

@Component
export class InitAccountTs extends Vue {
    jumpToOtherPage(initType) {
        this.$router.push(
            {
                name: 'initSeed',
                params: initType
            })
    }
}
