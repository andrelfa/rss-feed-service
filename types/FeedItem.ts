export type Feed = {
  feedName: string;
  data: any;
};

export type FeedItemType = {
  feedName: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  formattedPubDate: string;
};
