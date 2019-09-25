const request = require('../request');
const db = require('../db');

describe('trees api', () => {

  beforeEach(() => {
    return db.dropCollection('trees');
  });

  const cedar = {
    name: 'cedar',
      appearance: {
        leafType: 'needle',
        leafLobes: 0,
        alternateBranching: true
      },
      lifeCycle: ['coniferous']
  };

  function postTree(tree) {
    return request
      .post('/api/trees')
      .send(tree)
      .expect(200)
      .then(({ body }) => body);
  };

  it('post a tree', () => {
    return postTree(cedar)
      .then(tree => {
        expect(tree).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...cedar
        });
      });
  });

  it('gets a tree by id', () => {
    return postTree(cedar)
      .then(tree => {
        return request.get(`/api/trees/${tree._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(tree);
          });
      });
  });

  it('gets a list of trees', () => {
    return Promise.all([
      postTree({ name: 'cedar' }),
      postTree({ name: 'oak' }),
      postTree({ name: 'douglas fir' }),
    ])
      .then(() => {
        return request
          .get('/api/trees')
          .expect(200);
      })
      .then(({ body}) => {
        expect(body.length).toBe(3);
      });
  });

  it('updates a tree', () => {
    return postTree(cedar)
      .then(tree => {
        tree.lifeCycle = 'deciduous';
        return request
          .put(`/api/trees/${tree._id}`)
          .send(tree)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.lifeCycle).toEqual(['deciduous']);
      });
  })

  it('deletes a tree', () => {
    return postTree(cedar)
      .then(tree => {
        return request
          .delete(`/api/trees/${tree._id}`)
          .expect(200);
      });
  });


});