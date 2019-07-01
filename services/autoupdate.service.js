var Minio = require("minio");

var minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "test1234",
  secretKey: "verysecretkey1234"
});

exports.projectExists = async function(projectId) {
  try {
    const exists = await minioClient.bucketExists(projectId);
    return exists;
  } catch (e) {
    throw Error("ObjectStorage: Failed to query for project bucket");
  }
};

exports.getMetaData = async function(projectId, updatePacketId) {
  try {
    return await minioClient
      .getObject(projectId, updatePacketId + "/meta.json")
      .then(async stream => {
        const meta = await streamToString(stream);
        return JSON.parse(meta);
      })
      .catch(err => {
        if (err.code === "NoSuchKey") {
          return null;
        }
        throw err;
      });
  } catch (e) {
    console.log("exception=", e);
    throw Error("ObjectStorage: Failed to get update packet meta data");
  }
};

exports.getM3UpdateList = async function(projectId, updatePacketId) {
  var updateList = [];
  try {
    return new Promise((resolve, reject) => {
      minioClient
        .listObjectsV2(projectId, updatePacketId, true, "")
        .on("data", async obj => {
          if (obj.name.endsWith("/meta.json")) {
            const meta = await minioClient
              .getObject(projectId, obj.name)
              .then(async stream => {
                const data = await streamToString(stream);
                return JSON.parse(data);
              })
              .catch(err => {
                if (err.code === "NoSuchKey") {
                  return null;
                }
                throw err;
              });
            // console.log("meta=", meta);
            if (meta.type === "M3_UPDATE_PACKET") {
              updateList.push(
                meta.serialNumber +
                  ";" +
                  "/autoupdate/v1/" +
                  projectId +
                  "/" +
                  updatePacketId +
                  "/" +
                  meta.updatePacketFile
              );
            }
          }
        })
        .on("error", reject)
        .on("end", () => {
          console.log("updateList=", updateList);
          resolve(updateList);
        });
    });
  } catch (e) {
    console.log("exception=", e);
    throw Error("ObjectStorage: Failed to get update list");
  }
};

async function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function createUpdateList(stream, projectId, prefix) {
  var updateList = [];
  return new Promise((resolve, reject) => {
    stream.on("data", async obj => {
      if (obj.name.endsWith("/meta.json")) {
        const meta = await minioClient
          .getObject(projectId, obj.name)
          .then(async stream => {
            const data = await streamToString(stream);
            return JSON.parse(data);
          })
          .catch(err => {
            if (err.code === "NoSuchKey") {
              return null;
            }
            throw err;
          });
        console.log("meta=", meta);
        if (meta.type === "M3_UPDATE_PACKET") {
          updateList.push(
            meta.serialNumber +
              ";" +
              "/autoupdate/v1/" +
              projectId +
              "/" +
              prefix +
              "/" +
              meta.updatePacketFile
          );
        }
      }
    });
    stream.on("error", reject);
    stream.on("end", () => {
      console.log("updateList=", updateList);
      resolve(updateList);
    });
  });
}
