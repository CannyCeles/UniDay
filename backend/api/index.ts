import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

let cachedServer: any;

async function bootstrap() {
  console.log('[Bootstrap] Starting NestJS bootstrap process...');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = ['https://uni-day.vercel.app', 'http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  if (process.env.VERCEL) {
    app.useStaticAssets(require('os').tmpdir(), {
      prefix: '/uploads/profiles/',
    });
  }

  await app.init();
  console.log('[Bootstrap] NestJS application initialized successfully.');
  return app.getHttpAdapter().getInstance();
}

export default async (req: any, res: any) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://uni-day.vercel.app', 'http://localhost:5173'];

  console.log(`[Request] Incoming ${req.method} request to URL: ${req.url}`);

  if (req.method === 'OPTIONS') {
    console.log('[Request] Handling preflight OPTIONS request instantly...');
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://uni-day.vercel.app');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.status(200).end();
    return;
  }

  try {
    if (!cachedServer) {
      cachedServer = await bootstrap();
    }
    return cachedServer(req, res);
  } catch (error: any) {
    console.error('[Error] NestJS Serverless Handler crashed:', error);
    res.status(500).json({
      message: 'UniDay Backend Serverless Handler crashed during execution.',
      error: error.message || error.toString(),
      stack: error.stack,
      hint: 'Check Vercel real-time logs or verify package dependencies like Canvas/Prisma.'
    });
  }
};
