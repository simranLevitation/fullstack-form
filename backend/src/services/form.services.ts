import { IFormRepository } from "../models/repositories/form.repositories";
import { IForm, IUploadedFile } from "../models/form.model";
export interface FormDTO {
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
}
export interface IFormService {
  create(form: FormDTO): Promise<IForm>;
  getById(id: string): Promise<IForm | null>;
  getAll(): Promise<IForm[]>;
}
export class FormService implements IFormService {
  private readonly repository: IFormRepository;
  constructor(repository: IFormRepository) {
    this.repository = repository;
  }
  async create(form: FormDTO): Promise<IForm> {
 
    if (!form.firstName || !form.lastName || !form.email) {
      throw new Error("Missing required personal fields");
    }
    return this.repository.save(form as Partial<IForm>);
  }
  async getById(id: string): Promise<IForm | null> {
    return this.repository.findById(id);
  }
  async getAll(): Promise<IForm[]> {
    return this.repository.findAll();
  }
}
