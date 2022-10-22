import { IStegApi } from "./steg_types";
import http from "@/service/http";

const stegApi: IStegApi = {
  encodeImage(params, isShare) {
    return http.upload<any>("steg/encode_image?share=" + isShare, params);
  },
  decodeImage(params) {
    return http.upload<any>("steg/decode_image", params);
  },
  encodeDoc(params, isShare) {
    return http.upload<any>("steg/encode_doc?share=" + isShare, params);
  },
  decodeDoc(params) {
    return http.upload<any>("steg/decode_doc", params);
  },
  decodeIntelligent(params) {
    return http.upload<any>("steg/decode_intelligent", params);
  },
  compressImage(params) {
    return http.upload<any>("pre/compress", params);
  },
};

export default stegApi;
