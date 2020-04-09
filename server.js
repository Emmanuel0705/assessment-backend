const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,(console.log(`app is running on port ${PORT}`)));
