import { faker } from "@faker-js/faker";
import { Movie } from "@prisma/client";

export type inputMovie = Omit<Movie, "id">;
export function createRandomMovie(id?: number){
    const movie: inputMovie = {
        name: faker.company.name(),
        adultsOnly: false,
        rentalId: id || null
    }
    return movie;
}