/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { axiosApi } from "..";
import { UserProps, UserResponse } from "./types";

const baseUrlUser = "/user";

export class UserService {
  static async ping() {
    const url = baseUrlUser;
    return axiosApi.get(url);
  }
  static async getAll(): Promise<AxiosResponse<UserResponse[]>> {
    const url = baseUrlUser;
    return axiosApi.get(url);
  }
  static async getById( prop: UserProps): Promise<AxiosResponse<UserResponse>> {
    const url = baseUrlUser + `/${prop.id}`;
    return axiosApi.get(url);
  }
}
