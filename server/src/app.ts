import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "./routes"
import { globalErrorHandler } from './middleware/GlobalError'
const app = express()

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