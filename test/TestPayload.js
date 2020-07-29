module.exports.payloadTitle = [
  "Register User",
  "Get All Users",
  "Login User",
  "Add List in Todo List",
  "Get All Todo Lists",
  "Update Todo List",
  "Delete Todo List",
  "Adding New Collaborator",
];
module.exports.getPayloads = function (token) {
  return [
    [
      {
        request: {
          method: "POST",
          url: "/api/v1/user/register",
          headers: { "Content-Type": "application/json" },
          body: {
            username: "Muhammad Bilal",
            email: "khatribilal9@gmail.com",
            password: "Bilal123",
            device: "android",
          },
        },
        response: {
          status: 200,
          isSuccess: true,
          result: { message: "User Registered Successfully!" },
        },
      },
    ],
    [
      {
        request: {
          method: "GET",
          url: "/api/v1/user/all",
          headers: {},
          body: {},
        },
        response: { status: 200, isSuccess: true, result: { data: [] } },
      },
    ],
    [
      {
        request: {
          method: "POST",
          url: "/api/v1/user/login",
          headers: { "Content-Type": "application/json" },
          body: { email: "khatribilal9@gmail.com", password: "Bilal123" },
        },
        response: {
          status: 200,
          isSuccess: true,
          result: { message: "Logged In Succesfully" },
        },
      },
    ],
    [
      {
        request: {
          method: "POST",
          url: "/api/v1/todo",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: {
            title: "My First Todo Lists",
            description: "This is my first todo list",
            deadline: "30/7/2020",
            type: "personalList",
            users: [1, 2, 3],
          },
        },
        response: {
          status: 500,
          isSuccess: true,
          result: {
            message: "Todo Added",
          },
        },
      },
      {
        request: {
          method: "POST",
          url: "/api/v1/todo",
          headers: {
            "Content-Type": "application/json",
            Authorization: "",
          },
          body: {
            title: "My First Todo Lists",
            description: "This is my first todo list",
            deadline: "30/7/2020",
            type: "personalList",
            users: [1, 2, 3],
          },
        },
        response: {
          status: 403,
          message: "Unauthorized",
        },
      },
    ],
    [
      {
        request: {
          method: "GET",
          url: "/api/v1/todo",
          headers: {
            Authorization: token,
          },
          body: {},
        },
        response: {
          status: 200,
          isSuccess: true,
          result: {
            message: "Todo List Found Successfully",
            data: [],
          },
        },
      },
      {
        request: {
          method: "GET",
          url: "/api/v1/todo",
          headers: {
            Authorization: "",
          },
          body: {},
        },
        response: {
          status: 403,
          message: "Unauthorized",
        },
      },
    ],
    [
      {
        request: {
          method: "PUT",
          url: "/api/v1/todo",
          headers: {
            Authorization: token,
          },
          body: {
            id: 0,
            title: "My First Todo Lists Updated",
            description: "This is my first todo list",
          },
        },
        response: {
          status: 200,
          isSuccess: true,
          result: {
            message: "List updated Successfully",
          },
        },
      },
    ],
    [
      {
        request: {
          method: "DELETE",
          url: "/api/v1/todo/0",
          headers: {
            Authorization: token,
          },
          body: {},
        },
        response: {
          status: 200,
          isSuccess: true,
          result: {
            message: "Deleted Todo List Successfully",
          },
        },
      },
    ],
    [
      {
        request: {
          method: "PUT",
          url: "/api/v1/todo/list/0/add-collaborators",
          headers: {
            Authorization: token,
          },
          body: {
            users: [1, 3, 4],
          },
        },
        response: {
          status: 500,
          isSuccess: false,
          result: {
            message: "Sorry! The Todo List is Personal",
          },
        },
      },
      {
        request: {
          method: "PUT",
          url: "/api/v1/todo/list/1/add-collaborators",
          headers: {
            Authorization: token,
          },
          body: {
            users: [1, 3, 4],
          },
        },
        response: {
          status: 200,
          isSuccess: true,
          result: {
            message: "Collaborator added Successfully",
          },
        },
      },
    ],
  ];
};
