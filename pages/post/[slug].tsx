import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { GetStaticPaths, GetStaticProps } from "next";
import { Post } from "../../typing";
import { useRouter } from "next/router";

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const router = useRouter();
  const { slug } = router.query;
  console.log({ post });
  return (
    <main>
      <Header />
      <div>{slug}</div>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const queryForAllPost = `*[_type == "post"]{
        _id,
        slug{current}
    }`;
  const posts = await sanityClient.fetch(queryForAllPost);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
      id: post._id,
    },
  }));

  return {
    paths,
    fallback: "blocking", // false or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params && context.params.slug;
  const queryForPost = `*[_type == "post" && slug.current=="${slug}"][0]{
          _id,
          title,
          author -> {
          name,
          image
          },
        description,
        mainImage,
        slug
        }`;
  const post = await sanityClient.fetch(queryForPost);
  if (post.length == 0) {
    return {
      notFound: true,
    };
  }
  return {
    props: { post }, // will be passed to the page component as props
    revalidate: 60 * 60 * 24, // after 1 day it will update old cache
  };
};

export default Post;
