import { AppConfig } from './type';

export const config = (): AppConfig => ({
  NODE_ENV: process.env.NODE_ENV,

  APP_NAME: process.env.APP_NAME,
  APP_PORT: parseInt(process.env.APP_PORT, 10) || 3000,

  GLOBAL_MAIN_DATABASE_URI: process.env.GLOBAL_MAIN_DATABASE_URI,
});
