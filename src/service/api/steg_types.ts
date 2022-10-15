export interface IEncodeImageParams {
  carrierFile: File
  dataFile: File
}

export interface IDecodeImageParams {
  carrierFile: File
}

export interface IEncodeDocParams {
  carrierFile: File
  data_doc: string
}

export interface IDecodeDocParams {
  carrierFile: File
}

export interface IEncodeImageRespData {
  carrier_file: string
  data_file: string
  result_file: string
  url: string
}

export interface IDecodeImageRespData {
  carrier_file: string
  result_file: string
  url: string
}

export interface IEncodeDocRespData {
  carrier_file: string
  data_doc: string
  result_file: string
  url: string
}

export interface IDecodeDocRespData {
  carrier_file: string
  result_doc: string
}

export interface IStegApi {
  encodeImage: (params: IEncodeImageParams) => Promise<any>
  decodeImage: (params: IDecodeImageParams) => Promise<any>
  encodeDoc: (params: IEncodeDocParams) => Promise<any>
  decodeDoc: (params: IDecodeDocParams) => Promise<any>
}
