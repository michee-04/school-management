import jwt from 'jsonwebtoken';
import * as ms from 'ms';
import { DateUtils, ObjectUtils } from '../types';

export class JwtSignatureService {
  static signPayload(payload: any, secret: string, options: jwt.SignOptions) {
    if (!secret) {
      throw new Error('Authentication jwt signature key is not set');
    }

    if (!options.expiresIn) {
      throw new Error('Authentication exprire duration is not provided');
    }

    if (!options.issuer) {
      throw new Error('Authentication jwt issuer is not provided');
    }

    const expiresIn = (options.expiresIn || '1h') as ms.StringValue;
    const mss = ms(expiresIn);

    const jwtOptions = ObjectUtils.deepCopy(options);

    return {
      token: jwt.sign(payload, secret, {
        expiresIn: options.expiresIn,
        audience: 'account',
        issuer: options.issuer,
        algorithm: 'HS512',
        ...jwtOptions,
      }),
      expiresAt: DateUtils.addMillis(new Date(), mss).getTime(),
    };
  }

  static verifyPayload(token: string, secret: string) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw Error('Token validation failed: ' + error.message);
    }
  }
}
