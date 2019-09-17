import { NetworkType, TransactionType } from 'nem2-sdk'
import dashboardBlockHeight from "@/common/img/monitor/dash-board/dashboardBlockHeight.png"
import dashboardBlockTime from "@/common/img/monitor/dash-board/dashboardBlockTime.png"
import dashboardPointAmount from "@/common/img/monitor/dash-board/dashboardPointAmount.png"
import dashboardTransactionAmount from "@/common/img/monitor/dash-board/dashboardTransactionAmount.png"
import dashboardPublickey from "@/common/img/monitor/dash-board/dashboardPublickey.png"
import mosaic1Icon from "@/common/img/service/mosaic1.png"
import mosaic2Icon from "@/common/img/service/mosaic2.png"
import multisign1Icon from "@/common/img/service/multisign1.png"
import multisign2Icon from "@/common/img/service/multisign2.png"
import namespace1Icon from "@/common/img/service/namespace1.png"
import namespace2Icon from "@/common/img/service/namespace2.png"
import apostille1Icon from "@/common/img/service/apostille1.png"
import apostille2Icon from "@/common/img/service/apostille2.png"

export const echartsConfigure = {
    multisigMapOption: {
        tooltip: {
            alwaysShowContent: true,
            padding: 0,
            position: 'right',
            formatter: (params: any, copyIcon) => {
                if (params.dataType == 'edge') {
                    return
                }
                const template = `<div class="tooltip" >
                                        <div>${params.data.address.address}</div>
                                    </div>`
                return template
            }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                left: 60,
                type: 'graph',
                layout: 'none',
                symbolSize: 70,
                roam: false,
                label: {
                    normal: {
                        show: true
                    }
                },
                edgeSymbol: ['none', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    normal: {
                        textStyle: {
                            fontSize: 20
                        }
                    }
                },
                data: [],
                links: [],
                lineStyle: {
                    normal: {
                        width: 2,
                        curveness: 0,
                        color: '#4DC2BF',
                        type: 'dotted'
                    }
                }
            }
        ]
    },

    votePieOption: {
        font: {},
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        color: ['#EC5447', '#F1C850'],
        series: [
            {
                name: 'vote',
                type: 'pie',
                data: [
                    {value: 100, name: 'A 335 25%'},
                    {value: 300, name: 'B 300 75%'},
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    borderWidth: 2,
                    borderColor: '#fff',
                }
            }
        ]
    }
}


export const formData = {
    multisigTransferForm: {
        address: 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC',
        remark: '',
        multisigPublickey: '',
        innerFee: 1,
        lockFee: 10,
        aggregateFee: 1,
        mosaicTransferList: [],
        isEncryption: true
    },
    transferForm: {
        fee: 0.5,
        remark: '',
        address: 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC',
        mosaicTransferList: [],
        isEncrypted: true
    },
    remoteForm: {
        remotePublickey: '',
        fee: 0.5,
        password: ''
    },
    mosaicAliasForm: {
        aliasName: '',
        fee: 0.5,
        password: ''
    },
    mosaicEditForm: {
        id: '',
        aliasName: '',
        delta: 0,
        supplyType: 1,
        changeDelta: 0,
        duration: '',
        fee: 0.5,
        password: ''
    },
    mosaicUnaliasForm: {
        fee: 0.5,
        password: ''
    },
    mosaicTransactionForm: {
        restrictable: false,
        supply: 500000000,
        divisibility: 0,
        transferable: true,
        supplyMutable: true,
        permanent: false,
        duration: 1000,
        innerFee: 0.5,
        aggregateFee: 0.5,
        lockFee: 0.5,
        multisigPublickey: ''
    },
    multisigConversionForm: {
        publickeyList: [],
        minApproval: 1,
        minRemoval: 1,
        bondedFee: 1,
        lockFee: 10,
        innerFee: 1
    },
    multisigManagementForm: {
        minApprovalDelta: 0,
        minRemovalDelta: 0,
        bondedFee: 1,
        lockFee: 10,
        innerFee: 1,
        cosignerList: [],
        multisigPublickey: ''
    },
    namesapceEditForm: {
        name: '',
        duration: 0,
        fee: 0.5,
        password: ''
    },
    rootNamespaceForm: {
        duration: 1000,
        rootNamespaceName: '',
        multisigPublickey: '',
        innerFee: 0.5,
        aggregateFee: 0.5,
        lockFee: 0.5
    },
    walletImportMnemonicForm: {
        mnemonic: '',
        networkType: 0,
        walletName: '',
        password: '',
        checkPW: '',
    },
    walletImportPrivateKeyForm: {
        privateKey: 'FB628AF4276F696AD1FA85B7AB1E49CFD896E5EC85000E3179EEEA59717DD8DE',
        networkType: 0,
        walletName: '',
        password: '',
        checkPW: '',
    }
}
export const isWindows = require('./packge.ts').isWin32

//apiServer
export const apiServerConfig = {
    apiUrl: 'http://120.79.181.170',
    marketUrl: 'http://app.nemcn.io',
    voteUrl: 'http://120.79.181.170'
}

//language
export const languageType: any = {
    'zh-CN': '中文',
    'en-US': 'English'
}
export const languageList: Array<any> = [
    {
        value: 'zh-CN',
        label: '中文'
    },
    {
        value: 'en-US',
        label: 'English'
    }
]

//transaction
export const transferType = {
    'RECEIVED': 1,
    'SENT': 0
}
export const aliasType = {
    noAlias: 0,
    mosaicAlias: 1,
    addressAlias: 2
}
export const transactionTag = {
    RECEIPT: 'receipt',
    PAYMENT: 'payment',
    [TransactionType.REGISTER_NAMESPACE]: 'register_namespace',
    [TransactionType.ADDRESS_ALIAS]: 'address_alias',
    [TransactionType.MOSAIC_ALIAS]: 'mosaic_alias',
    [TransactionType.MOSAIC_DEFINITION]: 'mosaic_definition',
    [TransactionType.MOSAIC_SUPPLY_CHANGE]: 'mosaic_supply_change',
    [TransactionType.MODIFY_MULTISIG_ACCOUNT]: 'modify_multisig_account',
    [TransactionType.AGGREGATE_COMPLETE]: 'aggregate_complete',
    [TransactionType.AGGREGATE_BONDED]: 'aggregate_bonded',
    [TransactionType.LOCK]: 'lock',
    [TransactionType.SECRET_LOCK]: 'secret_lock',
    [TransactionType.SECRET_PROOF]: 'secret_proof',
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS]: 'modify_account_property_address',
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC]: 'modify_account_property_mosaic',
    [TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION]: 'modify_account_property_entity_type',
    [TransactionType.LINK_ACCOUNT]: 'link_account'
}
export const transactionTypeList = {
    'transfer': {
        label: 'transfer',
        value: TransactionType.TRANSFER
    },
    'register_namespace': {
        label: 'register_namespace',
        value: TransactionType.REGISTER_NAMESPACE
    },
    'address_alias': {
        label: 'address_alias',
        value: TransactionType.ADDRESS_ALIAS
    },
    'mosaic_alias': {
        label: 'mosaic_alias',
        value: TransactionType.MOSAIC_ALIAS
    },
    'mosaic_definition': {
        label: 'mosaic_definition',
        value: TransactionType.MOSAIC_DEFINITION
    },
    'mosaic_supply_change': {
        label: 'mosaic_supply_change',
        value: TransactionType.MOSAIC_SUPPLY_CHANGE
    },
    'modify_multisig_account': {
        label: 'modify_multisig_account',
        value: TransactionType.MODIFY_MULTISIG_ACCOUNT
    },
    'aggregate_complete': {
        label: 'aggregate_complete',
        value: TransactionType.AGGREGATE_COMPLETE
    },

    'aggregate_bonded': {
        label: 'aggregate_bonded',
        value: TransactionType.AGGREGATE_BONDED
    },
    'lock': {
        label: 'lock',
        value: TransactionType.LOCK
    },
    'secret_lock': {
        label: 'secret_lock',
        value: TransactionType.SECRET_LOCK
    },
    'secret_proof': {
        label: 'secret_proof',
        value: TransactionType.SECRET_PROOF
    },
    'modify_account_property_address': {
        label: 'modify_account_property_address',
        value: TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS
    },
    'modify_account_property_mosaic': {
        label: 'modify_account_property_address',
        value: TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC
    },
    'modify_account_property_entity_type': {
        label: 'modify_account_property_entity_type',
        value: TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION
    },
    'link_account': {
        label: 'link_account',
        value: TransactionType.LINK_ACCOUNT
    }
}
export const networkTypeList = [
    {
        value: NetworkType.MIJIN_TEST,
        label: 'MIJIN_TEST'
    }, {
        value: NetworkType.MAIN_NET,
        label: 'MAIN_NET'
    }, {
        value: NetworkType.TEST_NET,
        label: 'TEST_NET'
    }, {
        value: NetworkType.MIJIN,
        label: 'MIJIN'
    },
]

//error message
export const Message = {
    COPY_SUCCESS: 'successful_copy',
    SUCCESS: 'success',
    OPERATION_SUCCESS: 'successful_operation',
    UPDATE_SUCCESS: 'update_completed',
    NODE_CONNECTION_SUCCEEDED: 'Node_connection_succeeded',

    PLEASE_SET_WALLET_PASSWORD_INFO: 'please_set_your_wallet_password',
    PLEASE_ENTER_MNEMONIC_INFO: 'Please_enter_a_mnemonic_to_ensure_that_the_mnemonic_is_correct',
    PLEASE_SWITCH_NETWORK: 'walletCreateNetTypeRemind',
    NO_MNEMONIC_INFO: 'no_mnemonic',

    WALLET_NAME_INPUT_ERROR: 'walletCreateWalletNameRemind',
    PASSWORD_CREATE_ERROR: 'createLockPWRemind',
    INCONSISTENT_PASSWORD_ERROR: 'createLockCheckPWRemind',
    PASSWORD_HIT_SETTING_ERROR: 'createLockPWTxtRemind',
    WRONG_PASSWORD_ERROR: 'password_error',
    MOSAIC_NAME_NULL_ERROR: 'mosaic_name_can_not_be_null',
    QR_GENERATION_ERROR: 'QR_code_generation_failed',
    ADDRESS_FORMAT_ERROR: 'address_format_error',
    AMOUNT_LESS_THAN_0_ERROR: 'amount_can_not_be_less_than_0',
    FEE_LESS_THAN_0_ERROR: 'fee_can_not_be_less_than_0',
    SUPPLY_LESS_THAN_0_ERROR: 'supply_can_not_less_than_0',
    DIVISIBILITY_LESS_THAN_0_ERROR: 'divisibility_can_not_less_than_0',
    DURATION_LESS_THAN_0_ERROR: 'duration_can_not_less_than_0',
    DURATION_MORE_THAN_1_YEARS_ERROR: 'duration_can_not_more_than_1_years',
    DURATION_MORE_THAN_10_YEARS_ERROR: 'duration_can_not_more_than_10_years',
    MNEMONIC_INCONSISTENCY_ERROR: 'Mnemonic_inconsistency',
    PASSWORD_SETTING_INPUT_ERROR: 'walletCreatePasswordRemind',
    MNENOMIC_INPUT_ERROR: 'Mnemonic_input_error',
    OPERATION_FAILED_ERROR: 'operation_failed',
    NODE_NULL_ERROR: 'point_null_error',
    INPUT_EMPTY_ERROR: 'Any_information_cannot_be_empty',
    CO_SIGNER_NULL_ERROR: 'co_signers_amount_less_than_0',
    MIN_APPROVAL_LESS_THAN_0_ERROR: 'min_approval_amount_less_than_0',
    MIN_REMOVAL_LESS_THAN_0_ERROR: 'min_removal_amount_less_than_0',
    MAX_APPROVAL_MORE_THAN_10_ERROR: 'max_approval_amount_more_than_10',
    MAX_REMOVAL_MORE_THAN_10_ERROR: 'max_removal_amount_more_than_10',
    ILLEGAL_PUBLICKEY_ERROR: 'illegal_publickey',
    ILLEGAL_MIN_APPROVAL_ERROR: 'min_approval_amount_illegal',
    ILLEGAL_MIN_REMOVAL_ERROR: 'min_removal_amount_illegal',
    MOSAIC_HEX_FORMAT_ERROR: 'mosaic_hex_format_error',
    ALIAS_NAME_FORMAT_ERROR: 'alias_name_format_error',
    DURATION_VALUE_LESS_THAN_1_ERROR: 'The_value_of_duration_cannot_be_less_than_1',
    NAMESPACE_NULL_ERROR: 'Namespace_cannot_be_a_null_or_empty_string',
    ROOT_NAMESPACE_TOO_LONG_ERROR: 'The_root_namespace_cannot_be_longer_than_16',
    NAMESPACE_STARTING_ERROR: 'Namespace_must_start_with_a_letter',
    NAMESPACE_FORMAT_ERROR: 'Namespace_can_only_contain_numbers_letters_and_other',
    NAMESPACE_USE_BANDED_WORD_ERROR: 'Namespace_cannot_use_forbidden_words',
    SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR: 'The_sub_namespace_cannot_be_longer_than_16',
    NODE_CONNECTION_ERROR: 'Node_connection_failed',
    KEYSTORE_DECRYPTION_FAILED: 'Keystore_decryption_failed',
    MOSAIC_LIST_NULL_ERROR: 'The_mosaic_to_be_sent_is_empty',
    ADDRESS_ALIAS_NOT_EXIST_ERROR: 'address_alias_not_exist'

}

//node
export const nodeList = [
    {
        value: 'http://13.114.200.132:3000',
        name: 'jp-5',
        url: '13.114.200.132',
        isSelected: false,
    },
    {
        value: 'http://52.194.207.217:3000',
        name: 'api-node-jp-12',
        url: '52.194.207.217',
        isSelected: false,
    },
]
export const nodeConfig = {
    node: 'http://13.114.200.132:3000',
    currentXem: 'nem.xem',
    currentXEM1: '',
    XEM: 'XEM',
    gas2xemRate: 20000   //  1xem=20000gas

}
export const networkStatusList = [
    {
        icon: dashboardBlockHeight,
        descript: 'block_height',
        data: 1978365,
        variable: 'currentHeight'

    }, {
        icon: dashboardBlockTime,
        descript: 'average_block_time',
        data: 12,
        variable: 'currentGenerateTime'
    }, {
        icon: dashboardPointAmount,
        descript: 'point',
        data: 4,
        variable: 'nodeAmount'
    }, {
        icon: dashboardTransactionAmount,
        descript: 'number_of_transactions',
        data: 0,
        variable: 'numTransactions'
    }, {
        icon: dashboardPublickey,
        descript: 'Harvester',
        data: 0,
        variable: 'signerPublicKey'
    }
]

//community
export const communityPanelNavList = [
    { name: 'news', to: '/information', active: true },
    { name: 'vote', to: '/vote', active: false, },
]
export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const voteType = {
    RADIO: 0,
    MULTIPLE: 1
}
export const voteFilterList = [
    {
        value: 0,
        label: 'all'
    },
    {
        value: 1,
        label: 'processing'
    },
    {
        value: 2,
        label: 'already_involved'
    },
    {
        value: 3,
        label: 'finished'
    }
]
export const voteSelectionList = [
    {
        description: '1'
    }, {
        description: '2'
    }
]
export const voteActionList = [
    {
        name: 'choose_to_vote',
        isSelect: true
    }, {
        name: 'create_a_vote',
        isSelect: false
    }
]

//monitor
export const monitorPanelNavigatorList = [
    {
        name: 'dash_board',
        isSelect: true,
        path: 'dashBoard'
    },
    {
        name: 'transfer',
        isSelect: false,
        path: 'transfer'
    },
    {
        name: 'receive',
        isSelect: false,
        path: 'receipt'
    },

    {
        name: 'remote',
        isSelect: false,
        path: 'remote',
    },
    {
        name: 'market',
        isSelect: false,
        path: 'market'
    },
]
export const monitorRecaeiptMosaicList = [
    {
        value: 'xem',
        label: 'xem'
    }
]
export const monitorRecaeiptTransferTypeList = [
    {
        name: 'ordinary_transfer',
        isSelect: true,
        disabled: false
    }, {
        name: 'Multisign_transfer',
        isSelect: false,
        disabled: false
    }, {
        name: 'crosschain_transfer',
        isSelect: false,
        disabled: true
    }, {
        name: 'aggregate_transfer',
        isSelect: false,
        disabled: true
    }
]
export const monitorTransferTransferTypeList = [
    {
        name: 'ordinary_transfer',
        isSelect: true,
        disabled: false
    }, {
        name: 'Multisign_transfer',
        isSelect: false,
        disabled: false
    }, {
        name: 'crosschain_transfer',
        isSelect: false,
        disabled: true
    }, {
        name: 'aggregate_transfer',
        isSelect: false,
        disabled: true
    }
]
export const apostilleButtonList = [
    {
        name: 'create_apostille',
        isSelected: true
    }, {
        name: 'audit_apostille',
        isSelected: false
    }, {
        name: 'apostille_history',
        isSelected: false
    }
]

//mosaic
export const mosaicTransactionTypeList = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]
export const mosaicButtonList = [
    {
        name: 'create_mosaic',
        isSelected: true
    }, {
        name: 'mosaic_list',
        isSelected: false
    }
]

//multisig
export const multisigButtonList = [
    {
        name: 'convert',
        isSelected: false
    }, {
        name: 'manage',
        isSelected: false
    }, {
        name: 'map',
        isSelected: true
    },
    // {
    //     name: 'MultisigCosign',
    //     isSelected: false
    // }
]

//namespace
export const subNamespaceTypeList = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]
export const rootNamespaceTypelist = [
    {
        name: 'ordinary_account',
        isSelected: true
    }, {
        name: 'multi_sign_account',
        isSelected: false
    }
]
export const namespaceButtonList = [
    {
        name: 'Create_namespace',
        isSelected: true
    }, {
        name: 'Create_subNamespace',
        isSelected: false
    }, {
        name: 'Namespace_list',
        isSelected: false
    }
]
export const serviceSwitchFnList = [
    {
        name: 'mosaic',
        to: '/mosaic',
        iconDefault: mosaic1Icon,
        iconActive: mosaic2Icon,
        introduce: 'NEM_Mosaic_is_a_smart_asset_with_rich_attributes_and_features_To_create_a_mosaic_you_must_provision_the_root_namespace_for_your_account',
        active: false
    },
    {
        name: 'multi_signature',
        to: '/multisigApi',
        iconDefault: multisign1Icon,
        iconActive: multisign2Icon,
        introduce: 'provides_an_editable_chain_on_protocol_in_a_multi_signature_account_which_is_the_best_way_to_store_funds_and_achieve_a_common_account',
        active: true
    }, {
        name: 'namespace',
        to: '/namespace',
        iconDefault: namespace1Icon,
        iconActive: namespace2Icon,
        introduce: 'a_namespace_is_a_domain_name_that_stores_mosaics_Each_namespace_is_unique_within_a_blockchain_and_mosaics_can_be_defined_and_authenticated_on_a_multi_level_sub_namespace',
        active: false
    },
    {
        name: 'apostille',
        to: '/apostille',
        iconDefault: apostille1Icon,
        iconActive: apostille2Icon,
        introduce: 'provides_an_editable_chain_on_protocol_in_a_multi_signature_account_which_is_the_best_way_to_store_funds_and_achieve_a_common_account',
        active: false
    },
]

//setting
export const settingNetworkPointList = [
    {
        name: 'NEM_PRIVATE_1',
        rpcUrl: 'Https://12.10.0.10',
        chainId: 1,
        symbol: 'XEM',
        exploerUrl: 'https://nodeexplorer.com/',
        isSelected: true
    }, {
        name: 'NEM_MAIN',
        rpcUrl: 'Https://12.10.0.10',
        chainId: 2,
        symbol: 'XEM',
        exploerUrl: 'https://nodeexplorer.com/',
        isSelected: false
    },
    {
        name: 'NEM_MAIN_NET',
        rpcUrl: 'Https://12.10.0.10',
        chainId: 2,
        symbol: 'XEM',
        exploerUrl: 'https://nodeexplorer.com/',
        isSelected: false
    }
]
export const settingNetworkColorList = ['green_point', 'pink_point', 'purple_point', 'yellow_point']
export const settingPanelNavigationBar = [
    {
        title: 'general_settings',
        navigatorTitle: 'general_settings',
        name: 'settingNormal',
        isSelected: true
    }, {
        navigatorTitle: 'change_password',
        title: 'lock_password',
        name: 'settingLock',
        isSelected: false
    }, {
        navigatorTitle: 'network_settings',
        title: 'network_settings',
        name: 'settingNetwork',
        isSelected: false,
        disabled: true
    }, {
        navigatorTitle: 'about',
        title: 'about',
        name: 'settingAbout',
        isSelected: false
    }
]
export const timeZoneListData = (() => {
    let list = [
        {
            value: 0,
            label: 'GMT'
        },
    ]
    for (let i = 1; i <= 12; i++) {
        list.push({
            value: i,
            label: 'GMT+' + i
        })
        list.push({
            value: -i,
            label: 'GMT-' + i
        })
    }
    list = list.sort()
    return list
})()
//wallet
export const walletFnNavList = [
    { name: 'create', to: '/walletCreate', active: true },
    { name: 'import', to: '/walletImportKeystore', active: false },
]
export const walletImportNavagatorList = [
    {
        title: 'mnemonic',
        name: 'walletImportMnemonic',
        isSelected: true
    }, {
        title: 'privatekey',
        name: 'walletImportPrivatekey',
        isSelected: false
    }, {
        title: 'keystore',
        name: 'walletImportKeystore',
        isSelected: false
    }
]
export const importKeystoreDefault = {
    walletName: 'keystore-wallet',
    networkType: NetworkType.MIJIN_TEST,
    keystoreStr: 'eyJuYW1lIjoiMzIxMzIxMzEyIiwiY2lwaGVydGV4dCI6eyJ3b3JkcyI6Wzg1NDY0MjkyNSwyMDMwOTQ2OTg5LC0xMTYzOTM0MCwxMjYzMTEzOTQyLDE1OTgyNzY0MjMsLTEzNDMwODUyMDgsLTEwMTM2MDI4NzAsMTIxNDI5ODg2LC0xNTkyNDUzNzg0LDE1OTU5OTEwMDYsLTEwMzkxMTQ1NjQsNzI4MjgxODc3XSwic2lnQnl0ZXMiOjQ4fSwiaXYiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOlsxODAsMTk2LDIyNywxNjYsMTc4LDIzNSw4OSwxNDUsMjI4LDY2LDExMiw2MSwyNCwyNSwzOCwxNjZdfSwibmV0d29ya1R5cGUiOjE0NCwiYWRkcmVzcyI6IlNBVUE1SlFSUDJGQk5QQU8zRlFJUlRKUlM1UEhKVjdDTFpTT1lMS0YiLCJwdWJsaWNLZXkiOiI2MjMyM0JDMkQwNzVDRDgxNUU0QTcxQjE4NzQ3MDhDOEVBQUVGRUMyOTVDNkYxQTgyRTZCOTE4MjJCQjJEREJCIiwibW5lbW9uaWNFbkNvZGVPYmoiOnt9fQ==',
    walletPassword: '',
    walletPasswordAgain: '',
    keystorePassword: '111111'
}

