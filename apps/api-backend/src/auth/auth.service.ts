import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as argon2 from 'argon2';
import { UserRole } from '@turnia/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Registers a new tenant and creates its owner user in an atomic transaction.
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    // Set currency based on market config
    const currency = dto.market === 'ES' ? 'EUR' : 'ARS';
    const timezone = dto.market === 'ES' ? 'Europe/Madrid' : 'America/Argentina/Buenos_Aires';
    const locale = dto.market === 'ES' ? 'es-ES' : 'es-AR';

    const hashedPassword = await argon2.hash(dto.password);

    // Atomic transaction for database consistency
    const result = await this.prisma.client.$transaction(async (tx) => {
      // 1. Create the Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.businessName,
          subdomain: dto.subdomain ? dto.subdomain.toLowerCase() : null,
          market: dto.market,
          currency,
        },
      });

      // 2. Create the Business details
      await tx.business.create({
        data: {
          tenantId: tenant.id,
          name: dto.businessName,
          timezone,
          locale,
        },
      });

      // 3. Create the Tenant Owner User
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: dto.email.toLowerCase(),
          passwordHash: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName || null,
          role: 'TENANT_OWNER',
          emailVerified: false,
        },
      });

      return { tenant, user };
    });

    return this.generateAuthResponse(result.user);
  }

  /**
   * Validates user credentials and issues tokens.
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.client.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { tenant: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales incorrectas o usuario inactivo.');
    }

    if (user.tenant && user.tenant.status !== 'ACTIVE') {
      throw new UnauthorizedException('La cuenta de tu negocio está suspendida.');
    }

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    return this.generateAuthResponse(user);
  }

  /**
   * Refreshes JWT tokens.
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_turnia_2026_dev_only',
      });

      const user = await this.prisma.client.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario inactivo o no encontrado.');
      }

      const tokens = await this.generateTokens(user.id, user.tenantId, user.email, user.role as UserRole);
      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Token de actualización inválido o expirado.');
    }
  }

  private async generateTokens(userId: string, tenantId: string | null, email: string, role: UserRole) {
    const payload = { userId, tenantId, email, role };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_turnia_2026_dev_only',
        expiresIn: '7d',
      }
    );

    return { accessToken, refreshToken };
  }

  private async generateAuthResponse(user: any): Promise<AuthResponseDto> {
    const tokens = await this.generateTokens(user.id, user.tenantId, user.email, user.role as UserRole);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
