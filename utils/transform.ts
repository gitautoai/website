import crypto from 'crypto';

export function stringify(object: any) {
  return JSON.stringify(object, (_, value) =>
    typeof value === "bigint" ? value.toString() + "n" : value
  );
}

export function encrypt(text: string): string {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${key.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const algorithm = 'aes-256-cbc';
  const [ivHex, keyHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = Buffer.from(keyHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
