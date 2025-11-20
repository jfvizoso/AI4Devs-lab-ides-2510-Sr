import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadCV } from '../middleware/upload.middleware';
import {
  createCandidateController,
  getCandidatesController,
  getCandidateByIdController,
  updateCandidateController,
  deleteCandidateController,
  uploadCVController,
  downloadCVController
} from '../controllers/candidates.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.post('/', createCandidateController);
router.get('/', getCandidatesController);
router.get('/:id', getCandidateByIdController);
router.put('/:id', updateCandidateController);
router.delete('/:id', deleteCandidateController);
router.post('/:id/cv', uploadCV, uploadCVController);
router.get('/:id/cv', downloadCVController);

export default router;

