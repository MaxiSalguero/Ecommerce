import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/users.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Faltan datos requeridos o datos incorrectos' })
  @ApiResponse({ status: 409, description: 'Email ingresado no disponible' })
  signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @Post('signin')
  @ApiResponse({ status: 201, description: 'Usuario logueado exitosamente' })
  @ApiResponse({ status: 401, description: 'Credenciales proporcionadas inválidas' })
  @ApiResponse({ status: 400, description: 'Faltan datos requeridos o datos incorrectos' })
  signIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    return this.authService.signIn(email, password);
  }
}
