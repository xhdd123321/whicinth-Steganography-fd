import {
  IDecodeDocRespData,
  IDecodeImageRespData,
  IEncodeDocRespData,
  IEncodeImageRespData,
  IStegApi,
} from './steg_types'
import http from '@/service/http'

const stegApi: IStegApi = {
  encodeImage(params) {
    return http.post<IEncodeImageRespData>('steg/encode_image', params)
  },
  decodeImage(params) {
    return http.post<IDecodeImageRespData>('steg/encode_image', params)
  },
  encodeDoc(params) {
    return http.post<IEncodeDocRespData>('steg/encode_image', params)
  },
  decodeDoc(params) {
    return http.post<IDecodeDocRespData>('steg/encode_image', params)
  },
}

export default stegApi
