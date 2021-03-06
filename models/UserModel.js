import { userModel } from "./schemas/userSchema.js";

const findUserByUsername = async (userName, cb) => {
  //Check
  const user = await userModel
    .findOne({ userName })
    .then((user) => {
      if (user) return user;
      return false;
    })
    .catch((err) => {
      throw Error("error");
      cb();
    });
  return user;
}; // check
const findUserById = async (id, cb) => {
  // Check
  const user = await userModel
    .findById(id)
    .then((user) => {
      return user;
    })
    .catch((err) => {
      cb();
      throw Error("Internal server error: ->", { err });
    });
  return user;
}; // check
const createUser = (data, cb) => {
  const { userName, password } = data;
  userModel
    .create({ userName, password })
    .then((res) => { 
      if (res) {
        cb({
          userId: true,
          error: false,
          errorMessage: "",
          status: 201,
        });
        return true;
      }
      cb({
        userId: true,
        error: true,
        errorMessage: "User already exist",
        status: 409,
      });
      return false;
    })
    .catch((err) => {
      const errorMessage =
        err.errorMessage || "Internal Server Error at createUser";
      cb({
        userId: false,
        error: true,
        errorMessage,
        status: 500,
      });
      throw new Error(errorMessage, { ...err });
    });
};
const createFav = async (_id, imgId, cb) => {
  return userModel
    .findOneAndUpdate(
      { _id },
      {
        $push: {
          favs: imgId,
        },
      },
      {
        upsert: false,
      }
    )
    .then((res) => {
      if (res) {
        const favs = Array(...res.favs);
        favs.push(imgId);

        cb({
          userId: true,
          updated: true,
          favs,
          error: false,
          errorMessage: "",
          message: "resource created successfully",
          status: 201,
        });
        return true;
      }
      cb({
        userId: false,
        updated: false,
        error: true,
        errorMessage: "User not found",
        status: 404,
      });
      return false;
    })
    .catch((err) => {
      const errorMessage =
        err.errorMessage || "Internal Server Error at createFav";
      cb({
        userId: false,
        error: true,
        errorMessage,
        status: 500,
      });
      throw new Error(errorMessage, { ...err });
    });
};
const deleteFav = async (_id, imgId, cb) => {
  return userModel
    .findOneAndUpdate(
      { _id },
      {
        $pull: {
          favs: imgId,
        },
      },
      {
        upsert: true,
      }
    )
    .then((res) => {
      if (res) {
        const favs = Array(...res.favs)
          .map((el) => (el === imgId ? null : el))
          .filter(Boolean);

        cb({
          userId: true,
          updated: true,
          favs,
          error: false,
          errorMessage: "",
          message: "resource deleted successfully",
          status: 200,
        });
        return true;
      }
      cb({
        userId: false,
        updated: false,
        error: true,
        errorMessage: "User not found",
        status: 404,
      });
      return false;
    })
    .catch((err) => {
      const errorMessage =
        err.errorMessage || "Internal Server Error at deleteFav";
      cb({
        userId: false,
        error: true,
        errorMessage,
        status: 500,
      });
      throw new Error(errorMessage, { ...err });
    });
};
const findFav = async (userId, imgId, cb) => {
  return userModel
    .findOne(
      { _id: userId },
      {
        _id: 0,
        favs: 1,
      }
    )
    .then((res) => {
      if (res.favs) {
        const existFav = res.favs.some((element) => element === imgId);
        if (existFav) {
          return true;
        }
        return false;
      } else {
        cb({
          userId: false,
          updated: false,
          error: true,
          errorMessage: "User not found",
          status: 404,
        });
        return false;
      }
    })
    .catch((err) => {
      const errorMessage =
        err.errorMessage || "Internal Server Error at findFav";
      cb({
        userId: false,
        error: true,
        errorMessage,
        status: 500,
      });
      throw new Error(errorMessage, { ...err });
    });
};
const findAllFavs = async (userId, cb) => {
  return userModel
    .findOne(
      { _id: userId },
      {
        _id: 0,
        favs: 1,
      }
    )
    .then((res) => {
      if (res.favs) {
        cb({
          favs: res.favs,
          userId: true,
          error: false,
          errorMessage: "",
          status: 200,
        });
        return true;
      }
      cb({
        userId: false,
        error: true,
        errorMessage: "User Not Found",
        status: 404,
      });
      return false;
    })

    .catch((err) => {
      const errorMessage =
        err.errorMessage || "Internal Server Error at findAllFavs";
      cb({
        userId: false,
        error: true,
        errorMessage,
        status: 500,
      });
      throw new Error(errorMessage, { ...err });
    });
};

export {
  findUserByUsername,
  createUser,
  createFav,
  deleteFav,
  findUserById,
  findFav,
  findAllFavs,
};
