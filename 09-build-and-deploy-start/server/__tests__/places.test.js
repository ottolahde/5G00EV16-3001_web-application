import { beforeAll, describe, it, expect } from '@jest/globals'
import supertest from 'supertest'

import app from '../server.js'
import pool from '../database/db.js'

const loggedInUser = {
  userId: '',
  email: '',
  token: ''
}

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE email=$1', ['john.wayne@domain.com'])
  const data = {
    name: 'John Wayne',
    email: 'john.wayne@domain.com',
    password: 'password123'
  }

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(data)
  loggedInUser.userId = response.body.userId
  loggedInUser.email = response.body.email
  loggedInUser.token = response.body.token
})

describe('The places route', () => {
  let createdPlaceId = ''
  it('POST /api/places should create a place', async () => {
    const place = {
      title: 'Repovesi kansallispuisto',
      description: 'Olhava lean-to',
      address: 'Kouvola',
      creator: loggedInUser.userId
    }
    const response = await supertest(app)
      .post('/api/places')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
      .send(place)
    expect(response.status).toEqual(201)
    expect(response.body.place.id).toBeTruthy()
    expect(response.body.place.title).toEqual('Repovesi kansallispuisto')
    expect(response.body.place.description).toEqual('Olhava lean-to')
    expect(response.body.place.address).toEqual('Kouvola')
    expect(response.body.place.creator).toEqual(loggedInUser.userId)
    createdPlaceId = response.body.place.id
  })

  it('GET /api/place/user/userId should return places of the user', async () => {
    const response = await supertest(app)
      .get('/api/places/user/' + loggedInUser.userId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(Array.isArray(response.body.places)).toBeTruthy()
  })

  it('GET /api/place/user/userId should return for no valid user', async () => {
    const response = await supertest(app)
      .get('/api/places/user/b6bc11e2-7b2d-42ae-a517-41dfc8e6a546')
      .set('Accept', 'application/json')
    expect(response.status).toEqual(404)
    expect(response.text)
      .toEqual('{"message":"Could not find a place for the provided user id."}')
  })

  it('PATCH /api/places/placeId should update the place', async () => {
    const place = {
      title: 'Urho Kekkonnen kansallispuisto',
      description: 'Overnight Hut'
    }
    const response = await supertest(app)
      .patch('/api/places/' + createdPlaceId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
      .send(place)
    expect(response.status).toEqual(200)
    expect(response.body.place.title).toBeTruthy()
    expect(response.body.place.title).toEqual('Urho Kekkonnen kansallispuisto')
    expect(response.body.place.description).toEqual('Overnight Hut')
  })

  it('PATCH /api/places/placeId should not update place without valid token', async () => {
    const place = {
      title: 'Urho Kekkonnen kansallispuisto',
      description: 'Overnight Hut'
    }
    const response = await supertest(app)
      .patch('/api/places/' + createdPlaceId)
      .set('Authorization', 'Bearer b6bc11e2-7b2d-42ae-a517-41dfc8e6a546')
      .set('Accept', 'application/json')
      .send(place)
    expect(response.status).toEqual(401)
    expect(response.text)
      .toEqual('{"message":"Authentication failed."}')
  })

  it('PATCH /api/places/placeId should not update place with invalid title', async () => {
    const place = {
      title: '',
      description: 'Overnight Hut'
    }
    const response = await supertest(app)
      .patch('/api/places/' + createdPlaceId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
      .send(place)
    expect(response.status).toEqual(422)
    expect(response.text)
      .toEqual('{"message":"Invalid values given, please check the data"}')
  })

  it('PATCH /api/places/placeId should not update place with invalid description', async () => {
    const place = {
      title: 'Urho Kekkonnen kansallispuisto',
      description: ''
    }
    const response = await supertest(app)
      .patch('/api/places/' + createdPlaceId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
      .send(place)
    expect(response.status).toEqual(422)
    expect(response.text)
      .toEqual('{"message":"Invalid values given, please check the data"}')
  })

  it('GET /api/places/placeId should return the place', async () => {
    const response = await supertest(app)
      .get('/api/places/' + createdPlaceId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.place.id).toEqual(createdPlaceId)
    expect(response.body.place.title).toBeTruthy()
    expect(response.body.place.title).toEqual('Urho Kekkonnen kansallispuisto')
    expect(response.body.place.description).toEqual('Overnight Hut')
  })

  it('GET /api/places/placeId should return a place if invalid place id', async () => {
    const response = await supertest(app)
      .get('/api/places/b6bc11e2-7b2d-42ae-a517-41dfc8e6a546')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(404)
    expect(response.text)
      .toEqual('{"message":"Could not find a place for the provided id."}')
  })

  it('DELETE /api/places/placeId should delete the place', async () => {
    const response = await supertest(app)
      .delete('/api/places/' + createdPlaceId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual('Deleted the place.')
  })

  it('DELETE /api/places/placeId should not delete place without valid token', async () => {
    const response = await supertest(app)
      .delete('/api/places/' + createdPlaceId)
      .set('Authorization', '')
      .set('Accept', 'application/json')
    expect(response.status).toEqual(401)
    expect(response.text)
      .toEqual('{"message":"Authentication failed."}')
  })
})
