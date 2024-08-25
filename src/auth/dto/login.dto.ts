import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'PLEASE GIVE CORRECT MAILED' })
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}

export class ForgetPasswordDto_tokenGeneration {
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
