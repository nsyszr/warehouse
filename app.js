var express = require("express");
var app = express();
var autoupdate = require("./routes/autoupdate.routes");

/*app.get("/", function(req, res) {
  res.send("Hello World!");
});*/
app.use("/autoupdate/v1", autoupdate);
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
