import express from "express";
import cors from "cors";

const allRouter = async (app) => {
  app.use(cors());
  //Here we are configuring express to use body-parser as middle-ware.
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.get("/api/checkApi", async (req, res) => {
    res.status(200).json({
      message: "Success in GET api check",
    });
  });
};

export default allRouter;
