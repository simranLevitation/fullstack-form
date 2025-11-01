import { Router } from 'express';
import { upload } from '../utils/multer';
import { FormController } from '../controllers/form.controllers';
import { FormService } from '../services/form.services';
import { FormRepository } from '../models/repositories/form.repositories';
const repo = new FormRepository();
const service = new FormService(repo);
const controller = new FormController(service);
const router = Router();

router.post('/', upload.array('files', 5), (req, res) => controller.submit(req, res));
router.get('/:id', (req, res) => controller.get(req, res));
router.get("/", (req, res) => controller.getAll(req, res));

export default router;