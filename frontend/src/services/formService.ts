import { ApiClient } from '../api/apiClient';
import {  FormResponse } from '../types/form';
export interface IFormService {
submit(form: FormData): Promise<FormResponse>;
}
export class FormService implements IFormService {
private api: ApiClient;
constructor(api: ApiClient) {
this.api = api;
}
async submit(form: FormData): Promise<FormResponse> {
const res = await this.api.instance.post('/api/forms', form, {
headers: { 'Content-Type': 'multipart/form-data' },
});
return res.data as FormResponse;
}
}
export const formService = new FormService(new
ApiClient(import.meta.env.VITE_API_URL ?? 'http://localhost:5000'));
