/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ErrorResult, validatePassword } from '@app/common/utils';
import { AppConfig } from '@app/core-app/config';
import { PasswordService } from '@app/core-app/services/password.service';
import { NotifyService } from '@app/notification/infrastructure/services/notify.service';
import { User } from '@app/prof/infrastructure/models/user.model';
import { UserRepository } from '@app/prof/infrastructure/repository/user.repository';

type CreateUserOptions = Record<string, any> & { isAdmin?: boolean };

@Injectable()
export class UserService {
  private readonly canValidatePassword: boolean = false;
  private readonly defaultPassword: string;

  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly notifyService: NotifyService,
    private readonly userRepository: UserRepository,
  ) {
    this.canValidatePassword = this.config.get(
      'LIB_USER_ACCESS_CONTROL_PASSWORD_VALIDATION_ENABLED',
      { infer: true },
    );
    this.defaultPassword = this.config.get(
      'LIB_USER_ACCESS_CONTROL_DEFAULT_PASSWORD',
      { infer: true },
    );
  }

  /**
   * Create a new user
   */
  async create(input: Partial<User>, options: CreateUserOptions = {}) {
    if (this.canValidatePassword) {
      const passwordValidationResult = validatePassword(input.password!);
      if (passwordValidationResult !== true) {
        throw new ErrorResult([
          {
            code: 400_061,
            clean_message: "Le mot de passe n'est pas sécurisé",
            message: "Le champ [password] n'est pas sécurisé",
          },
          ...passwordValidationResult.map((el) => ({
            code: el.code,
            clean_message: el.message,
            message: "Le champ [password] n'est pas sécurisé",
          })),
        ]);
      }
    }

    const existingEmail = await this.userRepository.getByEmail(input.email!);
    if (existingEmail) {
      throw new ErrorResult({
        code: 409_010,
        clean_message: "L'adresse e-mail est déjà utilisée",
        message: `L'adresse e-mail [${input.email}] est déjà utilisée`,
      });
    }

    const existingPhone = await this.userRepository.getByPhone(input.phone!);
    if (existingPhone) {
      throw new ErrorResult({
        code: 409_011,
        clean_message: 'Le numéro de téléphone est déjà utilisé',
        message: `Le numéro de téléphone [${input.phone}] est déjà utilisé`,
      });
    }

    const userDto: Partial<User> = {};
    userDto.firstname = input.firstname!;
    userDto.lastname = input.lastname!;
    userDto.gender = input.gender!;
    userDto.email = input.email!;
    userDto.phone = input.phone!;
    userDto.password = input.password || this.defaultPassword;
    userDto.verified = input.verified;

    // Handle password hasher
    const { salt, hashedPassword } = await this.hashPassword(userDto.password);
    userDto.passwordSalt = salt;
    userDto.password = hashedPassword;

    const user = await this.userRepository.create(userDto);
    return user;
  }

  // async updateProfile(userId: string, input: Partial<User>, lang = 'fr') {
  //   let user = await this.userRepository.getById(userId);
  //   if (!user) {
  //     throw new ErrorResult({
  //       code: 404_016,
  //       clean_message: 'Le compte est introuvable',
  //       message: `Le compte [${userId}] est introuvable`,
  //     });
  //   }

  //   user.firstname = input.firstname || user.firstname;
  //   user.lastname = input.lastname || user.lastname;
  //   user.gender = input.gender || user.gender;

  //   if (input.email) {
  //     const existingEmail = await this.userRepository.getActiveByEmail(
  //       input.email,
  //     );
  //     if (
  //       existingEmail &&
  //       existingEmail._id.toString() !== user._id.toString()
  //     ) {
  //       throw new ErrorResult({
  //         code: 409_010,
  //         clean_message: "L'adresse e-mail est déjà utilisée",
  //         message: `L'adresse e-mail [${input.email}] est déjà utilisée`,
  //       });
  //     }
  //     user.email = input.email;
  //   }

  //   if (input.phone) {
  //     const existingPhone = await this.userRepository.getActiveByPhone(
  //       input.phone,
  //     );
  //     if (
  //       existingPhone &&
  //       existingPhone._id.toString() !== user._id.toString()
  //     ) {
  //       throw new ErrorResult({
  //         code: 409_011,
  //         clean_message: 'Le numéro de téléphone est déjà utilisé',
  //         message: `Le numéro de téléphone [${input.phone}] est déjà utilisé`,
  //       });
  //     }
  //     user.phone = input.phone;
  //   }

  //   user = await this.userRepository.update(user);
  //   if (!user) {
  //     throw new ErrorResult({
  //       code: 404_016,
  //       clean_message: 'Le compte est introuvable',
  //       message: `Le compte [${userId}] est introuvable`,
  //     });
  //   }

  //   if (input.email) {
  //     // Send confirmation notification for email
  //     const payload = { lang, isFr: lang === 'fr' };
  //     Promise.all([
  //       this.notifyService.notifyByEmail(
  //         'mail-email-change-confirmation',
  //         payload,
  //         user.email,
  //         user._id.toString(),
  //       ),
  //       this.notifyService.notifyBySms(
  //         'sms-email-change-confirmation',
  //         payload,
  //         user.phone,
  //       ),
  //     ]).catch(() => {});
  //   }

  //   if (input.phone) {
  //     // Send confirmation notification for phone
  //     const payload = { lang, isFr: lang === 'fr' };
  //     Promise.all([
  //       this.notifyService.notifyByEmail(
  //         'mail-phone-change-confirmation',
  //         payload,
  //         user.email,
  //         user._id.toString(),
  //       ),
  //       this.notifyService.notifyBySms(
  //         'sms-phone-change-confirmation',
  //         payload,
  //         user.phone,
  //       ),
  //     ]).catch(() => {});
  //   }

  //   return user;
  // }

  // async updatePassword(
  //   userId: string,
  //   newPassword: string,
  //   oldPassword?: string,
  //   lang = 'fr',
  // ) {
  //   // [START] validate password
  //   if (this.canValidatePassword) {
  //     const passwordValidationResult = validatePassword(newPassword);
  //     if (passwordValidationResult !== true) {
  //       throw new ErrorResult([
  //         {
  //           code: 400_061,
  //           clean_message: "Le mot de passe n'est pas sécurisé",
  //           message: "Le champ [password] n'est pas sécurisé",
  //         },
  //         ...passwordValidationResult.map((el) => ({
  //           code: el.code,
  //           clean_message: el.message,
  //           message: "Le champ [password] n'est pas sécurisé",
  //         })),
  //       ]);
  //     }
  //   }

  //   let user = await this.userRepository.getById(userId);
  //   if (!user) {
  //     throw new ErrorResult({
  //       code: 404_016,
  //       clean_message: 'Le compte est introuvable',
  //       message: `Le compte [${userId}] est introuvable`,
  //     });
  //   }

  //   if (oldPassword) {
  //     const isOldPasswordCorrect = await this.isPasswordMatch(
  //       user.passwordSalt,
  //       oldPassword,
  //       user.password,
  //     );
  //     if (!isOldPasswordCorrect) {
  //       throw new ErrorResult({
  //         code: 401_002,
  //         clean_message: "L'ancien mot de passe est incorrect",
  //         message: 'Le champ [oldPassword] est incorrect',
  //       });
  //     }
  //   }

  //   // Handle password hasher
  //   const { salt, hashedPassword } = await this.hashPassword(newPassword);
  //   user.passwordSalt = salt;
  //   user.password = hashedPassword;

  //   user = await this.userRepository.update(user);
  //   if (!user) {
  //     throw new ErrorResult({
  //       code: 404_016,
  //       clean_message: 'Le compte est introuvable',
  //       message: `Le compte [${userId}] est introuvable`,
  //     });
  //   }

  //   // Send confirmation notification
  //   const payload = { lang, isFr: lang === 'fr' };
  //   Promise.all([
  //     this.notifyService.notifyByEmail(
  //       'mail-password-change-confirmation',
  //       payload,
  //       user.email,
  //       user._id.toString(),
  //     ),
  //     this.notifyService.notifyBySms(
  //       'sms-password-change-confirmation',
  //       payload,
  //       user.phone,
  //     ),
  //   ]).catch(() => {});

  //   return user;
  // }

  async getById(id: string) {
    const user = await this.userRepository.getOne(
      { _id: id },
      {},
      { password: 0, passwordSalt: 0 },
    );

    if (!user) {
      throw new ErrorResult({
        code: 404_018,
        clean_message: "L'utilisateur est introuvable",
        message: `L'utilisateur [${id}] est introuvable`,
      });
    }

    return user;
  }

  async activate(id: string) {
    const user = await this.getById(id);
    if (!user.active && !user.deleted) {
      user.active = true;
      await this.userRepository.update(user);
    }

    return user;
  }

  async deactivate(id: string) {
    const user = await this.getById(id);
    if (user.active && !user.deleted) {
      user.active = false;
      await this.userRepository.update(user);
    }

    return user;
  }

  private hashPassword(password: string) {
    return PasswordService.hashPassword(password);
  }

  private isPasswordMatch(
    salt: string,
    password: string,
    hashedPassword: string,
  ) {
    return PasswordService.isPasswordMatch(salt, password, hashedPassword);
  }
}
