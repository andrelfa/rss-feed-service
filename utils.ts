import axiosInstance from "./axiosInstance";
import { Feed, FeedItemType } from "./types/FeedItem";
import convert, { ElementCompact } from "xml-js";
import dateFns from "date-fns";

const proxyUrl = "https://sheltered-reef-69308.herokuapp.com";

export function convertXmlToJson(data: any): Element | ElementCompact {
  return convert.xml2js(data, { compact: true });
}

export function handleDifferentRSSTypes(data: any): string {
  return data.rss ? data.rss.channel.item : data.feed.entry;
}

export function handleFeedPromiseWithFeedName(
  feedUrl: string,
  feedName: string
): Promise<void | Feed> {
  return axiosInstance
    .get(`${proxyUrl}/${feedUrl}`)
    .then((data) => ({
      feedName,
      data: handleDifferentRSSTypes(convertXmlToJson(data.data)),
    }))
    .catch((err) => console.log({ err }));
}

export function returnFirstKeyFromObject(textFieldObject: any): any {
  if (!textFieldObject) return;
  return Object.keys(textFieldObject).map((key) => textFieldObject[key])[0];
}

function formatDate(date: string): string {
  if (!date) return;
  return dateFns.format(new Date(date), "dd/MM/yyyy");
}

export function prepareFeedCards(feedArray: Feed[]): FeedItemType[] {
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
