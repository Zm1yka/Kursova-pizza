import express from 'express'
import { verifyAuth, optionalAuth } from '../middleware/auth.js'
import * as pizzasController from '../controllers/pizzasController.js'
import * as drinksController from '../controllers/drinksController.js'
import * as toppingsController from '../controllers/toppingsController.js'
import * as cartController from '../controllers/cartController.js'
import * as ordersController from '../controllers/ordersController.js'
import * as usersController from '../controllers/usersController.js'

const router = express.Router()

// Публічні маршрути (не потребують автентифікації)
router.get('/pizzas', pizzasController.getPizzas)
router.get('/pizzas/:id', pizzasController.getPizzaById)
router.get('/drinks', drinksController.getDrinks)
router.get('/toppings', toppingsController.getToppings)

// Захищені маршрути (потребують автентифікації)
router.get('/cart', verifyAuth, cartController.getCart)
router.post('/cart', verifyAuth, cartController.updateCart)
router.delete('/cart', verifyAuth, cartController.clearCart)

router.post('/orders', verifyAuth, ordersController.createOrder)
router.get('/orders', verifyAuth, ordersController.getUserOrders)
router.get('/orders/:id', verifyAuth, ordersController.getOrderById)

router.get('/users/profile', verifyAuth, usersController.getUserProfile)
router.post('/users/profile', verifyAuth, usersController.ensureUserProfile)
router.put('/users/profile/name', verifyAuth, usersController.updateUserName)
router.put('/users/profile', verifyAuth, usersController.updateUserProfile)

export default router

