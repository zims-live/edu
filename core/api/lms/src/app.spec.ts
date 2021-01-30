import request from 'supertest';
import app from './app';

describe('LMS test', () => {
  it('create school', (done) => {
    request(app)
      .post('/schools')
      .send({
        name: 'School2',
        country: 'Country1',
        city: 'City1',
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('list schools', (done) => {
    request(app)
      .get('/schools')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('create module without grade', (done) => {
    request(app)
      .post('/modules')
      .send({
        name: 'Module2',
        schoolid: 2
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('create module with grade', (done) => {
    request(app)
      .post('/modules')
      .send({
        name: 'Module3',
        schoolid: 2,
        grade: 12
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });
});
