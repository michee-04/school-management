import { ModelDefinition } from '@nestjs/mongoose';
import { Departement, DepartementSchema } from './departement.model';
import { Filiere, FiliereSchema } from './filiere.model';
import { Matiere, MatiereSchema } from './matiere.model';
import { Otp, OtpSchema } from './otp.model';
import { Salle, SalleSchema } from './salle.model';
import { User, UserSchema } from './user.model';

export const ModelsMainProviders: ModelDefinition[] = [
  { name: Otp.name, schema: OtpSchema },
  { name: User.name, schema: UserSchema },
  { name: Departement.name, schema: DepartementSchema },
  { name: Filiere.name, schema: FiliereSchema },
  { name: Matiere.name, schema: MatiereSchema },
  { name: Salle.name, schema: SalleSchema },
];
