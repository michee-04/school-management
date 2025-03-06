/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateUtils, ErrorResult, StringUtils } from '@app/common/utils';
import * as ms from 'ms';

import { AppConfig } from '@app/core-app/config';
import { LeanedDocument } from '@app/core-app/providers/base.mongo.repository';
import { JwtSignatureService } from '@app/core-app/services/jwtSignature.service';
import { PasswordService } from '@app/core-app/services/password.service';
import { User } from '@app/prof/infrastructure/models/user.model';
import { OtpRepository } from '@app/prof/infrastructure/repository/otp.repository';
import { UserRepository } from '@app/prof/infrastructure/repository/user.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type Metadata = { ipAddress: string; appType?: string };
type TokenPayload = {
  organization_access: {
    names: string[];
  };
  metadata: {
    type: 'access_token' | 'refresh_token';
  };
  account: {
    uid?: string;
    id: string;
  };
};

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly appName: string;

  private readonly whitelistEmails: string[];
  private readonly whitelistOtp: string;
  private readonly otpLifeInMin: number;
  private readonly jwtSecret: string;
  private readonly jwtIssuer: string;
  private readonly jwtAccessExpiresIn: ms.StringValue;
  private readonly jwtRefreshExpiresIn: ms.StringValue;

  private readonly verifyEmailTokenLifeInMin: number;
  private readonly verifyEmailCipherKey: string;
  private readonly verifyEmailCipherIV: string;

  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
  ) {
    this.whitelistEmails = this.config
      .get('LIB_USER_ACCESS_CONTROL_WHITELIST_EMAILS', { infer: true })
      .split(',')
      .map((s) => s.trim());

    this.otpLifeInMin = this.config.get(
      'LIB_USER_ACCESS_CONTROL_OTP_EXPIRES_IN_MIN',
      { infer: true },
    );

    this.appName = this.config.get('GLOBAL_APP_NAME', { infer: true });

    this.otpLifeInMin = this.config.get(
      'LIB_USER_ACCESS_CONTROL_OTP_EXPIRES_IN_MIN',
      { infer: true },
    );

    this.whitelistEmails = this.config
      .get('LIB_USER_ACCESS_CONTROL_WHITELIST_EMAILS', { infer: true })
      .split(',')
      .map((s) => s.trim());

    this.jwtSecret = this.config.get('LIB_USER_ACCESS_CONTROL_JWT_SECRET', {
      infer: true,
    });
    this.jwtIssuer = this.config.get('LIB_USER_ACCESS_CONTROL_JWT_ISSUER', {
      infer: true,
    });
    this.jwtAccessExpiresIn = this.config.get(
      'LIB_USER_ACCESS_CONTROL_JWT_ACCESS_TOKEN_EXPIRES_IN',
      { infer: true },
    );
    this.jwtRefreshExpiresIn = this.config.get(
      'LIB_USER_ACCESS_CONTROL_JWT_REFRESH_TOKEN_EXPIRES_IN',
      { infer: true },
    );

    this.verifyEmailTokenLifeInMin = this.config.get(
      'LIB_USER_ACCESS_CONTROL_EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MIN',
      { infer: true },
    );
    this.verifyEmailCipherKey = this.config.get(
      'LIB_USER_ACCESS_CONTROL_EMAIL_VERIFICATION_CIPHER_KEY',
      { infer: true },
    );
    this.verifyEmailCipherIV = this.config.get(
      'LIB_USER_ACCESS_CONTROL_EMAIL_VERIFICATION_CIPHER_IV',
      { infer: true },
    );
  }

  async validateLoginOtp(
    otp: string,
    token: string,
    meta: Metadata,
    isApi = false,
  ) {
    const data = await this.otpRepository.getOne({ code: otp });

    if (!data) {
      throw new ErrorResult({
        code: 400_058,
        clean_message: 'Le code de vérification est invalide',
        message: "Le token ou l'otp est invalide",
      });
    }

    if (DateUtils.isAfter(new Date(), data.expiresAt)) {
      // this.log(
      //   'info',
      //   `L'utilisateur ${data.email} a fourni un token/otp de connexion est expiré`
      // );
      throw new ErrorResult({
        code: 400_059,
        clean_message: 'Le code de vérification est expiré',
        message: "L'otp est expiré",
      });
    }

    data.used = true;
    this.otpRepository.update(data).catch(() => {});

    const user = await this.userRepository.getByEmail(data.email);
    if (!user) {
      throw new ErrorResult({
        code: 404_016,
        clean_message: 'Le compte est introuvable',
        message: `Le compte [${data.email}] est introuvable`,
      });
    }

    if (isApi) {
      return this.generateJwtTokens(user, meta);
    }

    // this.log(
    //   'info',
    //   `L'utilisateur ${data.email} a réussi à valider son token/otp de connexion`,
    // );
    const { password: _, passwordSalt: __, ...userData } = user;
    return userData;
  }

  async generateLoginOtp(user: LeanedDocument<User>) {
    const code = this.whitelistEmails.includes(user.email)
      ? this.whitelistOtp
      : StringUtils.generateRandomNumber(6);

    // this.logger(
    //   'info',
    //   `L'utilisateur ${user.email} a réussi à obtenir un token/otp de connexion`,
    // );
    return this.otpRepository.create({
      code,
      email: user.email,
      phone: user.phone,
      expiresAt: DateUtils.addMinutes(new Date(), this.otpLifeInMin),
      used: false,
    });
  }

  /**
   * Generate access and refresh tokens for a given user
   */
  private async generateJwtTokens(user: LeanedDocument<User>, meta: Metadata) {
    const accessTokenPayload = this.constructAccessTokenPayload(user);
    const accessTokenData = this.signJwtAccessTokenPayload(accessTokenPayload);

    const refreshTokenPayload = this.constructRefreshTokenData(user);
    const refreshTokenData =
      this.signJwtRefreshTokenPayload(refreshTokenPayload);

    const data = {
      access_token: accessTokenData.token,
      access_expires_at: accessTokenData.expiresAt,
      refresh_token: refreshTokenData.token,
      refresh_expires_at: refreshTokenData.expiresAt,
      token_type: 'Bearer',
      scope: 'authentication',
    };

    return data;
  }

  private constructAccessTokenPayload(
    user: LeanedDocument<User>,
  ): TokenPayload {
    return {
      organization_access: {
        names: ['digital.gouv.tg'],
      },
      metadata: {
        type: 'access_token',
      },
      account: {
        uid: user._id.toString(),
        id: user._id.toString(),
      },
    };
  }

  private constructRefreshTokenData(user: LeanedDocument<User>): TokenPayload {
    return {
      organization_access: {
        names: ['digital.gouv.tg'],
      },
      metadata: {
        type: 'refresh_token',
      },
      account: {
        uid: user._id.toString(),
        id: user._id.toString(),
      },
    };
  }

  private isPasswordMatch(
    salt: string,
    password: string,
    hashedPassword: string,
  ) {
    return PasswordService.isPasswordMatch(salt, password, hashedPassword);
  }

  private signJwtAccessTokenPayload(payload: Record<string, any>) {
    return JwtSignatureService.signPayload(payload, this.jwtSecret, {
      expiresIn: this.jwtAccessExpiresIn,
      issuer: this.jwtIssuer,
    });
  }

  private signJwtRefreshTokenPayload(payload: Record<string, any>) {
    return JwtSignatureService.signPayload(payload, this.jwtSecret, {
      expiresIn: this.jwtRefreshExpiresIn,
      issuer: this.jwtIssuer,
    });
  }

  private verifyJwtPayload(token: string) {
    return JwtSignatureService.verifyPayload(token, this.jwtSecret);
  }
}
