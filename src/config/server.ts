import express, { Application } from 'express'
import routes from '../routes/index.js'
import prisma from './prismaConnect.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import { responseHandler } from '../common/middlewares/responseMiddleware.js'
import { errorMiddleware } from '../common/middlewares/errorMiddleware.js'
export class Server {
  constructor(
    private app: Application = express(),
    private port: string = process.env.PORT || '8081',
  ) {
    this.config()
    this.routes()
    this.handleProcessSignals()
  }

  private config(): void {
    this.app.disable('x-powered-by')
    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    )
    this.app.use(morgan('dev'))
  }

  private routes(): void {
    this.app.use(responseHandler)
    this.app.use('/api', routes)
    this.app.use(errorMiddleware)
  }

  private handleProcessSignals(): void {
    process.on('SIGINT', async () => {
      await prisma.$disconnect()
      console.log('🛑 Database disconnected (SIGINT)')
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await prisma.$disconnect()
      console.log('🛑 Database disconnected (SIGTERM)')
      process.exit(0)
    })
  }

  private async connectDB(): Promise<void> {
    try {
      await prisma.$connect()
      console.log('🖥️ Database connected successfully')
    } catch (error) {
      console.log('❌ Database connection failed:', error)
      process.exit(1)
    }
  }

  public start(): void {
    this.connectDB()
    this.app.listen(this.port, () =>
      console.log(`✅ Server running on port ${this.port}`),
    )
  }
}
