import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from 'bcryptjs'

interface IUserRequest {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
}

class CreateUserService {
  async execute({ name, email, password, admin = false }: IUserRequest) {
    if (!email) throw new Error('Incorrect email');

    const usersRepositories = getCustomRepository(UsersRepositories);
    const userAlreadyExists = await usersRepositories.findOne({email});

    if (userAlreadyExists) throw new Error('User already exists');

    const passwordHash = await hash(password, 8);

    const user = usersRepositories.create({
      password: passwordHash,
      name,
      email,
      admin
    });

    await usersRepositories.save(user);

    return user;
  }
}

export { CreateUserService }