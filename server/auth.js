const router = require('express').Router()
const {User} = require('./db')
module.exports = router

const userNotFound = next => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
}

router.use('/google', require('./oauth'))

router.get('/me', (req, res, next) => {
  if (!req.user) {
    userNotFound(next)
  } else {
    // User.findById(req.session.userId)
    //   .then(user => user ? res.json(user) : userNotFound(next))
    //   .catch(next)
    res.json(req.user);
  }
})


router.put('/login', (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
    .then(user => {
      if (user) {
        // req.session.userId = user.id
        req.login(user, function(err) {
          if (err) { return next(err); }
          return res.json(user);
        });
      } else {
        const err = new Error('Incorrect email or password!')
        err.status = 401
        next(err)
      }
    })
    .catch(next)
})

router.delete('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy()
  res.status(204).end()
})
