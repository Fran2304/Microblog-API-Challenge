import { Router } from 'express'
const controller = (req: any, res: any) => {
    res.send({ me: 'hello' })
}
const router = Router()

// /api/account
router.route('/').get(controller).post(controller)

// /api/account:id
router.route('/:id').put(controller).delete(controller).get(controller)

export default router
