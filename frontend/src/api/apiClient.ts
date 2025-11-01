import axios, { AxiosInstance } from 'axios';
export class ApiClient {
private client: AxiosInstance;

constructor(baseURL: string) {
this.client = axios.create({ baseURL });
}
get instance(): AxiosInstance {
return this.client;
}
}
export const apiClient = new ApiClient(import.meta.env.VITE_API_URL ??
'http://localhost:5000');
