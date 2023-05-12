import express from 'express';

const router = express.Router();

router.get('/auth', async (req, res) => {
    res.send('helopw')
})

export default router;