import type {
	Request,
	Response,
} from 'express';

import {
	createRelease,
	getFeaturedRelease,
	getPublishedReleaseById,
	getPublishedReleases,
	updateRelease,
} from './music.service.js';

import {
	createReleaseSchema,
	musicListQuerySchema,
	updateReleaseSchema,
} from '../schemas/music.schema.js';

export const create = async (
	req: Request,
	res: Response,
) => {
	const input = createReleaseSchema.parse(req.body);

	const release = await createRelease(input);

	res.status(201).json({
		success: true,
		data: {
			release,
		},
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
			message: 'Music release id is required.',
		});
	}

	const input = updateReleaseSchema.parse(req.body);

	const release = await updateRelease(id, input);

	res.status(200).json({
		success: true,
		data: {
			release,
		},
	});
};

export const list = async (
	req: Request,
	res: Response,
) => {
	const query = musicListQuerySchema.parse(req.query);

	const result = await getPublishedReleases(
		query.page,
		query.limit,
	);

	res.status(200).json({
		success: true,
		data: result,
	});
};

export const featured = async (
	_req: Request,
	res: Response,
) => {
	const release = await getFeaturedRelease();

	res.status(200).json({
		success: true,
		data: {
			release,
		},
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
			message: 'Music release id is required.',
		});
	}

	const release = await getPublishedReleaseById(id);

	res.status(200).json({
		success: true,
		data: {
			release,
		},
	});
};
