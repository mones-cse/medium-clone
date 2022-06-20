import { TypedObject } from "@sanity/types";
export interface Post {
  _id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author: {
    name: string;
    image: string;
  };
  body: [TypedObject];
  slug: {
    current: string;
  };
  mainImage: {
    asset: {
      ref: string;
    };
  };
  title: string;
  description: string;
}
