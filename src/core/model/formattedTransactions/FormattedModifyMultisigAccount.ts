import {FormattedTransaction, AppState, CosignatoryModifications, TransactionFormatterOptions} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {MultisigAccountModificationTransaction} from 'nem2-sdk'
import {Store} from 'vuex'

export class FormattedModifyMultisigAccount extends FormattedTransaction {
  dialogDetailMap: any
  icon: any

  constructor(tx: MultisigAccountModificationTransaction,
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
      'minApprovalDelta': tx.minApprovalDelta,
      'maxRemovalDelta': tx.minRemovalDelta,
      'cosignatories': CosignatoryModifications.createFromMultisigAccountModificationTransaction(tx),
    }
  }
}
