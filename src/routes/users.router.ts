import { Router } from 'express'
import * as controller from '../controllers/user.controllers'
const router = Router({ mergeParams: true })

// /api/account
router.route('/').get(controller.getUser).post(controller.createUser)

// /api/account:id
router.route('/:id').put(controller.updateUser).get(controller.getUser)

export default router
