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
beforeEach(async() => { await cleanDb()});

describe("GET /rentals tests", () => { 
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

describe("GET /rentals/id", () =>{
  it("should fail when id doesn't exist", async()=>{
    const createdUser: User = await prisma.user.create({data:createRandomUser()});
    const createdRental: Rental = await prisma.rental.create({data: createRandomRental(createdUser.id)});
    await prisma.rental.delete({where:{id: createdRental.id}});
    const {status} = await api.get(`/rentals/${createdRental.id}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  })

  it("should return a rental when id exists", async()=>{
    const createdUser:User = await prisma.user.create({data:createRandomUser()});
    const createdRental:Rental = await prisma.rental.create({data: createRandomRental(createdUser.id)});
    await prisma.movie.create({data:createRandomMovie(createdRental.id)});
    const {body} = await api.get(`/rentals/${createdRental.id}`);
    expect(body).toStrictEqual(expect.objectContaining({
      id: expect.any(Number),
      date: expect.any(String),
      endDate: expect.any(String),
      userId: expect.any(Number),
      closed: expect.any(Boolean)
    }));
  })
});

describe("Post /rentals", () =>{
  it("should fail when body doesn't exist", async()=>{
    const {status} = await api.post(`/rentals`);
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  })
  it("should create when sending body has corret format", async()=>{
    const createdUser:User = await prisma.user.create({data:createRandomUser()});
    const createdMovie: Movie = await prisma.movie.create({data:createRandomMovie()});
    const body = {userId: createdUser.id, moviesId: [createdMovie.id]}
    
    const {status} = await api.post(`/rentals`).send(body);
    expect(status).toBe(httpStatus.CREATED);
  })
})

describe("Post /rentals/finish", () =>{
  it("should fail when body doesn't exist", async()=>{
    const {status} = await api.post(`/rentals/finish`);
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  })
  it("should create when sending body has corret format", async()=>{
    const createdUser:User = await prisma.user.create({data:createRandomUser()});
    const createdRental:Rental = await prisma.rental.create({data: createRandomRental(createdUser.id)});
    await prisma.movie.create({data:createRandomMovie(createdRental.id)});
    
    const body = {rentalId: createdRental.id};
    
    const {status} = await api.post(`/rentals/finish`).send(body);
    expect(status).toBe(httpStatus.OK);
  })
})