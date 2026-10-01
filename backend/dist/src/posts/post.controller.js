import { createPost, deletePost, getPublishedPostById, getPublishedPosts, updatePost, } from './post.service.js';
import { createPostSchema, postListQuerySchema, updatePostSchema, } from '../schemas/post.schema.js';
export const create = async (req, res) => {
    const input = createPostSchema.parse(req.body);
    const post = await createPost(req.user.id, input);
    res.status(201).json({
        success: true,
        data: {
            post,
        },
    });
};
export const update = async (req, res) => {
    const input = updatePostSchema.parse(req.body);
    const postId = req.params.id;
    if (!postId || Array.isArray(postId)) {
        return res.status(400).json({
            success: false,
            message: 'Post id is required.',
        });
    }
    const post = await updatePost(postId, req.user.id, input);
    res.status(200).json({
        success: true,
        data: {
            post,
        },
    });
};
export const remove = async (req, res) => {
    const postId = req.params.id;
    if (!postId || Array.isArray(postId)) {
        return res.status(400).json({
            success: false,
            message: 'Post id is required.',
        });
    }
    await deletePost(postId, req.user.id);
    res.status(200).json({
        success: true,
        message: 'Post deleted successfully.',
    });
};
export const list = async (req, res) => {
    const query = postListQuerySchema.parse(req.query);
    const result = await getPublishedPosts(query.page, query.limit);
    res.status(200).json({
        success: true,
        data: result,
    });
};
export const getOne = async (req, res) => {
    const postId = req.params.id;
    if (!postId || Array.isArray(postId)) {
        return res.status(400).json({
            success: false,
            message: 'Post id is required.',
        });
    }
    const post = await getPublishedPostById(postId);
    res.status(200).json({
        success: true,
        data: {
            post,
        },
    });
};
//# sourceMappingURL=post.controller.js.map