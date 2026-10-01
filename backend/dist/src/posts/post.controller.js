import { createPost, deletePost, getPublishedPostById, getPublishedPosts, updatePost, } from './post.service.js';
import { createPostSchema, postListQuerySchema, updatePostSchema, } from '../schemas/post.schema.js';
export const getAllPosts = async (_req, res, next) => {
    try {
        const parsed = postListQuerySchema.safeParse(_req.query);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination parameters.',
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const result = await getPublishedPosts(parsed.data.page, parsed.data.limit);
        return res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        return next(error);
    }
};
export const getSinglePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: 'Post id is required.',
            });
        }
        const post = await getPublishedPostById(id);
        return res.status(200).json({ success: true, post });
    }
    catch (error) {
        return next(error);
    }
};
export const createNewPost = async (req, res, next) => {
    try {
        const parsed = createPostSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication is required.',
            });
        }
        const post = await createPost(user.id, parsed.data);
        return res.status(201).json({ success: true, post });
    }
    catch (error) {
        return next(error);
    }
};
export const updateExistingPost = async (req, res, next) => {
    try {
        const parsed = updatePostSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication is required.',
            });
        }
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: 'Post id is required.',
            });
        }
        const post = await updatePost(id, user.id, parsed.data);
        return res.status(200).json({ success: true, post });
    }
    catch (error) {
        return next(error);
    }
};
export const deleteExistingPost = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication is required.',
            });
        }
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: 'Post id is required.',
            });
        }
        await deletePost(id, user.id);
        return res.status(200).json({ success: true, message: 'Post deleted successfully.' });
    }
    catch (error) {
        return next(error);
    }
};
//# sourceMappingURL=post.controller.js.map