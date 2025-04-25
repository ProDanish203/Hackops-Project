import * as crypto from 'crypto';

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
};

export const verifyPassword = ({
  password,
  salt,
  hash,
}: {
  password: string;
  salt: string;
  hash: string;
}) => {
  const candidateHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === candidateHash;
};
