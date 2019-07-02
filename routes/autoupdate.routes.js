var express = require("express");
var router = express.Router();
var AutoUpdateController = require("../controllers/autoupdate.controller");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

const asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next)

router.get(
  "/:projectId/:updatePacketId/list.txt",
  asyncHandler(AutoUpdateController.getUpdateList)
);

module.exports = router;
