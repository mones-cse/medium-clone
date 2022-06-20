export interface Post {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    image: string;
  };
  body: [object];
  slug: {
    current: string;
  };
  mainImage: {
    asset: {
      ref: string;
    };
  };
  title: string;
}
