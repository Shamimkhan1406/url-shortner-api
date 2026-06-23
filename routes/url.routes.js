import express from 'express';
import { error } from 'node:console';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { authMiddleware, ensureAuthenticated } from '../middleware/auth.middleware.js';
import { db } from '../db/index.js';
import { urlsTable } from '../models/index.js';
import { nanoid } from 'nanoid';
import { insertUrl } from '../services/user.service.js';
import { eq } from "drizzle-orm";

const router = express.Router();

router.post('/shorten', authMiddleware, async (req, res) => {
    try {
        const validationResult =
            await shortenPostRequestBodySchema.safeParseAsync(req.body);

        if (validationResult.error) {
            return res.status(400).json({
                error: validationResult.error.format(),
            });
        }

        const { url, code } = validationResult.data;

        const result = await insertUrl(req.user.id, url, code);

        return res.status(201).json(result);

    } catch (error) {
        console.error(error);
        console.error(error.cause);

        return res.status(500).json({
            message: error.message,
            cause: error.cause,
        });
    }
});

router.get('/codes',authMiddleware, async(req,res)=>{
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, req.user.id));
    return res.json({codes});
});

router.get('/:shortCode', async (req, res) => {
    const shortCode = req.params.shortCode;
    const [result] = await db.select({
        targetUrl: urlsTable.targetUrl,
    }).from(urlsTable).where(eq(urlsTable.shortCode, shortCode));
    if (!result) {
        return res.status(404).json({
            error: 'Short code not found',
        });
    }
    return res.redirect(result.targetUrl);
});

export default router;