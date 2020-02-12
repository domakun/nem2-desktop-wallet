import {shallowMount, config, createLocalVue} from '@vue/test-utils'
import VueRouter from 'vue-router'
import iView from 'view-design'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
// @ts-ignore
import WalletSwitch from '@/views/wallet/wallet-switch/WalletSwitch.vue'
import {accountState} from '@/store/account'
import {appMutations, appState} from '@/store/app'
import {veeValidateConfig} from '@/core/validation'
import {
  mosaics,
  networkCurrency,
  hdAccount,
} from '@MOCKS/index'

// @ts-ignore
const localVue = createLocalVue()
const router = new VueRouter()
localVue.use(VueRouter)
localVue.use(iView)
localVue.use(Vuex)
localVue.use(VeeValidate, veeValidateConfig)
localVue.directive('focus', {
  inserted: function (el) {
    el.focus()
  },
})

jest.mock('nem2-qr-library')
// close warning
config.logModifiedComponents = false

describe('WalletSwitch', () => {
  let store
  let wrapper
  beforeEach(() => {
    store = store = new Vuex.Store({
      modules: {
        account: {
          state: Object.assign(accountState.state, {
            wallet: hdAccount.wallets[0],
            mosaics,
            networkCurrency,
            accountName: hdAccount.accountName,
          }),
        },
        app: {
          state: Object.assign(appState.state, {
            walletList: hdAccount.wallets,
          }),
          mutations: appMutations.mutations,
        },
      },
    })
    wrapper = shallowMount(WalletSwitch, {
      sync: false,
      mocks: {
        $t: (msg) => msg,
      },
      computed: {
        cipher() {
          return hdAccount.password
        },
      },
      localVue,
      store,
      router,
    })
  })

  it('Component WalletSwitch is not null ', () => {
    expect(wrapper).not.toBeNull()
  })

  it('should not create seed wallet while seed wallets is more than 10', () => {
    wrapper.vm.$store.commit('SET_WALLET_LIST', [...Array(10)].map(() => hdAccount.wallets[0]))
    wrapper.vm.checkBeforeShowWalletAdd()
    expect(wrapper.vm.showWalletAdd).toBe(false)
  })
})
