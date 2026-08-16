import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsOptional } from 'class-validator';
import { MarketType } from '@turnia/types';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del negocio es requerido.' })
  businessName: string;

  @IsString()
  @IsOptional()
  subdomain?: string;

  @IsIn(['ES', 'AR'], { message: 'El mercado debe ser ES (España) o AR (Argentina).' })
  @IsNotEmpty({ message: 'El mercado es requerido.' })
  market: string;
}
