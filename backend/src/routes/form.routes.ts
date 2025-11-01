import { Router } from 'express';
import { upload } from '../utils/multer';
import { FormController } from '../controllers/form.controllers';
import { FormService } from '../services/form.services';
import { FormRepository } from '../models/repositories/form.repositories';
const repo = new FormRepository();
const service = new FormService(repo);
const controller = new FormController(service);
const router = Router();
// POST /api/forms (multipart form-data)
router.post('/', upload.array('files', 5), (req, res) => controller.submit(req, res));
router.get('/:id', (req, res) => controller.get(req, res));
export default router;