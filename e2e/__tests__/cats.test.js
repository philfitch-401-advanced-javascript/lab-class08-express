const request = require('../request');
const db = require('../db');

describe('cats api', () => {

  beforeEach(() => {
    return db.dropCollection('cats');
  });

  const felix = {
    name: 'felix',
    appearances: {
      pattern: 'tuxedo',
      mainColor: 'black'
    },
    lives: 9,
    hasSidekick: false,
    media: ['movies', 'comics'],
    yearIntroduced: 1919,
  };

  function postCat(cat) {
    return request
      .post('/api/cats')
      .send(cat)
      .expect(200)
      .then(({ body }) => body);
  }

  it('post a cat', () => {
    return postCat(felix)
      .then(cat => {
        expect(cat).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...felix
        });
      });
  });

  it('gets a cat by id', () => {
    return postCat(felix)
      .then(cat => {
        return request.get(`/api/cats/${cat._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(cat);
          });
      });
  });

  it('gets a list of cats', () => {
    return Promise.all([
      postCat({ name: 'cat 1', lives: 9, yearIntroduced: 2019 }),
      postCat({ name: 'cat 2', lives: 9, yearIntroduced: 2019 }),
      postCat({ name: 'cat 3', lives: 9, yearIntroduced: 2019 }),
    ])
      .then(() => {
        return request
          .get('/api/cats')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('updates a cat', () => {
    return postCat(felix)
      .then(cat => {
        cat.lives = 2;
        return request
          .put(`/api/cats/${cat._id}`)
          .send(cat)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.lives).toBe(2);
      });
  });

  it('deletes a cat', () => {
    return postCat(felix)
      .then(cat => {
        return request
          .delete(`/api/cats/${cat._id}`)
          .expect(200);
      });
  });

});