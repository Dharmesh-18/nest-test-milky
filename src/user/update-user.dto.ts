import { IsString, IsBoolean, IsNumber, IsOptional, MinLength, IsEnum } from 'class-validator';
import { Role } from '../auth/roles.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  collectedToday?: boolean;

  @IsNumber()
  @IsOptional()
  monthlyAmount?: number;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;
}
