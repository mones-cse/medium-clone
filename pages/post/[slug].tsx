import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { GetStaticPaths, GetStaticProps } from "next";
import { Post } from "../../typing";
import { useRouter } from "next/router";
import { PortableText } from "@portabletext/react";
import { cloneBody } from "next/dist/server/web/spec-compliant/body";
import Head from "next/head";

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div>
      <Header />
      <>
        <Head>
          <title>{post.title} | Next.js Blog Example</title>
          {/* <meta property="og:image" content={post.ogImage.url} /> */}
        </Head>
        <img
          src={urlFor(post.mainImage).url()}
          alt=""
          className={"w-full h-40 object-cover"}
        />
        <article className={"max-w-3xl mx-auto p-5"}>
          <h1 className={"text-3xl mt-10 mb-3"}>{post.title}</h1>
          <h2 className={"text-xl font-light text-gray-500 mb-2"}>
            {post.description}
          </h2>
          <div>
            <img
              src={urlFor(post.author.image).url()}
              alt=""
              className={"h-10 w-10 rounded-full"}
            />
            <p>
              Blog posted by{" "}
              <span className={"text-green-600"}>{post.author.name}</span>{" "}
              published at {post.publishedAt}
            </p>
          </div>
          <div className={"max-w-3xl mx-auto px-5"}>
            <PortableText value={post.body} />
          </div>
        </article>
      </>
    </div>
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
        body,
        description,
        mainImage,
        slug,
        publishedAt
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

{
  /*<>*/
}
{
  /*  <img*/
}
{
  /*    src={urlFor(post.mainImage).url()}*/
}
{
  /*    alt=""*/
}
{
  /*    className={"w-full h-40 object-cover"}*/
}
{
  /*  />*/
}
{
  /*  <article className={"max-w-3xl mx-auto p-5"}>*/
}
{
  /*    <h1 className={"text-3xl mt-10 mb-3"}>{post.title}</h1>*/
}
{
  /*    <h2 className={"text-xl font-light text-gray-500 mb-2"}>*/
}
{
  /*      {post.description}*/
}
{
  /*    </h2>*/
}
{
  /*    <div>*/
}
{
  /*      <img*/
}
{
  /*        src={urlFor(post.author.image).url()}*/
}
{
  /*        alt=""*/
}
{
  /*        className={"h-10 w-10 rounded-full"}*/
}
{
  /*      />*/
}
{
  /*      <p>*/
}
{
  /*        Blog posted by{" "}*/
}
{
  /*        <span className={"text-green-600"}> {post.author.name}</span>{" "}*/
}
{
  /*        published at {post.publishedAt}*/
}
{
  /*      </p>*/
}
{
  /*    </div>*/
}
{
  /*    <PortableText value={post.body} />*/
}
{
  /*  </article>*/
}
{
  /*</>*/
}
