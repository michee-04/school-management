/* eslint-disable prettier/prettier */
import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidateIf,
  validateSync,
} from 'class-validator';
import * as ms from 'ms';

import { Environment, MailerClient } from './type';

export class AppConfig {
  // ================================= GLOBAL
  @IsEnum(Environment)
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_APP_NAME: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_MAIN_DATABASE_URI: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_JOURNAL_DATABASE_URI: string;

  // ================================= API APP
  @IsInt()
  @Min(0)
  @Max(65_535)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  API_APP_PORT: number = 5095;

  // ================================= LIBRAIRIES
  // ------------- User Access Control
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_USER_ACCESS_CONTROL_PASSWORD_VALIDATION_ENABLED: boolean = false;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_DEFAULT_PASSWORD: string;

  @IsEmail()
  LIB_USER_ACCESS_CONTROL_DEFAULT_SUPER_ADMIN_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_DEFAULT_SUPER_ADMIN_PASSWORD: string;

  @IsInt()
  @Min(5)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  LIB_USER_ACCESS_CONTROL_OTP_EXPIRES_IN_MIN: number = 10;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_USER_ACCESS_CONTROL_TOKEN_VALIDATION_ENABLED: boolean = false;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_JWT_ISSUER: string;

  @IsString()
  @IsNotEmpty()
  @Validate(
    (value: ms.StringValue) => {
      const duration = ms(value);
      return typeof duration === 'number' && duration > 0;
    },
    {
      message:
        'LIB_USER_ACCESS_CONTROL_JWT_ACCESS_TOKEN_EXPIRES_IN must be a valid duration string (e.g.,"1d", "1h", "30m", "600s").',
    },
  )
  LIB_USER_ACCESS_CONTROL_JWT_ACCESS_TOKEN_EXPIRES_IN: ms.StringValue;

  @IsString()
  @IsNotEmpty()
  @Validate(
    (value: ms.StringValue) => {
      const duration = ms(value);
      return typeof duration === 'number' && duration > 0;
    },
    {
      message:
        'LIB_USER_ACCESS_CONTROL_JWT_REFRESH_TOKEN_EXPIRES_IN must be a valid duration string (e.g.,"1d", "1h", "30m", "600s").',
    },
  )
  LIB_USER_ACCESS_CONTROL_JWT_REFRESH_TOKEN_EXPIRES_IN: ms.StringValue;

  // Email Verification
  @IsInt()
  @Min(5)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  LIB_USER_ACCESS_CONTROL_EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MIN: number = 10;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_EMAIL_VERIFICATION_CIPHER_KEY: string;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_EMAIL_VERIFICATION_CIPHER_IV: string;

  // Api Key
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_USER_ACCESS_CONTROL_API_KEY_VERIFICATION_ENABLED: boolean = false;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_API_KEY_CIPHER_KEY: string;

  @IsString()
  @IsNotEmpty()
  LIB_USER_ACCESS_CONTROL_API_KEY_CIPHER_IV: string;

  // ------------- Journal
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_JOURNAL_ENABLED: boolean = false;

  // ------------- Notification
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_EMAIL_ENABLED: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_SMS_ENABLED: boolean = false;

  @IsEnum(MailerClient)
  LIB_NOTIFICATION_MAILER_CLIENT_NAME: string;

  // Mailtrap
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_MAILER_MAILTRAP_ENABLED: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_MAILER_MAILTRAP_ENABLE_TLS: boolean = false;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILTRAP_ENABLED === true)
  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_MAILER_MAILTRAP_HOST: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILTRAP_ENABLED === true)
  @IsInt()
  @Min(0)
  @Max(65_535)
  @Transform(({ value }) => parseInt(value, 10))
  LIB_NOTIFICATION_MAILER_MAILTRAP_PORT: number = 1025;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILTRAP_ENABLED === true)
  @IsString()
  @IsOptional()
  LIB_NOTIFICATION_MAILER_MAILTRAP_USERNAME: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILTRAP_ENABLED === true)
  @IsString()
  @IsOptional()
  LIB_NOTIFICATION_MAILER_MAILTRAP_PASSWORD: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILTRAP_ENABLED === true)
  @IsEmail()
  LIB_NOTIFICATION_MAILER_MAILTRAP_DEFAULT_MAIL_FROM: string;

  // Mailhog
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_MAILER_MAILHOG_ENABLED: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_MAILER_MAILHOG_ENABLE_TLS: boolean = false;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILHOG_ENABLED === true)
  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_MAILER_MAILHOG_HOST: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILHOG_ENABLED === true)
  @IsInt()
  @Min(0)
  @Max(65_535)
  @Transform(({ value }) => parseInt(value, 10))
  LIB_NOTIFICATION_MAILER_MAILHOG_PORT: number = 1025;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILHOG_ENABLED === true)
  @IsString()
  @IsOptional()
  LIB_NOTIFICATION_MAILER_MAILHOG_USERNAME: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILHOG_ENABLED === true)
  @IsString()
  @IsOptional()
  LIB_NOTIFICATION_MAILER_MAILHOG_PASSWORD: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_MAILHOG_ENABLED === true)
  @IsEmail()
  LIB_NOTIFICATION_MAILER_MAILHOG_DEFAULT_MAIL_FROM: string;

  // Sendgrid
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_MAILER_SENDGRID_ENABLED: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  LIB_NOTIFICATION_MAILER_SENDGRID_ENABLE_TLS: boolean = false;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_SENDGRID_ENABLED === true)
  @IsString()
  @IsNotEmpty()
  LIB_NOTIFICATION_MAILER_SENDGRID_HOST: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_SENDGRID_ENABLED === true)
  @IsInt()
  @Min(0)
  @Max(65_535)
  @Transform(({ value }) => parseInt(value, 10))
  LIB_NOTIFICATION_MAILER_SENDGRID_PORT: number = 25;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_SENDGRID_ENABLED === true)
  @IsString()
  @IsOptional()
  LIB_NOTIFICATION_MAILER_SENDGRID_USERNAME: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_SENDGRID_ENABLED === true)
  @IsString()
  @IsOptional()
  LIB_NOTIFICATION_MAILER_SENDGRID_PASSWORD: string;

  @ValidateIf((o) => o.LIB_NOTIFICATION_MAILER_SENDGRID_ENABLED === true)
  @IsEmail()
  LIB_NOTIFICATION_MAILER_SENDGRID_DEFAULT_MAIL_FROM: string;
}

export function validateConfig(payload: Record<string, any>) {
  const config = plainToInstance(AppConfig, payload, {
    exposeDefaultValues: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const message = errors
      .map((e) =>
        Object.values(e.constraints || {})
          .map((msg) => `- ${msg}`)
          .join('\n'),
      )
      .join('\n');

    throw new Error(
      `${AppConfig.name} environment variables validation failed\n${message}`,
    );
  }

  return config;
}
