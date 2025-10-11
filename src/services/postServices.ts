import { v4 } from "uuid";
import fs from "fs/promises";
import slug from "slug";
import { prisma } from "../libs/prisma";
import { Prisma } from "../generated/prisma";

export const getPublishPostBySlug = async (slug: string) => {
  return await prisma.post.findUnique({
    where: {
      slug,
      status: "PUBLISH",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getPublishPosts = async (page: number) => {
  let perPage: number = 5;
  if (page <= 0) return [];

  return await prisma.post.findMany({
    where: { status: "PUBLISH" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    skip: (page - 1) * perPage,
  });
};

export const getAllPosts = async (page: number) => {
  let perPage: number = 5;
  if (page <= 0) return [];

  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    skip: (page - 1) * perPage,
  });
};

export const getPostBySlug = async (slug: string) => {
  return await prisma.post.findUnique({
    where: {
      slug,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getPostWifhSameTags = async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return [];

  const tags = post.tags.split(",");
  if (tags.length === 0) return [];

  const orConditions = tags.flatMap((tag) => [
    { tags: { equals: tag } },
    { tags: { startsWith: `${tag},` } },
    { tags: { endsWith: `,${tag}` } },
    { tags: { contains: `,${tag},` } },
  ]) as Prisma.PostWhereInput[];

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISH",
      slug: { not: slug },
      OR: orConditions,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });
  return posts;
};

export const handleCover = async (file: Express.Multer.File) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    const coverName = `${v4()}.jpg`;
    try {
      await fs.rename(file.path, `./public/images/covers/${coverName}`);
    } catch (err) {
      return false;
    }
    return coverName;
  }
  return false;
};

export const createPostSlug = async (title: string) => {
  let newSlug = slug(title);
  let keepTrying = true;
  let postCount = 1;
  while (keepTrying) {
    const post = await getPostBySlug(newSlug);
    if (!post) {
      keepTrying = false;
    } else {
      newSlug = slug(`${title} ${++postCount}`);
    }
  }
  return newSlug;
};

type createPostProps = {
  authorId: number;
  slug: string;
  title: string;
  tags: string;
  body: string;
  cover: string;
};

export const createPost = async (data: createPostProps) => {
  return await prisma.post.create({ data });
};

export const updatePost = async (slug: string, data: Prisma.PostUpdateInput) => {
  return await prisma.post.update({
    where: { slug },
    data,
  });
};

export const deletePost = async (slug: string) => {
  return await prisma.post.delete({ where: { slug } });
};
