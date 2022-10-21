import http from "@/service/http";
import { IDriftApi } from "@/service/api/drift_types";

const driftApi: IDriftApi = {
  receiveDrift() {
    return http.get<any>("drift/receive");
  },
};

export default driftApi;
