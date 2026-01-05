import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "./models/userModel.js";
const callbackHandler = (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
};

/* ========= GOOGLE ========= */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.ID_CLIENT,
      clientSecret: process.env.SECRET_CLIENT,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            provider: "google",
            picture: profile.photos?.[0]?.value || null,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

/* ========= FACEBOOK ========= */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email }] });

        if (user) {
          if (!user.facebookId) {
            user.facebookId = profile.id;
            user.provider = "facebook";
            await user.save();
          }
          return done(null, user);
        }

        // Nouveau user
        user = await User.create({
          name: profile.displayName,
          email,
          facebookId: profile.id,
          provider: "facebook",
          picture: profile.photos?.[0]?.value || null,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


/* ========= SESSION ========= */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
