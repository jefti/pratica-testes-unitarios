import app from "app";
import supertest = require("supertest");
import { createRandomUser, inputUser } from "../factories/user.factory";
import prisma from "database";
import { Movie, Rental, User } from "@prisma/client";
import { createRandomMovie } from "../factories/movie.factory";
import { createRandomRental } from "../factories/rental.factory";
import httpStatus = require("http-status");
import { cleanDb } from "../utils";

const api = supertest(app);
beforeEach(async() => { cleanDb()});

describe("GET /rentals tests", () => {
  // it("should fail when databse has no rentals", async () => {
  //   const {status} = await api.get("/rentals");
  //   expect(status).toBe(httpStatus.NOT_FOUND);
  // })
  
  it("should return a rental list", async () => {
    const createdUser: User = await prisma.user.create({data:createRandomUser()});
    const createdRental: Rental = await prisma.rental.create({data: createRandomRental(createdUser.id)});
    await prisma.movie.create({data:createRandomMovie(createdRental.id)});
    const {body} = await api.get("/rentals");
    expect(body).toStrictEqual(expect.arrayContaining([expect.objectContaining({
      id: expect.any(Number),
      date: expect.any(String),
      endDate: expect.any(String),
      userId: expect.any(Number),
      closed: expect.any(Boolean)
    })]));
  })
})