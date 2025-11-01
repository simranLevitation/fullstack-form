export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
export interface UploadedFile {
  originalname: string;
  filename: string;
  path: string;
  size: number;
}
export interface FormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: Address;
  files: UploadedFile[];
  filesRaw?: File[];
}
export interface FormResponse {
  id: string;
}
