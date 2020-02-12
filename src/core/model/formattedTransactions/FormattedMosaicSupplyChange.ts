import {FormattedTransaction, AppState, TransactionFormatterOptions} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {MosaicSupplyChangeTransaction, MosaicSupplyChangeAction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedMosaicSupplyChange extends FormattedTransaction {
  dialogDetailMap: any
  icon: any

  constructor(tx: MosaicSupplyChangeTransaction,
    store: Store<AppState>,
    options?: TransactionFormatterOptions) {
    super(tx, store, options)
    const {networkCurrency} = store.state.account
    this.dialogDetailMap = {
      'self': tx.signer ? tx.signer.address.pretty() : store.state.account.wallet.address,
      'transaction_type': this.txHeader.tag,
      'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
      'block': this.txHeader.block,
      'hash': this.txHeader.hash,
      'mosaicId': tx.mosaicId.toHex(),
      'direction': tx.action === MosaicSupplyChangeAction.Increase ? 'Increase' : 'Decrease',
      'delta': tx.delta.compact().toLocaleString(),
    }
  }
}
