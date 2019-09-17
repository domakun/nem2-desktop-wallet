export const networkConfig = {
    publicKey: "",
    generationHash: "",
    enableVerifiableState: true,
    enableVerifiableReceipts: true,
    currencyMosaicId: "",
    harvestingMosaicId: "",
    blockGenerationTargetTime: "15s",
    blockTimeSmoothingFactor: 3000,
    importanceGrouping: 39,
    importanceActivityPercentage: 5,
    maxRollbackBlocks: 40,
    maxDifficultyBlocks: 60,
    defaultDynamicFeeMultiplier: 10000,
    maxTransactionLifetime: "24h",
    maxBlockFutureTime: "10s",
    initialCurrencyAtomicUnits: 8998999998,
    maxMosaicAtomicUnits: 9000000000,
    totalChainImportance: 15,
    minHarvesterBalance: 500,
    harvestBeneficiaryPercentage: 10,
    blockPruneInterval: 360,
    maxTransactionsPerBlock: 200000,
    maxTransactionsPerAggregate: 1000,
    maxCosignaturesPerAggregate: 15,
    enableStrictCosignatureCheck: false,
    enableBondedAggregateSupport: true,
    maxBondedTransactionLifetime: "48h",
    lockedFundsPerAggregate: 10,
    maxHashLockDuration: "2d",
    maxSecretLockDuration: "30d",
    minProofSize: 1,
    maxProofSize: 1000,
    maxValueSize: 1024,
    maxMosaicsPerAccount: 10000,
    maxMosaicDuration: "3650d",
    maxMosaicDivisibility: 6,
    mosaicRentalFeeSinkPublicKey: "53E140B5947F104CABC2D6FE8BAEDBC30EF9A0609C717D9613DE593EC2A266D3",
    mosaicRentalFee: 500,
    maxMultisigDepth: 3,
    maxCosignatoriesPerAccount: 10,
    maxCosignedAccountsPerAccount: 5,
    maxNameSize: 64,
    maxChildNamespaces: 500,
    maxNamespaceDepth: 3,
    minNamespaceDuration: "1m",
    maxNamespaceDuration: "365d",
    namespaceGracePeriodDuration: "2m",
    reservedRootNamespaceNames: ["xem", "nem", "user", "account", "org", "com", "biz", "net", "edu", "mil", "gov", "info"],
    namespaceRentalFeeSinkPublicKey: "3E82E1C1E4A75ADAA3CBA8C101C3CD31D9817A2EB966EB3B511FB2ED45B8E262",
    rootNamespaceRentalFeePerBlock: 1000000,
    childNamespaceRentalFee: 100,
    maxAccountRestrictionValues: 512,
    maxMosaicRestrictionValues: 20,
    maxMessageSize: 1024,
}