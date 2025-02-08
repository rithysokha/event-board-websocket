import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = randomBytes(32);
const iv = randomBytes(16);

export const encryptText = (text: string) => {
  const cipher = createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
};

export const decryptText = (encryptedData: string, ivHex: string) => {
  const decipher = createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};
