const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('./db');
module.exports = router;

passport.use(
	new GoogleStrategy(
		{
			clientID: '607247556638-l93f1mu7k987qhuimbrask0j4d1cf93a.apps.googleusercontent.com',
			clientSecret: 'jIszs6e60Ium9u5E4PaBaOhC',
			callbackURL: 'http://localhost:3000/auth/google/callback'
		},
		async (token, refreshToken, profile, done) => {
			console.log('--', 'in verification callback', profile, '--');
			try {
        const { id, emails } = profile;
				const [ instance, wasCreated ] = await User.findOrCreate({
					where: {
						googleId: id
          },
          defaults: { email: emails[0].value }
				});
				done(null, instance);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user)
	}
	catch (error) {
		done(error);
	}
});

router.get('/', passport.authenticate('google', { scope: 'email' }));

router.get(
	'/callback',
	passport.authenticate('google', {
		successRedirect: '/home',
		failureRedirect: '/'
	})
);
