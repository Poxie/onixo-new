import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const API_ENDPOINT = 'https://discord.com/api/v10'
router.post('/auth', async (req, res) => {
    const code = req.body.code;
    if(!code) return res.status(400).send('Code is required');

    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('redirect_uri', process.env.REDIRECT_URI);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
        method: 'POST',
        body: params,
        headers
    })
    const userData = await response.json();

    res.send(userData);
});

export default router;