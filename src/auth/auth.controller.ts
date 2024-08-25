import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GenerateOtpDto,
  ResetPassword_otp_Verification,
} from './dto/generateOtp.dto';
import { SingUpDto } from './dto/signup.dto';
import { varifyOtpDto } from './dto/verifyOtp.dto';
import {
  ForgetPasswordDto,
  ForgetPasswordDto_tokenGeneration,
  loginDto,
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
  verifyOtp(@Body() verifyOtpDto: varifyOtpDto) {
    // return { verifyOtpDto };
    return this.authService.verifySignupOtp(verifyOtpDto);
  }

  @Post('/signup')
  signup(@Body() SignupDto: SingUpDto) {
    return this.authService.singUp(SignupDto);
  }

  @Post('/logIn')
  logIn(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }
  @Post('/google_login')
  googleLogin(@Body() GoogleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(GoogleLoginDto);
  }

  //forget password
  @Post('/forget_password_send_mail_with_token')
  forgetPasswordTokenLinkSend(
    @Body()
    ForgetPasswordDto_tokenGeneration: ForgetPasswordDto_tokenGeneration,
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
    // console.log(token, forgetPasswordDto);
    // return {
    //   sucess: 'email',
    //   token,
    //   forgetPasswordDto,
    // };
  }
  //reset password

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
