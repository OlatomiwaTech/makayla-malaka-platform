import type { Request, Response } from 'express';

import {
  createPost,
  getPublishedPostById,
  getPublishedPosts,
  updatePost,
} from './post.service.js';

import {
  createPostSchema,
  postListQuerySchema,
  updatePostSchema,
} from '../schemas/post.schema.js';

export const create = async (
  req: Request,
  res: Response,
) => {
  const input = createPostSchema.parse(req.body);

  const post = await createPost(
    req.user!.id,
    input,
  );

  res.status(201).json({
    success: true,
    data: {
      post,
    },
  });
};

export const update = async (
  req: Request,
  res: Response,
) => {
  const input = updatePostSchema.parse(req.body);

  const post = await updatePost(
    req.params.id,
    input,
  );

  res.status(200).json({
    success: true,
    data: {
      post,
    },
  });
};

export const list = async (
  req: Request,
  res: Response,
) => {
  const query = postListQuerySchema.parse(req.query);

  const result = await getPublishedPosts(
    query.page,
    query.limit,
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getOne = async (
  req: Request,
  res: Response,
) => {
  const post = await getPublishedPostById(
    req.params.id,
  );

  res.status(200).json({
    success: true,
    data: {
      post,
    },
  });
};