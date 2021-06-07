import { Router } from 'express'
import * as controller from '../controllers/user.controllers'
const router = Router({ mergeParams: true })

// /api/account
router.route('/')

// /api/account:id
router.route('/:id').patch(controller.updateUser)
// .patch(controller.showEmail)
// .patch(controller.showName)

export default router
