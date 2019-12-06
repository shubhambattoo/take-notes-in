/* eslint-disable no-console */
require("dotenv").config();

const app = require("./app");

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
