import { faker } from '@faker-js/faker';
import { User } from "@prisma/client"

export type inputUser = Omit<User,"id">;

export function createRandomUser():inputUser{
    const user:inputUser = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        cpf: generateCPF(),
        birthDate: faker.date.birthdate()
    };
    return user;
}

function generateCPF(){
    let cpf = "";
    for(let i = 0; i<9; i++){
        let randomNumber = Math.floor(Math.random()*(10));
        cpf += randomNumber.toString();
    }
    return cpf;
}