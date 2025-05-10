/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { DepositProps, DepositResponse } from "./types";
import { axiosApi } from "..";

const baseUrlDeposit = "/deposit";

export class DepositService {
  static async ping() {
    const url = baseUrlDeposit;
    return axiosApi.get(url);
  }
  static async deposit(data: DepositProps): Promise<AxiosResponse<DepositResponse>> {
    const url = baseUrlDeposit;
    return axiosApi.post(url, data);
  }
}
