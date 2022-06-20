import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { GetStaticPaths, GetStaticProps } from "next";
import { Post } from "../../typing";
import { useRouter } from "next/router";
import { PortableText } from "@portabletext/react";
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";

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

interface iFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

const Post = ({ post }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<iFormInput>();
  const router = useRouter();
  const { slug } = router.query;
  const submitFormData: SubmitHandler<iFormInput> = (data) => {
    console.log("submit from data called", { data });
  };
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
        <hr className={"my-5 mx-auto max-w-lg border border-yellow-500"} />
        {/*  ----------------------------------------------------------------------------------------------  */}
        <form
          onSubmit={handleSubmit(submitFormData)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="text"
              placeholder="Enter your name"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              type="email"
              placeholder="Enter your Email"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="Comment...."
              rows={8}
            />
          </label>

          {/* errors will return when field validation fails */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">Name is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">Email is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">Comment is required</span>
            )}
          </div>
          <input
            type="submit"
            className="rounded-md bg-yellow-500 p-2 font-bold tracking-wide text-gray-700 shadow-lg hover:bg-yellow-400 focus:bg-yellow-500"
          />
        </form>
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
