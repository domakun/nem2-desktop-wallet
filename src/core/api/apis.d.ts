
export declare namespace api {
  interface Market {
    kline: (params: {
      symbol: string
      period: string
      size: string
    }) => Promise<{
      rst: any
    }>

    detail: (params: {
      symbol: string
    }) => Promise<{
      rst: any
    }>

    trade: (params: {
      symbol: string
      size: string
    }) => Promise<{
      rst: any
    }>
  }
}
