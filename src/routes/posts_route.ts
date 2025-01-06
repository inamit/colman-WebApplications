import { Router } from "express";
const router: Router = Router();
import postsController from "../controllers/posts_controller";
import authMiddleware from "../utilities/authMiddleware";

/**
 * @swagger
 * tags:
 *  name: Post
 * description: Posts management
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Post:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  minLength: 24
 *                  maxLength: 24
 *              content:
 *                  type: string
 *              sender:
 *                  type: string
 *              __v:
 *                  type: integer
 *      PostInput:
 *          type: object
 *          required:
 *              - content
 *              - sender
 *          properties:
 *              content:
 *                  type: string
 *              sender:
 *                  type: string
 *  requestBodies:
 *      Post:
 *          description: Post object input
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PostInput'
 */

/**
 * @swagger
 * paths:
 *  /posts:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get all posts
 *     description: Get all posts from the database
 *     operationId: getAllPosts
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/", authMiddleware, postsController.getPosts);

/**
 * @swagger
 * paths:
 *  /posts:
 *   post:
 *     tags:
 *       - Post
 *     summary: Add a new post
 *     description: Add a new post
 *     operationId: addPost
 *     requestBody:
 *       description: Create a new post
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.post("/", authMiddleware, postsController.saveNewPost);

/**
 * @swagger
 * paths:
 *  /posts/{postId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get post by postID
 *     description: Returns a single post
 *     operationId: getPostByID
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/:post_id", authMiddleware, postsController.getPostById);

/**
 * @swagger
 * paths:
 *  /posts/{postId}:
 *   put:
 *     tags:
 *       - Post
 *     summary: Updates the entire post with form data
 *     operationId: updatePost
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     requestBody:
 *       description: Post updated data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Missing required parameters
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.put("/:post_id", authMiddleware, postsController.updatePostById);

export default router;
