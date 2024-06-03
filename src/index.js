const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user");
const taskRouterr = require("./routes/task");

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouterr);

app.listen(port, () => {
    console.log("Server is running on PORT :", port);
});