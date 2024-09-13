import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${
          process.env.AUTHACTION_DOMAIN
        }/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://${process.env.AUTHACTION_DOMAIN}/`,
      audience: process.env.AUTHACTION_AUDIENCE,
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    this.logger.log(`[validate]`, payload);
    return payload;
  }
}
