import jwt from 'jsonwebtoken';
import { userTokenSchema } from '../validation/token.validation.js';
import 'dotenv/config';

const secretKey = process.env.JWT_SECRET;

export async function createUserToken(payload) {
    const validationResult = await userTokenSchema.safeParse(payload);
    if (validationResult.error) {
        throw new Error('Invalid payload for user token,' + validationResult.error.message);
    }
    const validPayload = validationResult.data;
    return jwt.sign(validPayload, secretKey, { expiresIn: '1h' });
}

export function verifyUserToken(token) {
    try {
        const payload = jwt.verify(token, secretKey);
        return payload;
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
}