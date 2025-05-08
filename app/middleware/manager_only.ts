// app/middleware/manager_only.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ManagerOnly {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const user = ctx.auth.user as User

    if (!user || user.role !== 'manager') {
      return ctx.response.unauthorized({ message: 'Access restricted to managers only' })
    }

    await next()
  }
}
