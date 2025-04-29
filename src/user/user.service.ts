import { DbService } from './../db/db.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  private DbService: DbService;

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  // 注册
  async register(registerUserDto: RegisterUserDto) {
    // 1. 从数据库中查询是否已经存在
    const users: User[] = await this.DbService.read();
    const isExistUser = users.find(
      (user) => user.username === registerUserDto.username,
    );
    if (isExistUser) {
      throw new BadRequestException('用户名已存在');
    }
    // 2. 不存在则创建新用户
    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;

    users.push(user);
    await this.DbService.write(users);
    return user;
  }
  // 登录
  async login(loginUserDto: LoginUserDto) {
    const user: User[] = (await this.DbService.read()) ?? [];
    const foundUser = user.find(
      (user) => user.username === loginUserDto.username,
    );
    if (!foundUser) {
      throw new BadRequestException('用户名不存在');
    }
    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('密码错误');
    }
    return foundUser;
  }
}
