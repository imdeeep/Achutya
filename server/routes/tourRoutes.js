const express = require('express');
const router = express.Router();
const {
  createTour,
  getTours,
  getTour,
  updateTour,
  deleteTour
} = require('../controllers/tourController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - heroImage
 *         - duration
 *         - price
 *         - country
 *         - city
 *         - location
 *         - slug
 *       properties:
 *         title:
 *           type: string
 *         subtitle:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         heroImage:
 *           type: string
 *         duration:
 *           type: string
 *         price:
 *           type: number
 *         originalPrice:
 *           type: number
 *         discount:
 *           type: number
 *         groupType:
 *           type: string
 *           enum: [Group, Individual, Private]
 *         maxGroupSize:
 *           type: number
 *         difficulty:
 *           type: string
 *           enum: [Easy, Moderate, Challenging, Difficult]
 *         rating:
 *           type: number
 *         reviewCount:
 *           type: number
 *         country:
 *           type: string
 *           enum: [India, International]
 *         city:
 *           type: string
 *         location:
 *           type: string
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *         itinerary:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: number
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *               distance:
 *                 type: string
 *               duration:
 *                 type: string
 *               accommodation:
 *                 type: string
 *               meals:
 *                 type: string
 *         inclusions:
 *           type: array
 *           items:
 *             type: string
 *         exclusions:
 *           type: array
 *           items:
 *             type: string
 *         essentials:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: array
 *           items:
 *             type: string
 *         features:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *         isActive:
 *           type: boolean
 *         slug:
 *           type: string
 */

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       201:
 *         description: Tour created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', createTour);

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of tours
 */
router.get('/', getTours);

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     summary: Get a tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour details
 *       404:
 *         description: Tour not found
 */
router.get('/:id', getTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Update a tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *       404:
 *         description: Tour not found
 */
router.put('/:id', updateTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Delete a tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour deleted successfully
 *       404:
 *         description: Tour not found
 */
router.delete('/:id', deleteTour);

module.exports = router;