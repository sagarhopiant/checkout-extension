import { UserModel } from "../models/index.js";

export const getAllUsers = async (req, res) => {
  try {
    const result = await UserModel.find({});

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Fail to get data",
    });
  }
};
