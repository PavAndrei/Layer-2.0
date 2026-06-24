import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
};

export default getEnv;
