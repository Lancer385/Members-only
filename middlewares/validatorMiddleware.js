import { body, validationResult } from "express-validator";

const validateSignupInput = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name can not be empty.")
    .bail()
    .isLength({ min: 3, max: 23 })
    .withMessage("First name must be between 3 and 23 characters."),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name can not be empty.")
    .bail()
    .isLength({ min: 3, max: 23 })
    .withMessage("Last name must be between 3 and 23 characters."),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can not be empty.")
    .bail()
    .isLength({ min: 3, max: 23 })
    .withMessage("Username must be between 3 and 23 characters.")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
];

async function validateSignupResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up", {
      errors: errors.array(),
    });
  }
  next();
}

export const signupValidation = [validateSignupInput, validateSignupResult];
