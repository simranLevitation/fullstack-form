import { Schema, model, Document } from 'mongoose';
export interface IUploadedFile {
  originalname: string;
  filename: string;
  data: string;
  mimeType: string;
  size: number;
  path?: string;
}
export interface IForm extends Document {
firstName: string;
lastName: string;
email: string;
phone?: string;
address: {
line1: string;
line2?: string;
city: string;
state: string;
country: string;
zip: string;
};
files: IUploadedFile[];
createdAt: Date;
}
const FileSchema = new Schema<IUploadedFile>({
  originalname: { type: String, required: true },
  filename: { type: String, required: true },
  data: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: false },
});
const FormSchema = new Schema<IForm>({
firstName: { type: String, required: true },
lastName: { type: String, required: true },
email: { type: String, required: true },
phone: { type: String },
address: {
line1: { type: String, required: true },
line2: { type: String },
city: { type: String, required: true },
state: { type: String, required: true },
country: { type: String, required: true },
zip: { type: String, required: true },
},
files: { type: [FileSchema], default: [] },
createdAt: { type: Date, default: Date.now },
});
export const FormModel = model<IForm>('Form', FormSchema);