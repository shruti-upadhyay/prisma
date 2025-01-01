import {Router, Router} from 'express'
import {createUser, updateUser, fetchUsers} from '../Controller/usercontroller.js'

const router = Router()
router.get("/" , fetchUsers);
router.post("/" , createUser);
router.put("/id", updateUser)

export default router