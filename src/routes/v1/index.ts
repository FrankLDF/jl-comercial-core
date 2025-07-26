import { Router } from 'express'
import { clientRouter } from '../../modules/client/routes/client.rout.js'
export const pathClient = '/cliente'

const router = Router()
router.use(pathClient, clientRouter)

export default router
