var AutoUpdateService = require("../services/autoupdate.service");

exports.getUpdateList = async function (req, res, next) {
  const projectId = req.params.projectId;
  const updatePacketId = req.params.updatePacketId;

  // Check if meta data for this update exists and are valid
  const meta = await AutoUpdateService.getMetaData(projectId, updatePacketId);
  if (
    meta === null ||
    !meta.kind ||
    meta.kind !== "m3UpdateList"
  ) {
    return res.status(404).end();
  }

  // Fetch the M3 update list
  /*const updateList = await AutoUpdateService.getM3UpdateList(
    projectId,
    updatePacketId
  );
  console.log("ctrl update list=", updateList);

  // Create the update list response
  var updateListContent = "";
  updateList.forEach(el => {
    updateListContent += el + "\n";
  });*/

  var updateListContent = "*;test1.tar";

  return res
    .set("Content-Type", "text/plain")
    .status(200)
    .send(updateListContent);
};
