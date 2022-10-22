import { ResType } from "@/service/http";

export interface IApiStatisticData {
  decode_intelligent_num: number;
  encode_image_num: number;
  encode_doc_num: number;
  decode_image_num: number;
  decode_doc_num: number;
  drift_count: number;
  err_msg?: string;
}

export interface ISysMonitorData {
  cpu_cores: number;
  cpu_percent: number;
  mem_total: number;
  mem_used: number;
  mem_percent: number;
  err_msg?: string;
}

export interface ISysApi {
  getApiStatistic: () => Promise<ResType<IApiStatisticData>>;
  getSysMonitor: () => Promise<ResType<ISysMonitorData>>;
}
