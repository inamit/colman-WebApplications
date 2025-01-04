import { Router } from "express";
const router: Router = Router();
import commentsController from "../controllers/comments_controller";

/**
 * @swagger
 * tags:
 *  name: Comment
 * description: Comments management
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Comment:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         minLength: 24
 *         maxLength: 24
 *       postID:
 *         type: string
 *         minLength: 24
 *         maxLength: 24
 *       content:
 *         type: string
 *       sender:
 *         type: string
 *       __v:
 *         type: integer
 *   CommentInput:
 *     type: object
 *     required:
 *       - content
 *       - sender
 *     properties:
 *       content:
 *         type: string
 *       sender:
 *         type: string
 *  requestBodies:
 *      Comment:
 *          description: Comment object input
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CommentInput'
 */

/**
 * @swagger
 * paths:
 *  /comments:
 *      post:
 *          tags:
 *              - Comment
 *          summary: Add a new comment
 *          description: Add a new comment
 *          operationId: addComment
 *          parameters:
 *              - name: postId
 *                in: query
 *                description: ID of the post to add the comment to
 *                required: true
 *                schema:
 *                  type: string
 *          requestBody:
 *              description: Create a new comment
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CommentInput'
 *              required: true
 *          responses:
 *              '200':
 *                  description: Successful operation
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Comment'
 *              '400':
 *                  description: Invalid input
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 *              '404':
 *                  description: Post not found
 *              '500':
 *                  description: An unexpected error occurred
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/UnexpectedError'
 */
router.post("/", commentsController.saveNewComment);

/**
 * @swagger
 * paths:
 *   /comments:
 *      get:
 *        tags:
 *          - Comment
 *        summary: Get all comments
 *        description: Get all comments from the database
 *        operationId: getAllComments
 *        responses:
 *          '200':
 *            description: Successful operation
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Comment'
 *          '500':
 *            description: An unexpected error occurred
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/", commentsController.getComments);

/**
 * @swagger
 * paths:
 *  /comments/{commentId}:
 *   put:
 *     tags:
 *       - Comment
 *     summary: Updates the entire comment with form data
 *     operationId: updateComment
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     requestBody:
 *       description: Comment updated data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
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
router.put("/:comment_id", commentsController.updateCommentById);

/**
 * @swagger
 * paths:
 *  /comments/{commentId}:
 *   delete:
 *     tags:
 *       - Comment
 *     summary: Delete comment by ID
 *     description: Deletes a comment
 *     operationId: deleteCommentByID
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: ID of comment to delete
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
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.delete("/:comment_id", commentsController.deleteCommentById);

export default router;
