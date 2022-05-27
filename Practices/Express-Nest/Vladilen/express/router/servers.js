import { Router } from "express"
import { getAll, create, remove } from "../controllers/servers.js"
const router = Router()

//? По даному роуту пишемо контероллер
router.get("/api/server", getAll)

router.post("/api/server", create)

router.delete("/api/server/:id", remove)

//? Зміна конфігурацій в деяких методах
router.put()
router.patch()

export default router
