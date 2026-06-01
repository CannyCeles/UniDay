import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'https://uni-day.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT ?? 3000);
  } else {
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp;
  }
}

export const handler = async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
};