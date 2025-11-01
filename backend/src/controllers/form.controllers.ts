// backend/src/controllers/form.controller.ts
import { Request, Response } from 'express';
import { IFormService } from '../services/form.services';

type IncomingJsonFile = {
  originalname: string;
  filename?: string;
  data: string; // base64 or data:url
  mimeType?: string;
  size?: number;
  path?: string;
};

type NormalizedFile = {
  originalname: string;
  filename: string;
  data: string; // base64 (no data: prefix)
  mimeType: string;
  size: number;
  path?: string;
};

type AddressDto = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

type CreateDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: AddressDto;
  files: NormalizedFile[];
};

export class FormController {
  private readonly service: IFormService;

  constructor(service: IFormService) {
    this.service = service;
  }

  // Accept either body.address (JSON) or top-level fields (form-data)
  private normalizeAddress(body: Record<string, unknown>): AddressDto {
    // prefer nested address object if present
    const nested = body?.address as Record<string, unknown> | undefined;
    if (nested && typeof nested === 'object') {
      return {
        line1: String(nested.line1 ?? ''),
        line2: nested.line2 ? String(nested.line2) : undefined,
        city: String(nested.city ?? ''),
        state: String(nested.state ?? ''),
        country: String(nested.country ?? ''),
        zip: String(nested.zip ?? ''),
      };
    }

    // fallback to top-level fields
    return {
      line1: String(body?.line1 ?? ''),
      line2: body?.line2 ? String(body.line2) : undefined,
      city: String(body?.city ?? ''),
      state: String(body?.state ?? ''),
      country: String(body?.country ?? ''),
      zip: String(body?.zip ?? ''),
    };
  }

  // Ensure `data` is base64 without data:... prefix
  private stripDataUrl(value: string): string {
    if (!value) return '';
    const comma = value.indexOf(',');
    if (comma === -1) return value;
    return value.slice(comma + 1);
  }

  async submit(req: Request, res: Response): Promise<void> {
    try {
      const multerFiles = (req.files as Express.Multer.File[] | undefined) ?? [];
      const jsonFiles = Array.isArray(req.body?.files)
        ? (req.body.files as IncomingJsonFile[])
        : [];

      const address = this.normalizeAddress((req.body ?? {}) as Record<string, unknown>);

      const files: NormalizedFile[] = [];

      // Priority: multer memory files (actual binary buffers)
      if (multerFiles.length > 0) {
        for (const f of multerFiles) {
          const buffer = f.buffer ?? Buffer.from('');
          const base64 = buffer.toString('base64');
          files.push({
            originalname: f.originalname,
            filename: f.originalname,
            data: base64,
            mimeType: f.mimetype ?? 'application/octet-stream',
            size: f.size ?? buffer.length,
            path: (f as unknown as Record<string, unknown>).path as string | undefined,
          });
        }
      } else if (jsonFiles.length > 0) {
        // Client already sent files as base64 in JSON
        for (const jf of jsonFiles) {
          const originalname = String(jf.originalname ?? jf.filename ?? 'file');

          // safe fallback: prefer jf.mimeType, else try to read "mimetype" key if present
          const maybeOtherMime = (jf as unknown as Record<string, unknown>)['mimetype'];
          const mimeType = String(jf.mimeType ?? maybeOtherMime ?? 'application/octet-stream');

          const size = Number(jf.size ?? 0);
          const rawData = String(jf.data ?? '');
          const base64 = this.stripDataUrl(rawData);

          files.push({
            originalname,
            filename: originalname,
            data: base64,
            mimeType,
            size,
            path: jf.path,
          });
        }
      }

      const dto: CreateDto = {
        firstName: String(req.body?.firstName ?? ''),
        lastName: String(req.body?.lastName ?? ''),
        email: String(req.body?.email ?? ''),
        phone: req.body?.phone ? String(req.body.phone) : undefined,
        address,
        files,
      };

      // Server-side validation with friendly messages
      if (!dto.firstName || !dto.lastName || !dto.email) {
        res.status(400).json({ message: 'Missing required personal fields: firstName/lastName/email' });
        return;
      }
      const { line1, city, state, country, zip } = dto.address;
      if (!line1 || !city || !state || !country || !zip) {
        res.status(400).json({ message: 'Missing required address fields: line1, city, state, country, zip' });
        return;
      }

      const created = await this.service.create(dto);
      res.status(201).json({ id: created._id });
    } catch (err) {
      console.error('FormController.submit error:', err);
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const record = await this.service.getById(id);
      if (!record) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(record);
    } catch (err) {
      console.error('FormController.get error:', err);
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
