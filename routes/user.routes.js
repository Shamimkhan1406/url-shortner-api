import express from 'express';
import { db } from '../db/index.js';
import { usersTable } from '../models/index.js';
import { signupPostRequestBodySchema } from '../validation/request.validation.js';
import { hashPassword } from '../utils/hash.js';
import { findUserByEmail, createUser } from '../services/user.service.js';

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

})

export default router;