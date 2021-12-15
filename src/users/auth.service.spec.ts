import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  // For every single test, gets a new AuthService
  beforeEach(async () => {
    //Create a fake copy of the usersService
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const newUser = { id: users.length + 1, email, password } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      },
    };

    // this is a DI container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    // Create a test Service
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('qwe@qwe.com', 'qwe');

    expect(user.password).not.toEqual('qwe');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use.', async () => {
    await service.signup('used@used.com', 'used');

    expect.assertions(2);
    // We expect it to fail in try, and catch allows test to be done
    // Jest will assume test is fail if it does not finish in 5 seconds
    try {
      await service.signup('used@used.com', 'qwe');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('User already exists');
    }
  });

  it('throws an error if user signs in with unused email', async () => {
    expect.assertions(2);
    try {
      await service.signin('asdasdasdqw@asdasda.com', 'qwe');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual("User doesn't exist");
    }
  });

  it('throws an error if user signs in with wrong password', async () => {
    await service.signup('used@used.com', 'qwe');
    expect.assertions(2);
    try {
      await service.signin('used@used.com', 'wrong');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Invalid password');
    }
  });

  it('return a user if correct email and password', async () => {
    await service.signup('qwe@qwe.com', 'qwe');
    const user = await service.signin('qwe@qwe.com', 'qwe');
    expect(user).toBeDefined();
  });
});
