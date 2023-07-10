import { JWTResponse } from './interfaces/jwt-reponse.interface';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiCreatedResponse({
    description: 'Usuario registrado',
    type: JWTResponse,
  })
  @ApiBadRequestResponse()
  register(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ access_token: string }> {
    return this.authService.register(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Usuario Logeado',
    type: JWTResponse,
  })
  @Post('login')
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }
}
