import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typing";
import Link from "next/link";

interface Props {
  posts: [Post];
}

const Home: NextPage<Props> = ({ posts }) => {
  console.log({ posts });
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div
        className={
          "flex justify-between items-center bg-yellow-400 border-y border-black  py-10 log:py-0"
        }
      >
        <div className={"px-10 space-y-5"}>
          <h1 className={"text-6xl max-w-xl font-serif"}>
            <span className={"underline decoration-black decoration-4"}>
              Medium
            </span>{" "}
            is a place to write, read and connect{" "}
          </h1>
          <h2>
            Discover stories, thinking, and expertise from writers on any topic.
          </h2>
        </div>
        <img
          className={"hidden md:inline-flex h-32 lg:h-full"}
          src="static/medium_sm_logo.png"
          alt=""
        />
      </div>
      {/*post*/}
      <div
        className={
          " gap-y-4 grid grid-cols-1 p-2 md:grid-cols-2 p-6 gap-4 gap-y-4 lg:grid-cols-3 lg:gap-6 gap-y-6 p-6"
        }
      >
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div
              className={
                "group cursor-pointer border rounded-lg overflow-hidden"
              }
            >
              <img
                className={
                  "h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200"
                }
                src={urlFor(post.mainImage).url()}
                alt=""
              />
              <div className={"flex justify-between p-5 bg-white"}>
                <div>
                  <p className={"text-lg font-bold"}>{post.title}</p>
                  <p className={"text-xs"}>
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className={"h-12 w-12 rounded-full"}
                  src={urlFor(post.author.image).url()}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
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

  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};
export default Home;
