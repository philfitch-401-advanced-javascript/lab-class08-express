/*eslint-disable new-cap*/
const router = require('express').Router();
const Tree = require('../models/tree');

router
  .post('/', (req, res, next) => {
    Tree.create(req.body)
      .then(tree => res.json(tree))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tree.findById(req.params.id)
      .then(tree => res.json(tree))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tree.find()
      .then(trees => res.json(trees))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Tree.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .then(tree => res.json(tree))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Tree.findByIdAndRemove(req.params.id)
    .then(tree => res.json(tree))
    .catch(next);
  });

  module.exports = router;