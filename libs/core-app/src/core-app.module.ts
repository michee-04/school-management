import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig, validateConfig } from './config';
import { MailService } from './services/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateConfig,
    }),
    MongooseModule.forRootAsync({
      connectionName: MAIN_DATABASE_CONNECTION_NAME,
      inject: [ConfigService],
      useFactory: async (config: ConfigService<AppConfig, true>) => ({
        uri: config.get('GLOBAL_MAIN_DATABASE_URI', { infer: true }),
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class LibCoreAppModule {}
