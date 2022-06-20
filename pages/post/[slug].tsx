import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { GetStaticPaths, GetStaticProps } from "next";
import { Post } from "../../typing";
import { useRouter } from "next/router";
import { PortableText } from "@portabletext/react";
import Head from "next/head";

interface Props {
  post: Post;
}

// todo handle typescript
const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <img
          alt={value.alt || " "}
          loading="lazy"
          src={urlFor(value)
            .width(320)
            .height(240)
            .fit("max")
            .auto("format")
            .url()}
        />
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className={"text-2xl font-bold my-5"}>{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className={"text-xl font-bold my-3"}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className={" font-bold my-3"}>{children}</h3>
    ),
  },
  marks: {
    // Ex. 1: custom renderer for the em / italics decorator
    em: ({ children }: any) => (
      <em className="text-gray-600 font-semibold">{children}</em>
    ),

    // Ex. 2: rendering a custom `link` annotation
    link: ({ value, children }: any) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          className={"text-blue-500 hover:underline"}
          href={value?.href}
          target={target}
          // @ts-ignore
          rel={target === "_blank" && "noindex nofollow"}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }: any) => <ul className="mt-xl">{children}</ul>,
    number: ({ children }: any) => <ol className="mt-lg">{children}</ol>,

    // Ex. 2: rendering custom lists
    checkmarks: ({ children }: any) => (
      <ol className="m-auto text-lg">{children}</ol>
    ),
  },
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }: any) => (
      <li style={{ listStyleType: "circle" }}>{children}</li>
    ),

    // Ex. 2: rendering custom list items
    checkmarks: ({ children }: any) => <li>✅ {children}</li>,
  },
};

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
          <div className={"max-w-3xl mx-auto px-5 mt-10"}>
            <PortableText value={post.body} components={ptComponents} />
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
    revalidate: 1, // after 1 day it will update old cache
  };
};

export default Post;
