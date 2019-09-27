import {Component, Vue} from 'vue-property-decorator'
import {createMnemonic, localRead} from "@/core/utils"
import CheckPasswordDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

@Component({
    components: {
        CheckPasswordDialog
    }
})
export class InitAccountTs extends Vue {
    showCheckPWDialog = false

    jumpToOtherPage(initType) {
        this.$router.push(
            {
                name: 'initSeed',
                params: {
                    initType: initType
                }
            })
    }

    checkEnd(password) {
        if (!password) return
        const seed = createMnemonic()
        this.$store.commit('SET_MNEMONIC', seed)
        const menmonicObject = {
            password,
            seed,
        }
        this.$router.push({
            name: 'initSeed',
            params: menmonicObject,

        })
    }

    createNewMnemonic() {
        this.showCheckPWDialog = true
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

}
