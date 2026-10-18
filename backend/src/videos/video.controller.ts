import type { Request, Response } from 'express';

import {
  createVideo,
  deleteVideo,
  getPublishedVideoById,
  getPublishedVideos,
  getManagedVideos,
  previewVideo,
  updateVideo,
} from './video.service.js';

import {
  createVideoSchema,
  updateVideoSchema,
  videoListQuerySchema,
  managedVideoListQuerySchema,
  videoPreviewQuerySchema,
} from '../schemas/video.schema.js';

export const preview = async (req: Request, res: Response) => {
  const query = videoPreviewQuerySchema.parse(req.query);
  const metadata = await previewVideo(query.url);
  res.status(200).json({
    success: true,
    data: { video: metadata },
  });
};

export const create = async (
  req: Request,
  res: Response,
) => {
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

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, message: 'Video id is required.' });
  }

  await deleteVideo(id);
  res.status(200).json({ success: true, message: 'Video deleted.' });
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

export const listManaged = async (req: Request, res: Response) => {
  const query = managedVideoListQuerySchema.parse(req.query);
  const result = await getManagedVideos(query);
  res.status(200).json({ success: true, data: result });
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
