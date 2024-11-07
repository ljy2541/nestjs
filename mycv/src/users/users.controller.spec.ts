import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id: number): null | Promise<User | null> {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: '12345',
        } as User);
      },
      find(email: string): Promise<User[]> {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      // async update(id: number, attrs: Partial<User>): Promise<User> {},
      // async remove(id: number): Promise<User> {},
    };
    fakeAuthService = {
      // async signUp(email: string, password: string): Promise<User> {},
      signIn(email: string, password: string): Promise<User> {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).not.toBe(0);
    expect(users[0].email).toBe('asdf@asdf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      { email: 'asdf', password: 'asdf' },
      session,
    );
    expect(user.id).toBeDefined();
    expect(user.id).toBe(session.userId);
  });
});
