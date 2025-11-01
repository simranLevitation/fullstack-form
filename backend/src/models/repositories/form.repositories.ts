import { FormModel, IForm } from "../form.model";
export interface IFormRepository {
  save(form: Partial<IForm>): Promise<IForm>;
    findById(id: string): Promise<IForm | null>;
     findAll(): Promise<IForm[]>;
}
export class FormRepository implements IFormRepository {
  async save(form: Partial<IForm>): Promise<IForm> {
    const created = new FormModel(form);
    return created.save();
  }
  async findById(id: string): Promise<IForm | null> {
    return FormModel.findById(id).exec();
  }
  async findAll(): Promise<IForm[]> {
    return FormModel.find().sort({ createdAt: -1 }).exec();
  }
}
