const axiosInstance = require("./axiosInstance");
// const axios = require('axios')
const convert = require("xml-js");
const dateFns = require("date-fns");

const proxyUrl = "https://sheltered-reef-69308.herokuapp.com";

// const axiosInstance = axios.create({
//   headers: {'X-Requested-With': 'XMLHttpRequest'}
// })

function convertXmlToJson(data) {
  return convert.xml2js(data, { compact: true, spaces: 4 });
}

function handleDifferentRSSTypes(data) {
  return data.rss ? data.rss.channel.item : data.feed.entry;
}

function handleFeedPromiseWithFeedName(feedUrl, feedName) {
  return axiosInstance
    .get(`${proxyUrl}/${feedUrl}`)
    .then((data) => ({
      feedName,
      data: handleDifferentRSSTypes(convertXmlToJson(data.data)),
    }))
    .catch((err) => console.log({ err }));
}

function returnFirstKeyFromObject(textFieldObject) {
  if (!textFieldObject) return;
  return Object.keys(textFieldObject).map((key) => textFieldObject[key])[0];
}

function formatDate(date) {
  if (!date) return;
  return dateFns.format(new Date(date), "dd/MM/yyyy");
}

function prepareFeedCards(feedArray) {
  return feedArray
    .map(({ data, feedName }) =>
      data.map((feedItem) => {
        return {
          feedName,
          title: returnFirstKeyFromObject(feedItem.title),
          description:
            returnFirstKeyFromObject(feedItem.description) ||
            returnFirstKeyFromObject(feedItem.content),
          link: returnFirstKeyFromObject(feedItem.link),
          pubDate: new Date(
            returnFirstKeyFromObject(feedItem.pubDate || feedItem.published)
          ),
          formattedPubDate: formatDate(
            returnFirstKeyFromObject(feedItem.pubDate || feedItem.published)
          ),
        };
      })
    )
    .reduce(function (arr, row) {
      return arr.concat(row);
    }, [])
    .sort((a, b) => {
      const aDate = new Date(a.pubDate);
      const bDate = new Date(b.pubDate);
      if (aDate < bDate) return 1;
      if (bDate < aDate) return -1;
      return 0;
    });
}

module.exports = {
  convertXmlToJson,
  handleDifferentRSSTypes,
  handleFeedPromiseWithFeedName,
  prepareFeedCards,
};
