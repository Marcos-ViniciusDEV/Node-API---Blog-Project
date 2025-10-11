import { RequestHandler, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import z from "zod";
import { createPostSlug, handleCover, createPost, getPostBySlug, updatePost, deletePost } from "../services/postServices";
import { getUserById } from "../services/userServices";
import { coverToUrl } from "../utils/cover-to-url";
import slug from "slug";
import { sl } from "zod/v4/locales";
import { getAllPosts } from "../services/postServices";
import { title } from "process";

export const addPost = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const schema = z.object({
      title: z.string(),
      tags: z.string(),
      body: z.string(),
    });

    const data = schema.safeParse(req.body);
    if (!data.success) {
      res.json({ error: data.error.flatten().fieldErrors });
      return;
    }

    if (!req.file) {
      res.json({ error: " Sem arquivo" });
      return;
    }

    //Lidar com arquivo
    const coverName = await handleCover(req.file);
    if (!coverName) {
      res.json({ error: "Imagem não permitida/Enivada" });
      return;
    }
    //Criar o slug do post
    const slug = await createPostSlug(data.data.title);
    //Criar o post
    const newPost = await createPost({
      authorId: req.user.id,
      slug,
      title: data.data.title,
      tags: data.data.tags,
      body: data.data.body,
      cover: coverName,
    });

    // Pegar info do autor

    const author = await getUserById(newPost.authorId);
    //Fazer retorno o seundo o plano

    res.status(201).json({
      post: {
        id: newPost.id,
        slug: newPost.slug,
        title: newPost.title,
        createdAt: newPost.createdAt,
        cover: coverToUrl(newPost.cover),
        tags: newPost.tags,
        authorName: author?.name,
      },
    });
  } catch (err) {
    // console.error("Erro ao criar post:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
export const getPosts = async (req: ExtendedRequest, res: Response) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page as string);
    if (page <= 0) {
      res.json({ error: "pagina inexistente" });
      return;
    }
  }
  let posts = await getAllPosts(page);

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
export const getPost: RequestHandler = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;
  const post = await getPostBySlug(slug);
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

export const editPost: RequestHandler = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const schema = z.object({
    status: z.enum(["DRAFT", "PUBLISH"]).optional(),
    title: z.string().optional(),
    tags: z.string().optional(),
    body: z.string().optional(),
  });

  const data = schema.safeParse(req.body);

  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    res.json({ error: "Post Inexistente " });
    return;
  }

  let coverName: string | false = false;
  if (req.file) {
    coverName = await handleCover(req.file);
  }

  const updatedPost = await updatePost(slug, {
    updateAt: new Date(),
    status: data.data.status ?? undefined,
    title: data.data.title ?? undefined,
    tags: data.data.tags ?? undefined,
    body: data.data.body ?? undefined,
    cover: coverName ? coverName : undefined,
  });

  const author = await getUserById(updatedPost.authorId);

  res.json({
    post: {
      id: updatedPost.id,
      status: updatedPost.status,
      slug: updatedPost.slug,
      title: updatedPost.title,
      createdAt: updatedPost.createdAt,
      cover: coverToUrl(updatedPost.cover),
      tags: updatedPost.tags,
      authorName: author?.name,
    },
  });
};
export const removePost: RequestHandler = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const post = await getPostBySlug(slug);
  if (!post) {
    res.json({ error: "post inexistente" });
    return;
  }

  await deletePost(post.slug);
  res.json({
    post: "deletado ",
  });
};
