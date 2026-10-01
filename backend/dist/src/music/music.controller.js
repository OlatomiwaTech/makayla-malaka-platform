import { createRelease, getFeaturedRelease, getPublishedReleaseById, getPublishedReleases, updateRelease, } from './music.service.js';
import { createReleaseSchema, musicListQuerySchema, updateReleaseSchema, } from '../schemas/music.schema.js';
export const create = async (req, res) => {
    const input = createReleaseSchema.parse(req.body);
    const release = await createRelease(input);
    res.status(201).json({
        success: true,
        data: {
            release,
        },
    });
};
export const update = async (req, res) => {
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
export const list = async (req, res) => {
    const query = musicListQuerySchema.parse(req.query);
    const result = await getPublishedReleases(query.page, query.limit);
    res.status(200).json({
        success: true,
        data: result,
    });
};
export const featured = async (_req, res) => {
    const release = await getFeaturedRelease();
    res.status(200).json({
        success: true,
        data: {
            release,
        },
    });
};
export const getOne = async (req, res) => {
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
//# sourceMappingURL=music.controller.js.map