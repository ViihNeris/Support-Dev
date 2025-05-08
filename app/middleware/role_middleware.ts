import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class RoleMiddleware {
  constructor(private requiredRole: string) {}

  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const user = ctx.auth.user as User;

    if (!user || user.role !== this.requiredRole) {
      return ctx.response.unauthorized({ message: `Access restricted to ${this.requiredRole}s only` });
    }

    await next();
  }
}
