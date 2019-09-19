import {AppMosaics} from '@/core/services/mosaics'

export const appMosaicsModule = (store) => {
  store.registerModule('appMosaics', appMosaicsModule)

  store.subscribe(async (mutation, state) => {
    /**
     * Extracts all hexIds from transactions,
     * Add them to store.account.mosaics
     */
    if (mutation.type === 'SET_TRANSACTION_LIST') {
      const appMosaics = AppMosaics(state.account.accountName).fromTransactions(state.account.transactionList)
      store.commit('UPDATE_MOSAICS', appMosaics)
    }

    /**
     * Check for missing mosaicInfo in the mosaics added to store.account.mosaics
     */
    if (mutation.type === 'UPDATE_MOSAICS') {
      try {
        const {mosaics, node} = state.account
        const mosaicsWithInfo = await AppMosaics(state.account.accountName).updateMosaicInfo(mosaics, node)
        if (!mosaicsWithInfo) return
        store.commit('UPDATE_MOSAICS_INFO', mosaicsWithInfo)
      } catch (error) {
        console.error("appMosaicsModule -> error", error)
      }
    }

    if (mutation.type === 'SET_NAMESPACES') {
      const appMosaics = AppMosaics(store.state.account.accountName).fromNamespaces(state.account.namespaces)
      store.commit('UPDATE_MOSAICS_INFO', appMosaics)
    }
  })
}
