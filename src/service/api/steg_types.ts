import { ResType } from "@/service/http";

export interface IEncodeImageRespData {
  carrier_file: string;
  data_file: string;
  result_file: string;
  url: string;
  err_msg?: string;
}

export interface IDecodeImageRespData {
  carrier_file: string;
  result_file: string;
  url: string;
  err_msg?: string;
}

export interface IEncodeDocRespData {
  carrier_file: string;
  data_doc: string;
  result_file: string;
  url: string;
  err_msg?: string;
}

export interface IDecodeDocRespData {
  carrier_file: string;
  result_doc: string;
  err_msg?: string;
}

export interface IDecodeIntelligentRespData {
  carrier_file: string;
  result_doc?: string;
  result_file?: string;
  url?: string;
  err_msg?: string;
}

interface input {
  size: number;
  type: string;
}
interface output {
  size: number;
  type: string;
  width: number;
  height: number;
  ratio: number;
  url: string;
}
export interface ICompressRespData {
  input: input;
  output: output;
  err_msg?: string;
}

export interface IStegApi {
  encodeImage: (
    params: FormData,
    isShare: boolean
  ) => Promise<ResType<IEncodeImageRespData>>;
  decodeImage: (params: FormData) => Promise<ResType<IDecodeImageRespData>>;
  encodeDoc: (
    params: FormData,
    isShare: boolean
  ) => Promise<ResType<IEncodeDocRespData>>;
  decodeDoc: (params: FormData) => Promise<ResType<IDecodeDocRespData>>;
  decodeIntelligent: (
    params: FormData
  ) => Promise<ResType<IDecodeIntelligentRespData>>;
  compressImage: (params: FormData) => Promise<ResType<ICompressRespData>>;
}
