var req = require("request");
const express = require("express");
const bodyParser = require("body-parser");
var path = require("path");
var Bot = require("./twitch");
var config = require("./config");

// Initialize express and define a port
const app = express();
const requests = [];

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

// Start express on the defined port
app.listen(process.env.PORT || 3000, () => console.log(`🚀 Server running`));

//Finding the obs scene
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//Sending the TTS message to Resemble
function sendText(message) {
  req.post(
    {
      url: `https://app.resemble.ai/api/v1/projects/${config.resembleData.projectID}/clips`,
      form: {
        data: {
          title: "NEW TTS MESSAGE",
          body: message,
          voice: `${config.resembleData.voiceID}`,
        },
        callback_uri: "",
      },
      headers: {
        Authorization: `Token token="${config.resembleData.projectToken}"`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
    (error, _r, body) => {
      if (error) {
        console.error("Failed to request new TTS message", error);
      }
      const projectRequest = JSON.parse(body);
      requests.push(projectRequest.id);
    }
  );
}

//Pushing the TTS mp3 on the api
app.get("/api", (req, res) => {
  console.log("Current requests", requests);
  const oldestId = requests.shift(); // Removes the oldest (first) entry of the array
  if (!oldestId) {
    return res.status(200).json({ link: null });
  }
  retrieveClip(oldestId, (error, link) => {
    if (error) {
      requests.push(oldestId); // Add it back to the start of the queue if it failed
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(200).json({ link });
    }
  });
});

//Retrieving the mp3 and sending it to the api
function retrieveClip(clipId, callback) {
  req.get(
    {
      url: `https://app.resemble.ai/api/v1/projects/74c39483/clips/${clipId}`,
      headers: {
        Authorization: `Token token="${config.resembleData.projectToken}"`,
        "Content-Type": "application/json",
      },
      method: "get",
    },
    (error, _res, body) => {
      if (error) {
        console.error("Failed to retrieve clip audio", error);
        return callback(error);
      }
      const { link } = JSON.parse(body);
      if (!link) {
        return callback(new Error(`Clip ${clipId} is not ready yet.`));
      }
      return callback(null, link);
    }
  );
}

module.exports = {
  retrieveClip,
  sendText,
};