import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
  NODE_ENV: "development" | "production";
  PORT: string;
  DB_URL: string;
}

const loadEnvVariables = (): IEnvConfig => {
  const requiredEnvVariables: string[] = ["NODE_ENV", "PORT", "DB_URL"];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
  };
};

export const envVars = loadEnvVariables();
