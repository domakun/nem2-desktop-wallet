import {mapState} from 'vuex'
import {of} from 'rxjs'
import {pluck, concatMap} from 'rxjs/operators'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {AccountQR} from 'nem2-qr-library'
import {Password, Account} from 'nem2-sdk'
import {copyTxt} from '@/core/utils'
import {Message, threeStepsPictureList} from '@/config'
import {AppWallet, StoreAccount, AppInfo} from '@/core/model'
import failureIcon from '@/common/img/monitor/failure.png'
import {validation} from '@/core/validation'

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  },
  subscriptions() {
    const qrCode$ = this
      .$watchAsObservable('qrCodeArgs', {immediate: true})
      .pipe(pluck('newValue'),
        concatMap((args) => {
          if (args instanceof AccountQR) return args.toBase64()
          return of(failureIcon)
        }))
    return {qrCode$}
  },
})
export class PrivatekeyDialogTs extends Vue {
  activeAccount: StoreAccount
  app: AppInfo
  validation = validation
  errors: any
  stepIndex = 0
  password = ''
  threeStepsPictureList = threeStepsPictureList
  stringOfSteps = [ 'input_password', 'backup_prompt', 'backup_private_key' ]
  @Prop()
  showPrivatekeyDialog: boolean

  get show() {
    return this.showPrivatekeyDialog
  }

  set show(val) {
    if (!val) {
      this.$emit('closePrivatekeyDialog')
    }
  }

  get wallet(): AppWallet {
    return this.activeAccount.wallet
  }

  get account(): Account {
    const {password, wallet} = this
    if (password === '') return null
    if (this.$validator.errors.any()) return null

    try {
      return wallet.getAccount(new Password(password))
    } catch (error) {
      return null
    }
  }

  get privateKey() {
    return this.account ? this.account.privateKey.toString().toUpperCase() : null
  }

  get qrCodeArgs(): AccountQR {
    const {account, wallet, password} = this
    if (!account) return null
    const {generationHash} = this.app.networkProperties
    const {networkType} = wallet
    try {
      return new AccountQR(account, password, networkType, generationHash)
    } catch (e) {
      return null
    }
  }

  checkPassword() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) {
          this.$Notice.destroy()
          this.$Notice.error({title: `${this.$t(this.errors.items[0].msg)}`})
          return
        }

        this.stepIndex = 1
      })
  }

  exportPrivatekey() {
    switch (this.stepIndex) {
      case 0:
        this.checkPassword()
        break
      case 1:
        this.stepIndex = 2
        break
      case 2:
        this.stepIndex = 3
        break
    }
  }

  copyPrivatekey() {
    copyTxt(this.privateKey).then(() => {
      this.$Notice.success({
        title: `${this.$t(Message.COPY_SUCCESS)}`,
      })
    }).catch((error) => {
      console.error(error)
    })
  }
}
