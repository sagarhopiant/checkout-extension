import { UserModel } from "../models/index.js";

export const createNewUser = async (req, res) => {
  console.log("call new user api");
  const data = req.body;
  try {
    const newUser = new UserModel({
      name: data.name,
      email: data.email,
    });
    const result = await newUser.save();
    console.log(result);
    res.json({
      status: "success",
      message: "Data inserted successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "fail",
      message: "Fail to insert data",
    });
  }
};
