import { Request, Response } from "express";
import { getPostWifhSameTags, getPublishPostBySlug, getPublishPosts } from "../services/postServices";
import { coverToUrl } from "../utils/cover-to-url";

export const getAllPosts = async (req: Request, res: Response) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page as string);
    if (page <= 0) {
      res.json({
        error: "Página nao encotrada",
      });
      return;
    }
  }

  let posts = await getPublishPosts(page);

  const postsToReturn = posts.map((post) => ({
    id: post.id,
    status: post.status,
    title: post.title,
    createdAt: post.createdAt,
    cover: coverToUrl(post.cover),
    authorName: post.author?.name,
    tags: post.tags,
    slug: post.slug,
  }));

  res.json({ posts: postsToReturn, page });
};

export const getPost = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = await getPublishPostBySlug(slug);
  if (!post) {
    res.json({
      error: "post não encontrado",
    });
    return;
  }

  res.json({
    post: {
      id: post.id,
      title: post.title,
      createAt: post.createdAt,
      cover: coverToUrl(post.cover),
      authorName: post.author?.name,
      tags: post.tags,
      body: post.body,
      slug: post.slug,
    },
  });
};

export const getRelatedPosts = async (req: Request, res: Response) => {
  const { slug } = req.params;
  let posts = await getPostWifhSameTags(slug);

  const postsToReturn = posts.map((post) => ({
    id: post.id,
    title: post.title,
    createdAt: post.createdAt,
    cover: coverToUrl(post.cover),
    authorName: post.author?.name,
    tags: post.tags,
    slug: post.slug,
  }));

  res.json({ posts: postsToReturn });
};
