import axios from 'axios';
import { IFileErrorRes } from "common";

export interface IAxiosErrorRes {
  message: string;
  status?: string;
  data?: IFileErrorRes;
}

const api = axios.create({
  baseURL: 'http://localhost:61001/api',
});


// Response interceptor to return backend errors
api.interceptors.response.use(
  (response) => response,
  (error ): Promise<IAxiosErrorRes> => {
    if (error.response) {
      // Error from backend
      const { status, data } = error.response;
      return Promise.reject({
        message: data?.message || 'Unexpected backend error',
        status,
        data,
      });
    } else if (error.request) {
      // No response
      return Promise.reject({
        message: 'No response from server',
      });
    } else {
      // Other error
      return Promise.reject({
        message: error.message,
      });
    }
  }
);
export default api;
