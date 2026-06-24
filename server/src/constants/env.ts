import getEnv from '../utils/get-env';

export const MONGO_URI = getEnv('MONGO_URI');
export const PORT = getEnv('PORT', '5000');
