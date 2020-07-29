var express = require("express");
const UserController = require("../../controllers/User.controller");
const TodoController = require("../../controllers/Todo.controller");
const { check } = require("express-validator");
const Validator = require("../../validations/validator");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const TodoListTypes = require("../../config/custom.config").TodoListTypes;

var router = express.Router();

/* @POST add todo List */
router
  .route("/")
  .post(
    AuthMiddleware.UserAuth,
    [
      check("title").exists().withMessage("Title is required").not().isEmpty(),
      check("description")
        .exists()
        .withMessage("Description is required")
        .not()
        .isEmpty(),
      check("deadline")
        .exists()
        .withMessage("Deadline is required")
        .custom(Validator.dateValidation)
        .withMessage("Date must be valid"),
      check("type")
        .exists()
        .withMessage("Type is required")
        .not()
        .isEmpty()
        .isIn(Object.keys(TodoListTypes)),
    ],
    Validator.validationError,
    TodoController.addList
  )
  .get(AuthMiddleware.UserAuth, TodoController.getList)
  .put(
    AuthMiddleware.UserAuth,
    [check("id").exists().withMessage("Title is required").not().isEmpty()],
    Validator.validationError,
    TodoController.updateList
  );

router.delete("/:id", AuthMiddleware.UserAuth, TodoController.deleteList);

router.put(
  "/list/:id/add-collaborators",
  AuthMiddleware.UserAuth,
  [check("users").exists().withMessage("Users array is required").not().isEmpty().isArray()],
  Validator.validationError,
  TodoController.addColaborators
);

module.exports = router;
