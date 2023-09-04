import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsErrors } from './errors/inavlid-credentials.error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate ', async () => {
    await usersRepository.create({
      name: 'Marcelo',
      email: 'marcelo@hotmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'marcelo@hotmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email ', async () => {
    expect(() =>
      sut.execute({
        email: 'marcelo@hotmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErrors)
  })

  it('should be able to authenticate with wrong password ', async () => {
    await usersRepository.create({
      name: 'Marcelo',
      email: 'marcelo@hotmail.com',
      password_hash: await hash('1233456', 6),
    })

    expect(() =>
      sut.execute({
        email: 'marcelo@hotmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErrors)
  })
})
