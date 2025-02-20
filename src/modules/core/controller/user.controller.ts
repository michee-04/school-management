import { UserService } from '@app/prof/domaine/service/user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/request/user.request.dto';

@Controller('/api/v1')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(@Body() body: CreateUserRequestDto) {
    const user = await this.userService.create(body);

    return user;
  }
}
