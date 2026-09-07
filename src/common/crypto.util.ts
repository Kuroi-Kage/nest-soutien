import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = 'aes-256-gcm';

function getKey(): Buffer {
    const secret = process.env.CONTENT_ENCRYPTION_SECRET ?? 'change-moi-en-production';
    return scryptSync(secret, 'wellbeing-salt', 32);
}

export function encryptContent(plainText: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag()
    return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join('.');

}

export function decryptContent(payload: string): string {
    const [ivB64, authTagB64, dataB64] = payload.split('.');
    const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, 'base64'));
    decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(dataB64, 'base64')),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
}