import { Router } from 'express';
import multer from 'multer';
import { storage } from '../services/storage.service';
import { ucan } from '../services/ucan.service';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file' });

        const cid = await storage.upload(req.file.buffer);
        const delegation = await ucan.createDelegation(req.body.userDID, 24);

        res.json({ cid, fileName: req.file.originalname, delegation });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
