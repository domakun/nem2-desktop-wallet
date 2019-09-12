import {AccountHttp, Address, MosaicAmountView, MosaicService, MosaicHttp, MosaicId} from 'nem2-sdk'
import {AppMosaics} from '@/core/services/mosaics'
import {of} from 'rxjs'
import {map, mergeMap} from 'rxjs/operators'
import {AppWallet} from '@/core/utils/wallet.ts'

/**
 * Custom implementation for performance gains
 * @TODO: replace by SDK method when updated
 * https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/247
 */
export const mosaicsAmountViewFromAddress = (node: string, address: Address): Promise<MosaicAmountView[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const accountHttp = new AccountHttp(node)
      const mosaicHttp = new MosaicHttp(node)
      const mosaicService = new MosaicService(accountHttp, mosaicHttp)

      const accountInfo = await accountHttp.getAccountInfo(address).toPromise()
      if(!accountInfo.mosaics.length) return []
    
      const mosaics = accountInfo.mosaics.map(mosaic => mosaic)
      const mosaicIds = mosaics.map(({id}) => new MosaicId(id.toHex()))
      const mosaicViews = await mosaicService.mosaicsView(mosaicIds).toPromise()

      const mosaicAmountViews = mosaics
        .map(mosaic => {
          const mosaicView = mosaicViews
           .find(({mosaicInfo}) => mosaicInfo.mosaicId.toHex() === mosaic.id.toHex())
           
          if(mosaicView === undefined) throw new Error('A MosaicView was not found')
          return new MosaicAmountView(mosaicView.mosaicInfo, mosaic.amount)
        })
         
      resolve(mosaicAmountViews)
    } catch (error) {
      reject(error)
    }
  })
}

export const enrichMosaics = (that) => {
  return new Promise(async (resolve, reject) => {
      try {
          const appMosaics = AppMosaics()
          appMosaics.init(that.mosaicList)
          appMosaics.fromNamespaces(that.namespaceList, that.$store)
          appMosaics.fromTransactions(that.transactionList.transferTransactionList, that.$store)
          // @TODO: Check if the unnamed mosaics have aliases
          await appMosaics.augmentTransactionsMosaics(
              that.transactionList,
              that.$store,
          )
          resolve(true)
      } catch (error) {
          reject(error)
      }
  })
}

export const initMosaic = (wallet, that) => {
    const {node, mosaicList, currentXEM1} = that
    const store = that.$store

    const appMosaics = AppMosaics()
    appMosaics.init(that.mosaicList)
    const address = Address.createFromRawAddress(wallet.address)

    return new Promise(async (resolve, reject) => {
        try {
            const mosaicAmountViews = await mosaicsAmountViewFromAddress(node, address)
            of(mosaicAmountViews)
                .pipe(
                    mergeMap((_) => _),
                    map(mosaic => appMosaics.fromMosaicAmountView(mosaic, store))
                )
                .toPromise()
                new AppWallet(wallet).updateAccountBalance(mosaicList[currentXEM1].balance, store)
                await Promise.all([
                    store.commit('SET_BALANCE_LOADING', false),
                    store.commit('SET_MOSAICS_LOADING', false),
                ])
                resolve(true)
        } catch (error) {
            store.commit('SET_MOSAICS_LOADING', false)
            reject(error)   
        }
    })
}
