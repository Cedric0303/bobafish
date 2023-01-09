require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const loginRouter = require("./routes/loginRouter.js");
const userRouter = require("./routes/userRouter.js");
const stageRouter = require("./routes/stageRouter.js");
const clientRouter = require("./routes/clientRouter.js");
const activityRouter = require("./routes/activityRouter.js");
const orderRouter = require("./routes/orderRouter.js");

require("./auth/auth.js");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
    cors({
        credentials: true,
        origin: "*",
    })
);
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.use("/api/account", loginRouter);

app.use(
    "/api/users",
    passport.authenticate("jwt", { session: false }),
    userRouter
);

app.use(
    "/api/stages",
    passport.authenticate("jwt", { session: false }),
    stageRouter
);

app.use(
    "/api/clients",
    passport.authenticate("jwt", { session: false }),
    clientRouter
);

app.use(
    "/api/activities",
    passport.authenticate("jwt", { session: false }),
    activityRouter
);

app.use(
    "/api/orders",
    passport.authenticate("jwt", { session: false }),
    orderRouter
);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

module.exports = app;
