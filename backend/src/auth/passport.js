import dotenv from "dotenv";
dotenv.config(); 


import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { usermodel } from "../models/usermodel.js";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  let user = await usermodel.findOne({ googleId: profile.id });
  if (!user) {
    user = await usermodel.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      picture: profile.photos?.[0]?.value||""
    });
  }
  return done(null, user);
}
));

passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
  const user = await usermodel.findById(id);
  done(null, user);
});