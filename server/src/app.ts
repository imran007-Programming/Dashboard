import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "./routes"
import { globalErrorHandler } from './middleware/GlobalError'
const app = express()

// Behind proxies in production (Vercel rewrite -> Render), so req.ip is the real
// client IP for the rate limiter. TRUST_PROXY = number of proxy hops (0 locally).
app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 0))

app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: "ok"
    })
})

app.use("/api", routes)

app.use(globalErrorHandler)

export default app;