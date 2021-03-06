import {BlockInfo, UInt64, PublicAccount, NetworkType} from 'nem2-sdk'
import {extractBeneficiary} from 'nem2-sdk/dist/src/infrastructure/transaction/CreateTransactionFromDTO'
const blockDTO = {
  meta: {
    hash: 'C5D818D392E4072548294B0915AA9F8383A98890613F0418053DAD64EE868F64',
    generationHash:
      'A8DDAD86EC2BD52E40139775D5EEBC458F1A005DFDA6876F9CAD6E166B6C47D0',
    totalFee: '0',
    stateHashSubCacheMerkleRoots: [
      '869ACEA2E5BD2C98D3B72E75237E3FC2A1116005D97F71D2E1CB99AE430F9AC9',
      '82CC31E6C4D2C49232CCC9ACA4DE92A89E6789C6CF4A9632DEB0D0F33A7944A1',
      'DDB48A93F687FB0F88632A91EBE24BF55C2CC5A319AF267CCF9274A4EBCAE5A4',
      '6C373DBD113E19C22780DF8EADF50B69F527A5EAFF11151890CDC448DCDA5087',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '45D8F41A2169FB6E542007547223A3FE229FEB065A7905D37682DD71DFBFC14C',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000000',
    ],
    numTransactions: 0,
    numStatements: 1,
  },
  block: {
    signature:
      'A1D22C702BED9D6B8555C093EDA027641B0CB064118E2AC3A7FB6C4DD28CB0D305E5ACEF276536FE362E72D4A642194A3BC43B2D5FC397A594F26263766C950D',
    signerPublicKey:
      'B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900',
    version: 1,
    network: 144,
    type: 33091,
    height: '29248',
    timestamp: '116060537287',
    difficulty: '56409509709966',
    feeMultiplier: 0,
    previousBlockHash:
      '285816E6FD6A963792169C8F8A1A6D67C4398AFC3C3EFB291A2A9A1273F4F83D',
    transactionsHash:
      '0000000000000000000000000000000000000000000000000000000000000000',
    receiptsHash:
      'F8BA92CF31AA54B750EC4EB879BDAB4BEF565AA1653906D53CF2D5ED5BBB5513',
    stateHash:
      '4A920825ED28F692A2482A46E9FC697DFA4AD62AB1102A9D03A8B67FEBBADD1B',
    beneficiaryPublicKey:
      'B70BBCE88F6471FF1E7D47E03ECAA3AD946C8AC4CF2A812E37853D6079563900',
  },
}

export const block29248 = new BlockInfo(
  blockDTO.meta.hash,
  blockDTO.meta.generationHash,
  UInt64.fromNumericString(blockDTO.meta.totalFee),
  blockDTO.meta.numTransactions,
  blockDTO.block.signature,
  PublicAccount.createFromPublicKey(
    blockDTO.block.signerPublicKey,
    NetworkType.TEST_NET,
  ),
  NetworkType.TEST_NET,
  parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version
  blockDTO.block.type,
  UInt64.fromNumericString(blockDTO.block.height),
  UInt64.fromNumericString(blockDTO.block.timestamp),
  UInt64.fromNumericString(blockDTO.block.difficulty),
  blockDTO.block.feeMultiplier,
  blockDTO.block.previousBlockHash,
  blockDTO.block.transactionsHash,
  blockDTO.block.receiptsHash,
  blockDTO.block.stateHash,
  extractBeneficiary(blockDTO, NetworkType.TEST_NET),
)
