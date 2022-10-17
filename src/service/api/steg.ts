import { IStegApi } from './steg_types'
import http from '@/service/http'

const stegApi: IStegApi = {
  encodeImage(params) {
    return http.upload<any>('steg/encode_image', params)
  },
  decodeImage(params) {
    return http.upload<any>('steg/decode_image', params)
  },
  encodeDoc(params) {
    return http.upload<any>('steg/encode_doc', params)
  },
  decodeDoc(params) {
    return http.upload<any>('steg/decode_doc', params)
  },
  decodeIntelligent(params) {
    return http.upload<any>('steg/decode_intelligent', params)
  },
}

export default stegApi
