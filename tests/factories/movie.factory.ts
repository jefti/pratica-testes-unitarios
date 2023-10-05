import { faker } from "@faker-js/faker";
import { Movie } from "@prisma/client";

export type inputMovie = Omit<Movie, "id">;
export function createRandomMovie(rentalId?:number){
    const movie: inputMovie = {
        name: faker.company.name(),
        adultsOnly: false,
        rentalId: rentalId || null
    }
    return movie;
}