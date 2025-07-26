import express, { Application } from 'express'
import routes from '../routes/index.js'
export class Server {
  constructor(
    private app: Application = express(),
    private port: string = process.env.PORT || '8081'
  ) {
    this.config()
    this.routes()
  }

  private config(): void {
    this.app.disable('x-powered-by')
    this.app.use(express.json())
  }

  private routes(): void {
    this.app.use('/api', routes)
  }

  public start(): void {
    const showRunningMessage = () =>
      console.log(`✅ Server running on port ${this.port}`)
    this.app.listen(this.port, showRunningMessage)
  }
}
