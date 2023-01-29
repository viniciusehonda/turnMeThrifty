import express from 'express'
import i18next from 'i18next';

const router = express.Router();

router.get('/translations/:lng', (req, res) => {
    const translations = i18next.services.resourceStore.data[req.params.lng];
    res.json(translations);
})

export default router;