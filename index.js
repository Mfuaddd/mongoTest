import express from "express";
import mongoose, { Schema } from "mongoose";
import "dotenv/config";
const app = express();
const port = process.env.PORT;
const dbURL = process.env.DB_URL;

app.use(express.json());

mongoose
  .connect(dbURL)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err.message));

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  isMarried: Boolean,
});

const userModel = mongoose.model("Users", userSchema);

app.get("/", async (req, res) => {
  res.status(200).send(await userModel.find({}));
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).send(await userModel.findById(id));
});

app.post("/", async (req, res) => {
  const { username, email, password, age, isMarried } = req.body;
  const newUser = new userModel({
    username,
    email,
    password,
    age,
    isMarried,
  });
  await newUser.save();
  res.status(200).send("Got a POST request");
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password, age, isMarried } = req.body;
  await userModel.findByIdAndUpdate(id, {
    username,
    email,
    password,
    age,
    isMarried,
  });
  res.status(200).send("Got a PUT request");
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await userModel.findByIdAndDelete(id);
  res.status(200).send("Got a DELETE request");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
