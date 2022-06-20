import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import { sanityClient } from "../sanity";
import { Post } from "../typing";

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
