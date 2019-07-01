var AutoUpdateService = require("../services/autoupdate.service");

exports.getUpdateList = async function(req, res, next) {
  var projectId = req.params.projectId;
  var updatePacketId = req.params.updatePacketId;

  try {
    // Check if meta data for this update exists and are valid
    const meta = await AutoUpdateService.getMetaData(projectId, updatePacketId);
    if (
      meta === null ||
      !meta.type ||
      meta.type !== "M3_UPDATE_LIST" ||
      !meta.updateList
    ) {
      return res.status(404).end();
    }

    // Fetch the M3 update list
    const updateList = await AutoUpdateService.getM3UpdateList(
      projectId,
      updatePacketId
    );
    console.log("ctrl update list=", updateList);

    // Create the update list response
    var updateListContent = "";
    updateList.forEach(el => {
      updateListContent += el + "\n";
    });

    return res
      .set("Content-Type", "text/plain")
      .status(200)
      .send(updateListContent);
  } catch (e) {
    console.log(e);
    return res.status(500).send("technical exception: " + e);
  }
};
