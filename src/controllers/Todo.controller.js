const Config = require("../config/custom.config");
const Database = require("../database/Database");
const moment = require("moment");

class TodoController {
  constructor() {}

  addList(req, res, next) {
    try {
      const { title, description, deadline, type, users } = req.body;

      Database.addList({
        ...{
          title,
          description,
          type,
          deadline: moment(deadline, ["DD-MM-YYYY"]).format("DD-MM-YYYY"),
          users:
            type === Config.TodoListTypes.personalList
              ? req.user.id
              : users
              ? [...users, ...[req.user.id]]
              : [req.user.id],
        },
        ...{ createdAt: new Date(), isActive: 1 },
      }, req.user)
        .then((_) => {
          return res.status(Config.statusCode.OK).send({
            status: Config.statusCode.OK,
            isSuccess: true,
            result: { message: "Todo Added" },
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

  getList(req, res, next) {
    try {
      return res.status(Config.statusCode.OK).send({
        status: Config.statusCode.OK,
        isSuccess: true,
        result: {
          message: "Todo List Found Successfully",
          data: Database.todo,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  updateList(req, res, next) {
    try {
      const { id } = req.body;
      const list = Database.todo.filter((e) => e.id === id)[0];
      if (!list)
        return res.status(Config.statusCode.Internal_Server_Error).send({
          status: Config.statusCode.OK,
          isSuccess: false,
          result: { message: "Id is not available" },
        });
      Database.updateList({ ...list, ...req.body }, req.user)
        .then((_) => {
          return res.status(Config.statusCode.OK).send({
            status: Config.statusCode.OK,
            isSuccess: true,
            result: { message: "List updated Successfully" },
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

  deleteList(req, res, next) {
    try {
      Database.deleteList(req.params.id, req.user);
      return res.status(Config.statusCode.OK).send({
        status: Config.statusCode.OK,
        isSuccess: true,
        result: { message: "Deleted Todo List Successfully" },
      });
    } catch (error) {
      return next(error);
    }
  }

  addColaborators(req, res, next) {
    try {
      const { users } = req.body;
      const { id } = req.params;
      Database.addColaboratorToList(id, users)
        .then((result) => {
          return res.status(Config.statusCode.OK).send({
            status: Config.statusCode.OK,
            isSuccess: true,
            result: { message: "Collaborator added Successfully" },
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
}

module.exports = new TodoController();
