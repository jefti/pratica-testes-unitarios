import { faker } from "@faker-js/faker";
import { Rental } from "@prisma/client";

export type inputRental = Omit<Rental, "id">;

export function createRandomRental(id:number){
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 7);

    const rental: inputRental = {
        date: currentDate,
        endDate: endDate,
        userId: id,
        closed: false
    };
    return rental;
}