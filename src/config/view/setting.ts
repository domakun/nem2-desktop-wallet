import { NetworkType } from 'nem2-sdk'
import dashboardBlockHeight from '@/common/img/monitor/dash-board/dashboardBlockHeight.png'
import dashboardBlockTime from '@/common/img/monitor/dash-board/dashboardBlockTime.png'
import dashboardPointAmount from '@/common/img/monitor/dash-board/dashboardPointAmount.png'
import dashboardTransactionAmount from '@/common/img/monitor/dash-board/dashboardTransactionAmount.png'
import dashboardPublicKey from '@/common/img/monitor/dash-board/dashboardPublicKey.png'
import routers from '@/router/routers.ts'
export const settingNetworkColorConfig = [ 'green_point', 'pink_point', 'purple_point', 'yellow_point' ]

// todo remove it
export const networkTypeConfig: Array<{
  value: NetworkType
  label: string
}> = [
  {
    value: NetworkType.MIJIN_TEST,
    label: 'MIJIN_TEST',
  }, {
    value: NetworkType.MAIN_NET,
    label: 'MAIN_NET',
  }, {
    value: NetworkType.TEST_NET,
    label: 'TEST_NET',
  }, {
    value: NetworkType.MIJIN,
    label: 'MIJIN',
  },
]

export const networkStatusConfig: Array<{
  icon: string
  descript: string
  data: number
  variable: string
}> = [
  {
    icon: dashboardBlockHeight,
    descript: 'block_height',
    data: 1978365,
    variable: 'currentHeight',

  }, {
    icon: dashboardBlockTime,
    descript: 'block_time',
    data: 12,
    variable: 'targetBlockTime',
  }, {
    icon: dashboardPointAmount,
    descript: 'point',
    data: 4,
    variable: 'nodeNumber',
  }, {
    icon: dashboardTransactionAmount,
    descript: 'number_of_transactions',
    data: 0,
    variable: 'numTransactions',
  }, {
    icon: dashboardPublicKey,
    descript: 'Harvester',
    data: 0,
    variable: 'signerPublicKey',
  },
]

function getRoutesWithoutAlert(){
  const loginRouter = routers[0].children[7].children
  const routersMap = {}
  loginRouter.forEach(item=>{
    routersMap[item.name] = true
    // @ts-ignore
    if(item.children){
      // @ts-ignore
      item.children.forEach(subItem=>{
        routersMap[subItem.name] = true
      })
    }
  })
  return routersMap
}

export const routesWithoutAlert = getRoutesWithoutAlert()
