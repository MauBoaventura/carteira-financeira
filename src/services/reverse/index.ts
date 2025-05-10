/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { ReverseResponse } from "./types";
import { axiosApi } from "..";

const baseUrlReverse = "/reverse";

export class ReverseService {
  static async ping() {
    const url = baseUrlReverse;
    return axiosApi.get(url);
  }
  static async getAll(): Promise<AxiosResponse<ReverseResponse[]>> {
    const url = baseUrlReverse;
    return axiosApi.get(url);
  }
}
