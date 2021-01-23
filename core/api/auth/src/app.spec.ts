import request from 'supertest';
import app from './app';

describe('Auth route test', () => {
  it('signup', (done) => {
    request(app)
      .post('/auth/signup')
      .send({
        handle: 'susan',
        firstname: 'Susan',
        lastname: 'Parker',
        password: 'susan',
        email: 'susan@test.com'
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('login', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        handle: 'susan',
        password: 'susan'
      })
      .expect(203)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('login handle fail', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        handle: 'Susan',
        password: 'susan'
      })
      .expect(403)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('login password fail', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        handle: 'susan',
        password: 'Susan'
      })
      .expect(403)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('login both fail', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        handle: 'Susan',
        password: 'Susan'
      })
      .expect(403)
      .expect(403)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });
});
