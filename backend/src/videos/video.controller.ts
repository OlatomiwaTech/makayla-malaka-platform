import type { Request, Response } from 'express';

import {
  createVideo,
  getPublishedVideoById,
  getPublishedVideos,
  updateVideo,
} from './video.service.js';

import {
  createVideoSchema,
  updateVideoSchema,
  videoListQuerySchema,
} from '../schemas/video.schema.js';

export const create = async (
  req: Request,
  res: Response,
) => {
  console.log('VIDEO REQUEST BODY:', req.body);

  const input = createVideoSchema.parse(req.body);

  const video = await createVideo(input);

  res.status(201).json({
    success: true,
    data: { video },
  });
};

export const update = async (
  req: Request,
  res: Response,
) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: 'Video id is required.',
    });
  }

  const input = updateVideoSchema.parse(req.body);

  const video = await updateVideo(id, input);

  res.status(200).json({
    success: true,
    data: { video },
  });
};

export const list = async (
  req: Request,
  res: Response,
) => {
  const query = videoListQuerySchema.parse(req.query);

  const result = await getPublishedVideos(
    query.page,
    query.limit,
    query.category,
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
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: 'Video id is required.',
    });
  }

  const video = await getPublishedVideoById(id);

  res.status(200).json({
    success: true,
    data: { video },
  });
};
