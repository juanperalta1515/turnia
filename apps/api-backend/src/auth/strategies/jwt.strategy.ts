import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DecodedToken, UserContext } from '@turnia/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_jwt_key_turnia_2026_dev_only',
    });
  }

  async validate(payload: any): Promise<UserContext> {
    if (!payload.userId || !payload.role) {
      throw new UnauthorizedException('Token JWT inválido.');
    }
    return {
      userId: payload.userId,
      tenantId: payload.tenantId,
      role: payload.role,
    };
  }
}
