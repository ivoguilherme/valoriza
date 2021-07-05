import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({ email});

    if (!user) throw new Error('Email/Password incorrect');

    const validPassword =  await compare(password, user.password);

    if (!validPassword) throw new Error('Email/Password incorrect');

    const hash = '213964825cc0c1e5e9bb22ddc25085de'
    const token = sign({ email: user.email }, hash, { subject: user.id, expiresIn: '1d' });

    return token;
  }
}

export { AuthenticateUserService }