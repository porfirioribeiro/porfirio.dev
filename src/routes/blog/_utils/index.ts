import { promises as fs } from "fs";
import path from "path";
import frontMatter, { FrontMatterResult } from "front-matter";
import formatDate from "date-fns/format";
import readingTime from "reading-time";
import marked from "marked";
import { renderer } from "./marked";

import type { Post } from "./post";

marked.setOptions({ renderer });

const postsDir = path.resolve(process.cwd(), "src/posts");
let postPromise: Promise<Post[]>;

function loadPosts(): Promise<Post[]> {
  return (
    postPromise ||
    (postPromise = fs
      .readdir(postsDir)
      .then((files) => Promise.all(files.map(processPost))))
  );
}

export const getPosts = () => loadPosts();

export const getPost = async (slug: string): Promise<Post | undefined> =>
  loadPosts().then((posts) => posts.find((p) => p.slug === slug));

async function processPost(file: string): Promise<Post> {
  const filePath = path.resolve(postsDir, file);
  const slug = file.replace(/\.md$/i, "");

  const { attributes, body } = await fs
    .readFile(filePath, { encoding: "utf8" })
    .then<FrontMatterResult<FrontMatterTypes>>(frontMatter);

  const html = marked(body).replace(/^\t{3}/gm, "");
  const readingStats = readingTime(body);
  const date = formatDate(new Date(attributes.date), "MMMM d, yyyy");

  return {
    slug,
    title: attributes.title,
    date,
    html,
    readingTime: readingStats.text,
  };
}

interface FrontMatterTypes {
  title: string;
  date: string;
}
