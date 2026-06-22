import express from 'express';
import { db } from '../db/index.js';
import { usersTable } from '../models/index.js';
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js';
import { hashPassword } from '../utils/hash.js';
import { findUserByEmail, createUser } from '../services/user.service.js';
import { createUserToken } from '../utils/token.js';

const router = express.Router();

// signup route
router.post('/signup',async (req, res) => {
    // get the user data from the request body
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);
    // validate the user data using zod above
    if (validationResult.error) {
        return res.status(400).json({
            error: validationResult.error.format(),
        });

    }

    const { firstName, lastName, email, password } = validationResult.data;
    
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const { salt, hashedPassword } = hashPassword(password);

    // create the user
    const user = await createUser(firstName, lastName, email, salt, hashedPassword);

    return res.status(201).json({
        data: {
            userId: user.id,
        }
    })

});

router.post('/login', async (req, res)=> {
    const validation = await loginPostRequestBodySchema.safeParseAsync(req.body);

    if (validation.error) {
        return res.status(400).json({
            error: validation.error.format(),
        })
    }
    const { email, password } = validation.data;

    const user = await findUserByEmail(email);

    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password',
        })
    }
    const { hashedPassword } = hashPassword(password, user.salt);

    if (hashedPassword !== user.password) {
        return res.status(400).json({
            message: 'Invalid password',
        })
    }

    const token = await createUserToken({ id: user.id });
    return res.json({ token });
})

export default router;