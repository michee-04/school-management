import { ModelDefinition } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './otp.model';
import { User, UserSchema } from './user.model';

export const ModelsMainProviders: ModelDefinition[] = [
  { name: Otp.name, schema: OtpSchema },
  { name: User.name, schema: UserSchema },
];
