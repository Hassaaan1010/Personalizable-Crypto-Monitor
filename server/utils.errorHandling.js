const error = {
  BAD_REQUEST: {
    status: 400,
    message: "Invalid Request Parameter",
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Invalid or no JWT provided",
  },
  FORBIDDEN: {
    status: 403,
    message: "You are not authorized to perform this action",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not Found",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
  },
};
Object.freeze(error);

const createErrorObj = (err, message) => {
  if (!err || !err.status || !err.message) return error.INTERNAL_SERVER_ERROR;
  return {
    ...err,
    message: message || err.message,
  };
};

const badRequestErr = (message) => createErrorObj(error.BAD_REQUEST, message);
const unauthorizedErr = (message) =>
  createErrorObj(error.UNAUTHORIZED, message);
const forbiddenErr = (message) => createErrorObj(error.FORBIDDEN, message);
const notFoundErr = (message) => createErrorObj(error.NOT_FOUND, message);
const internalServerErr = (message) =>
  createErrorObj(error.INTERNAL_SERVER_ERROR, message);

const sendErrResp = (res, { status, message }) =>
  res
    .status(status || error.INTERNAL_SERVER_ERROR.status)
    .json(message ? { message } : "");

export {
  badRequestErr,
  unauthorizedErr,
  forbiddenErr,
  notFoundErr,
  internalServerErr,
  sendErrResp,
};
