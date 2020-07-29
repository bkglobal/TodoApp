const Config = require("../config/custom.config");
const Database = require("../database/Database");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const forgetPasswordTemplate = require("../email/templates/forgetpassword");
const mailer = require("../email/mailer");

class UserController {
  constructor() {
    this.user = [];
    this.login = this.login.bind(this);
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      await Database.loginUser({ email, password })
        .then((user) => {
          var token = jwt.sign(JSON.stringify(user), "myOwnSecret123");
          Database.updateToken({ ...user, ...{ authToken: token } }).then(
            (_) => {
              return res.status(Config.statusCode.OK).send({
                status: Config.statusCode.OK,
                isSuccess: true,
                result: {
                  message: "Logged In Succesfully",
                  user: { ...user, ...{ authToken: token } },
                },
              });
            }
          );
        })
        .catch((error) => {
          return res.status(Config.statusCode.Internal_Server_Error).send({
            status: Config.statusCode.OK,
            isSuccess: false,
            result: { message: error },
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { username, email, password, device } = req.body;

      await Database.addUser({
        ...{ username, email, password, device },
        ...{
          isActive: 1,
          isVerified: 0,
          verificationToken: "",
          authToken: "",
          createdAt: new Date(),
        },
      })
        .then((_) => {
          return res.status(Config.statusCode.OK).send({
            status: Config.statusCode.OK,
            isSuccess: true,
            result: { message: "User Registered Successfully!" },
          });
        })
        .catch((error) => {
          return res.status(Config.statusCode.Internal_Server_Error).send({
            status: Config.statusCode.Internal_Server_Error,
            isSuccess: false,
            result: { message: error },
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  resetPassword() {
    try {
      const { token, password } = req.params;
      Database.changePassword(token, password)
        .then((_) => {
          return res.status(Config.statusCode.OK).send({
            status: Config.statusCode.OK,
            isSuccess: true,
            result: { message: "Password Reset Successfully!" },
          });
        })
        .catch((error) => {
          return res.status(Config.statusCode.Internal_Server_Error).send({
            status: Config.statusCode.Internal_Server_Error,
            isSuccess: false,
            result: { message: error },
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  resetPasswordRequest() {
    try {
      const { email } = req.body;
      const secretToken = randomstring.generate();

      Database.addTokenToUser(email, secretToken)
        .then((_) => {
          // Get the template of forget password created on email folder... !!!
          const emailTemplate = forgetPasswordTemplate(
            email,
            "http://localhost:3000/",
            secretToken
          );

          // Send email through sendgrid API... !!!
          mailer.sendEmail(
            Config.emailConfig.mailthrough,
            email,
            "Please verify your email!",
            emailTemplate
          );

          return res.status(Config.statusCode.OK).send({
            status: Config.statusCode.OK,
            isSuccess: true,
            result: {
              message:
                "Password Request Added Successfully! Email is send to you",
            },
          });
        })
        .catch((error) => {
          return res.status(Config.statusCode.Internal_Server_Error).send({
            status: Config.statusCode.Internal_Server_Error,
            isSuccess: false,
            result: { message: error },
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  getAllUsers(req, res, next) {
    try {
      return res.status(Config.statusCode.OK).send({
        status: Config.statusCode.OK,
        isSuccess: true,
        result: { data: Database.user },
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
