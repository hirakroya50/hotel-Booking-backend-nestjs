import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'PLEASE GIVE CORRECT MAILED' })
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly picture: string;

  @IsNotEmpty()
  @IsString()
  readonly sub: string;
}
