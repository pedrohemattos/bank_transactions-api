import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333)
});

const envValidation = envSchema.safeParse(process.env);

if(envValidation.success === false) {
    console.error('Invalid environment variables ;(', envValidation.error.format());
    throw new Error('Invalid environment variables ;(');
}

export const env = envValidation;