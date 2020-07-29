var express = require("express");
const UserController = require("../../controllers/User.controller");
const { check } = require("express-validator");
const Validator = require("../../validations/validator");

var router = express.Router();

/* @POST login user */
router.post(
  "/login",

  UserController.login
);

/* @GET all Users */
router.get("/all", UserController.getAllUsers);

/* @POST register user */
router.post(
  "/register",
  [
    check("email").exists().withMessage("Email is required").isEmail(),
    check("password")
      .exists()
      .withMessage("Password is required")
      .not()
      .isEmpty(),
    check("username")
      .exists()
      .withMessage("Username is required")
      .not()
      .isEmpty(),
    check("device")
      .exists()
      .withMessage("Device is required")
      .isIn(["web", "android", "ios"]),
  ],
  Validator.validationError,
  UserController.register
);

/* @PUT reset password with email */
router.put(
  "/reset-password/request",
  [check("email").exists().withMessage("Email is required").isEmail()],
  Validator.validationError,
  UserController.resetPasswordRequest
);

/* @PUT reset password endpoint */
router.put(
  "/reset-password/:token",
  [
    check("password")
      .exists()
      .withMessage("Password is required")
      .not()
      .isEmpty(),
  ],
  Validator.validationError,

  UserController.resetPassword
);

module.exports = router;
