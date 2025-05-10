/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { TranferProps, TranferResponse } from "./types";
import { axiosApi } from "..";

const baseUrlTransfer = "/transfer";

export class TransferService {
  static async ping() {
    const url = baseUrlTransfer;
    return axiosApi.get(url);
  }
  static async tranfer(data: TranferProps): Promise<AxiosResponse<TranferResponse>> {
    const url = baseUrlTransfer;
    return axiosApi.post(url, data);
  }
}
