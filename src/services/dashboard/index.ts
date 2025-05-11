/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { DashboardResponse } from "./types";
import { axiosApi } from "..";

const baseUrlDashboard = "/dashboard";

export class DashboardService {
  static async ping() {
    const url = baseUrlDashboard;
    return axiosApi.get(url);
  }
  static async dashboard(type: string = "resume"): Promise<AxiosResponse<DashboardResponse>> {
    const url = `${baseUrlDashboard}?type=${type}`;
    return axiosApi.get(url);
  }
  static async getRecentTransactions() {
    const url = `${baseUrlDashboard}?type=recent-transactions`;
    return axiosApi.get(url);
  }
}
