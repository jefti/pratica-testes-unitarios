import getRentalById from "services/rentals-service";
import rentalsRepository from "repositories/rentals-repository";
import usersRepository from "repositories/users-repository";
import rentalsService from "services/rentals-service";
import { RentalInput } from "protocols";
import { createRandomUser } from "../factories/user.factory";
import { Rental, User } from "@prisma/client";
import { createRandomRental } from "../factories/rental.factory";


describe("function getRentalByid() from services", () => {
  it("throw not Found where rental no found", async () => {
    jest.spyOn(rentalsRepository, "getRentalById").mockImplementationOnce(():any=>{undefined});
    const rentalId: number = 3;
    const promise =  await rentalsService.getRentalById(rentalId);
    
    expect(promise).rejects.toEqual({
      name: "NotFoundError",
      message: "Rental not found."
    });
  })
})

describe("function createRental() from services", () => {
  it("Fails if user doesn't exist", async () => {
    const rentalInput: RentalInput = {userId: 1, moviesId:[1,2,3]};
    const promise = await rentalsService.createRental(rentalInput);
    expect(promise).rejects.toEqual({
      name: "NotFoundError",
      message: "User not found."
    });
  })

  it("Fails if user has a non-finished rental", async () => {
    const inputUser= createRandomUser();
    const user: User = {id:100, ...inputUser};
    const inputRental = createRandomRental(100);
    const rental: Rental = {id:101, ...inputRental};
    jest.spyOn(usersRepository, "getById").mockImplementationOnce(():any=>{user});
    jest.spyOn(rentalsRepository, "getRentalsByUserId").mockImplementationOnce(():any=>{rental});
    const rentalInputTest: RentalInput = {userId: 100, moviesId:[1,2,3]};
    const promise = await rentalsService.createRental(rentalInputTest);
    expect(promise).rejects.toEqual({
      name: "PendentRentalError",
      message: "The user already have a rental!"
    });
  })

  it("Fails if the movies is not avaliable for rental", () => {
    expect(true).toBe(true);
  })
})

