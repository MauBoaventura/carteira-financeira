/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { LoginProps, RegisterProps, User, LoginResponse } from "./types";
import { axiosApi } from "..";

const baseUrlVeiculo = "/auth";

export class AuthService {
  static async ping() {
    const url = baseUrlVeiculo;
    return axiosApi.get(url);
  }
  static async login(data: LoginProps): Promise<AxiosResponse<LoginResponse>> {
    const url = baseUrlVeiculo + "/login";
    return axiosApi.post(url, data);
  }
  static async register(
    data: RegisterProps
  ): Promise<AxiosResponse<User | any>> {
    const url = `${baseUrlVeiculo}/register`;
    return axiosApi.post(url, data);
  }
}
