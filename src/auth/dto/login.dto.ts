import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'PLEASE GIVE CORRECT MAILED' })
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}

export class ForgetPasswordDtoTokenGeneration {
  @IsNotEmpty()
  @IsEmail({}, { message: 'PLEASE GIVE CORRECT MAILID' })
  @IsString()
  readonly email: string;
}
export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password length should be 6' })
  readonly password: string;
}
