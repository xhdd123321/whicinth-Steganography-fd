import { ResType } from '@/service/http'

export interface IDriftData {
  url: string
  err_msg?: string
}

export interface IDriftApi {
  receiveDrift: () => Promise<ResType<IDriftData>>
}
