import {TransactionType} from 'nem2-sdk'
import dashboardAggregate from '@/common/img/monitor/dash-board/dashboardAggregate.png'
import dashboardMultisig from '@/common/img/monitor/dash-board/dashboardMultisig.png'
import dashboardOther from '@/common/img/monitor/dash-board/dashboardOther.png'
import transferSent from '@/common/img/monitor/dash-board/dashboardMosaicOut.png'
import transferReceived from '@/common/img/monitor/dash-board/dashboardMosaicIn.png'

export const transferIcons = {
  transferReceived,
  transferSent,
}

export const transactionTypeToIcon = {
  [TransactionType.NAMESPACE_REGISTRATION] : dashboardOther,
  [TransactionType.ADDRESS_ALIAS] : dashboardOther,
  [TransactionType.MOSAIC_ALIAS] : dashboardOther,
  [TransactionType.MOSAIC_DEFINITION] : dashboardOther,
  [TransactionType.MOSAIC_SUPPLY_CHANGE] : dashboardOther,
  [TransactionType.MULTISIG_ACCOUNT_MODIFICATION] : dashboardMultisig,
  [TransactionType.AGGREGATE_COMPLETE] : dashboardAggregate,
  [TransactionType.AGGREGATE_BONDED] : dashboardAggregate,
  [TransactionType.HASH_LOCK] : dashboardOther,
  [TransactionType.SECRET_LOCK] : dashboardOther,
  [TransactionType.SECRET_PROOF] : dashboardOther,
  [TransactionType.ACCOUNT_ADDRESS_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_MOSAIC_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_OPERATION_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_LINK] : dashboardOther,
  [TransactionType.MOSAIC_ADDRESS_RESTRICTION] : dashboardOther,
  [TransactionType.MOSAIC_GLOBAL_RESTRICTION] : dashboardOther,
  [TransactionType.ACCOUNT_METADATA] : dashboardOther,
  [TransactionType.MOSAIC_METADATA] : dashboardOther,
  [TransactionType.NAMESPACE_METADATA] : dashboardOther,
}
