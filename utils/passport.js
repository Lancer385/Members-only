import { compare } from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByID, getUserByUsername } from "../db/queries.js";
import passport from "passport";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserByID(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
