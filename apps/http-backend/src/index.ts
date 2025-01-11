import express from "express";
import authRouter from "./routes/auth-routes";

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/api", authRouter);
app.post("/room", (req: any, res: any)=>{
  res.send("hiii")
});

app.listen(6050, () => {
  console.log("RUNNING HTTP SERVER ON PORT 6050");
});
