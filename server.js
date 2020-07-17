const express = require("express")
const app = express()
const Fs = require("fs")
const cors = require("cors")
const Path = require("path")
const axios = require("axios")
require('dotenv').config();

const REACT_APP_DOLBY_API_KEY = process.env.REACT_APP_DOLBY_API_KEY

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*download() { // Download the enhanced file from the Dolby API and store it in /files
    1. Get storage path
    2. GET - Request enhanced file from Dolby API
    3. Stream the file to the specified path
 }*/

async function download(url) {
  
  const path = Path.resolve(__dirname, "src/files", "enhanced_video.mp4")

  const response = await axios({
    method: "GET",
    url: `https://api.dolby.com/media/output?url=${url}`,
    responseType: "stream",
    headers: {"x-api-key": REACT_APP_DOLBY_API_KEY}
  })

  response.data.pipe(Fs.createWriteStream(path))

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve()
    })
    response.data.on("error", err => {
      reject(err)
    })
  })
}

app.post("/", async function (req, res, next) {
  try {

    download(req.body.url)

    res.json({
      ...req.body,
      newUrl: "/videos/enhanced_video.mp4"
    })
  } catch (e) {
    return next(e);
  }
});

app.listen(5000, () => console.log("Server started port 5000"));