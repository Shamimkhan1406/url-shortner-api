import { db } from "../db/index.js";
import { usersTable,urlsTable } from "../models/index.js";
import { eq } from "drizzle-orm";

export async function findUserByEmail(email) {
    const [existingUser] = await db.select({
        id: usersTable.id,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
        email: usersTable.email,
        salt: usersTable.salt,
        password: usersTable.password,
    }).from(usersTable).where(eq(usersTable.email, email));
    return existingUser;
};

export async function createUser(firstName, lastName, email, salt, hashedPassword) {
    const [user] = await db.insert(usersTable).values({
        firstname: firstName,
        lastname: lastName,
        email: email,
        salt: salt,
        password: hashedPassword,
    }).returning({
        id: usersTable.id,
    });
    return user;
};

export async function insertUrl(userId, targetUrl, shortCode) {
    const [result] = await db.insert(urlsTable).values({
            shortCode: shortCode || nanoid(8),
            targetUrl,
            userId,
        }).returning({
            id: urlsTable.id,
            shortCode: urlsTable.shortCode,
            targetUrl: urlsTable.targetUrl,
        });
    return result;
}