const request = require('supertest');
import app from './app';

describe('Auth route test', () => {
  it('signup', async done => {
    request(app)
    .post('/auth/signup')
    .send({
      handle: 'susan',
      firstname: 'Susan',
      lastname: 'Parker',
      password: 'susan',
      email: 'susan@test.com',
    })
    .expect(200, done)
  });

  it('login', async done => {
    request(app)
    .post('/auth/login')
    .send({
      handle: 'susan',
      password: 'susan',
    })
    .expect(203, done)
  });

  it('login handle fail', async done => {
    request(app)
    .post('/auth/login')
    .send({
      handle: 'Susan',
      password: 'susan',
    })
    .expect(403, done)
  });

  it('login password fail', async done => {
    request(app)
    .post('/auth/login')
    .send({
      handle: 'susan',
      password: 'Susan',
    })
    .expect(403, done)
  });

  it('login both fail', async done => {
    request(app)
    .post('/auth/login')
    .send({
      handle: 'Susan',
      password: 'Susan',
    })
    .expect(403, done)
  });
});
