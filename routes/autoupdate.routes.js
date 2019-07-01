var express = require("express");
var router = express.Router();
var AutoUpdateController = require("../controllers/autoupdate.controller");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get(
  "/:projectId/:updatePacketId/list.txt",
  AutoUpdateController.getUpdateList
);

module.exports = router;
