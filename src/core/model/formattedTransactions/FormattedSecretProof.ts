import {FormattedTransaction, AppState, TransactionFormatterOptions} from '@/core/model'
import {getRelativeMosaicAmount} from '@/core/utils'
import {Store} from 'vuex'
import {SecretProofTransaction} from 'nem2-sdk'

export class FormattedSecretProof extends FormattedTransaction {
  dialogDetailMap: any
  icon: any

  constructor(tx: SecretProofTransaction,
    store: Store<AppState>,
    options: TransactionFormatterOptions) {
    super(tx, store, options)
    const {networkCurrency} = store.state.account

    this.dialogDetailMap = {
      'self': tx.signer ? tx.signer.address.pretty() : store.state.account.wallet.address,
      'transaction_type': this.txHeader.tag,
      'fee': getRelativeMosaicAmount(tx.maxFee.compact(), networkCurrency.divisibility),
      'block': this.txHeader.block,
      'hash': this.txHeader.hash,
      'hashType': tx.hashType,
      'proof': tx.proof,
    }
  }
}
