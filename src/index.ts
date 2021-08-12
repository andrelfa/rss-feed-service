import express from "express";
const app = express();
const port = 3000;
const cors = require("cors");
import * as utils from "../utils";

const allowedOrigins = ["http://localhost:3001"];

const options = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(express.json());

const rssFeeds = [
  utils.handleFeedPromiseWithFeedName(
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "BBC - UK"
  ),
  utils.handleFeedPromiseWithFeedName("http://kotaku.com/vip.xml", "Kotaku"),
  utils.handleFeedPromiseWithFeedName("http://www.b9.com.br/feed/", "B9"),
  utils.handleFeedPromiseWithFeedName(
    "http://www.vox.com/rss/index.xml",
    "Vox"
  ),
  utils.handleFeedPromiseWithFeedName(
    "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml",
    "NY Times"
  ),
  utils.handleFeedPromiseWithFeedName("https://g1.globo.com/rss/g1/", "G1"),
  utils.handleFeedPromiseWithFeedName(
    "https://www.wired.com/feed/rss",
    "Wired"
  ),
  utils.handleFeedPromiseWithFeedName(
    "https://rss.tecmundo.com.br/feed",
    "Tecmundo"
  ),
  utils.handleFeedPromiseWithFeedName(
    "https://www.polygon.com/rss/stream/3550099",
    "Polygon"
  ),
];

app.get("/rss-feed", (req, res) => {
  Promise.allSettled(rssFeeds)
    .then((feeds) => utils.prepareFeedCards(feeds))
    .then((data) => res.send(data))
    .catch((error) => console.log("Promise all throwed an error: ", error));
});

app.listen(port, () => {
  console.log("Server started at port 3000");
});
