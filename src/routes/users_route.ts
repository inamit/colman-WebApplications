import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";

/**
 * @swagger
 * tags:
 *  name: User
 * description: Users management
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          minLength: 24
 *          maxLength: 24
 *        username:
 *          type: string
 *          description: must be unique
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        __v:
 *          type: integer
 *    UserInput:
 *      type: object
 *      required:
 *        - username
 *        - email
 *        - password
 *      properties:
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 */

/**
 * @swagger
 * paths:
 *  /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Get all users from the database
 *     operationId: getAllUsers
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/", usersController.getAllUsers);

/**
 * @swagger
 * paths:
 *  /users:
 *   post:
 *     tags:
 *       - User
 *     summary: Register new user
 *     description: Register new user
 *     operationId: register
 *     requestBody:
 *       description: Register new user
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.post("/", usersController.registerNewUser);

/**
 * @swagger
 * paths:
 *  /users/{userId}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User by userID
 *     description: Returns a single user
 *     operationId: getUserByID
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of User to return
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
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/:user_id", usersController.getUserById);

/**
 * @swagger
 * paths:
 *  /users/{userId}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Updates the user's data
 *     operationId: updateUser
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of user to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     requestBody:
 *       description: User updated data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Missing required parameters
 *       '404':
 *         description: User not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.patch("/:user_id", usersController.updateUserById);

/**
 * @swagger
 * paths:
 *  /users/{userId}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by ID
 *     description: Deletes a user
 *     operationId: deleteUserByID
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of user to delete
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
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.delete("/:user_id", usersController.deleteUserById);

/**
 * @swagger
 * paths:
 *  /users/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User login
 *     description: User login
 *     operationId: login
 *     requestBody:
 *       description: User login
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                  accessToken:
 *                      type: string
 *                      example: "Bearer aaaaaaa"
 *                  refreshToken:
 *                      type: string
 *                      example: "Bearer aaaaaaa"
 *                  message:
 *                      type: string
 *                      example: "logged in successfully."
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: User not found
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
router.post("/login", usersController.login);

/**
 * @swagger
 * paths:
 *  /users/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: User logout
 *     description: User logout
 *     operationId: logout
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.post("/logout", usersController.logout);

export default router;
