import http from "@/service/http";
import { ISysApi } from "@/service/api/sys_types";

const sysApi: ISysApi = {
  getApiStatistic() {
    return http.get<any>("sys/api_statistic");
  },
  getSysMonitor() {
    return http.get<any>("sys/monitor");
  },
};

export default sysApi;
