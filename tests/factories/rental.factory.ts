import { faker } from "@faker-js/faker";
import { Rental } from "@prisma/client";

export type inputRental = Omit<Rental, "id">;

export function createRandomRental(userId:number){
    const rental: inputRental = {
        date: faker.date.past(),
        endDate: faker.date.future(),
        userId,
        closed: false
    };
    return rental;
}