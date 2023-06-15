import mongoose from "mongoose";

export const connectionDb = async () => {
  var connection = false;
  await mongoose
    .connect(
      "mongodb+srv://sagar:sagar@cluster0.sh1h31k.mongodb.net/checkout-ext?retryWrites=true&w=majority"
    )
    .then(() => {
      connection = true;
      console.log("successfully database connection");
    })
    .catch((err) => console.log("err:", err));
  return connection;
};
