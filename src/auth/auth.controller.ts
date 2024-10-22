import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GenerateOtpDto,
  ResetPassword_otp_Verification,
} from './dto/generateOtp.dto';
import { SingUpDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import {
  ForgetPasswordDto,
  ForgetPasswordDtoTokenGeneration,
  LoginDto,
} from './dto/login.dto';
import { GoogleLoginDto } from './dto/GoogleLogin.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup/otpG')
  generateOtP(@Body() generateDto: GenerateOtpDto) {
    return this.authService.genRateOTPforSignup(generateDto);
  }

  @Post('/signup/Otp_verify')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    // return { verifyOtpDto };
    return this.authService.verifySignupOtp(verifyOtpDto);
  }

  @Post('/signup')
  signup(@Body() SignupDto: SingUpDto) {
    return this.authService.singUp(SignupDto);
  }

  @Post('/logIn')
  logIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('/google_login')
  googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(googleLoginDto);
  }

  //forget password
  @Post('/forget_password_send_mail_with_token')
  forgetPasswordTokenLinkSend(
    @Body()
    ForgetPasswordDto_tokenGeneration: ForgetPasswordDtoTokenGeneration,
  ) {
    return this.authService.forgetPasswordTokenLinkSend(
      ForgetPasswordDto_tokenGeneration,
    );
  }
  @Post('/forget_password/:token')
  forgetPassword(
    @Param('token') token: string,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ) {
    return this.authService.forgetPassword_tokenVerification(
      token,
      forgetPasswordDto,
    );
  }

  @Post('/reset_password_otpGeneration')
  resetPasswordOtpGeneration(@Body() genegenerateOtpDto: GenerateOtpDto) {
    return this.authService.resetPassword_otp_generation(genegenerateOtpDto);
  }

  @Post('/reset_password_verification')
  resetPassword_Verification(
    @Body() resetPassword_otp_Verification: ResetPassword_otp_Verification,
  ) {
    return this.authService.resetPassword_Verification(
      resetPassword_otp_Verification,
    );
  }

  @Get('/allUser')
  getAllUser() {
    return this.authService.getAlluser();
  }
}
