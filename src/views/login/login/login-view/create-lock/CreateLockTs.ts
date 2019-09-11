import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {standardFields} from '@/core/validation'
import {randomMnemonicWord} from "@/core/utils/hdWallet.ts"
import {createMnemonic} from "@/core/utils/hdWallet"
import {AppLock} from '@/core/utils/appLock'

@Component
export class CreateLockTs extends Vue {
    standardFields: object = standardFields
    errors: any

    formItem = {
        name: '123123123',
        password: '123123123',
        checkPW: '123123123',
        hint: '123123123'
    }

    submit() {
        if (this.errors.items.length > 0) {
            this.$Notice.error({title: this.errors.items[0].msg})
            return
        }
        this.createAccount()
        // return
        // TODO WALLET NAME MUST BE UNIQUE,NEED CHECK  WALLET NAME HERE
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.showIndexView()
                this.$Notice.success({
                    title: this.$t(Message.SUCCESS) + ''
                })
            })
    }

    createAccount() {
        const {name, password, hint} = this.formItem
        // get mnemonicList
        const mnemonicStr = createMnemonic()

        const cipherObject = {
            hint,
            name,
            password,
            walletMap: {},
            mnemonic: mnemonicStr
        }
        const cipherStr = AppLock.encryptString(JSON.stringify(cipherObject), password)
        const accountObject = {
            cipher: cipherStr,
            hint,
            name,
        }
        this.$emit('updateMnemonic', mnemonicStr)
        this.$emit('updateAccountData', accountObject)
    }


    showIndexView() {
        this.$emit('showIndexView', 3)
    }

    hideIndexView() {
        this.$emit('showIndexView', 0)
    }
}
