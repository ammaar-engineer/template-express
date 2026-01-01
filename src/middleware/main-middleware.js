import { thisError } from "../error.js"

export const validateRequest = (schemaZod) => (req, res, next) => {
    const result = schemaZod.safeParse(req.body)
    if (!result.success) {
        const zodErrMessage = result.error._zod?.def?.[0]?.message
        thisError(zodErrMessage, 400)
    }
    req.processedData = result.data
    next()
}