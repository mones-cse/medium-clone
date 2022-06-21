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
  comments: [Comment];
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

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}
