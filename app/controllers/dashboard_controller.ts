import type { HttpContext } from '@adonisjs/core/http'
import JobApplication from '#models/job_application'

export default class DashboardController {
  public async index({ auth }: HttpContext) {
    const user = auth.use('jwt').user!

    if (user.role === 'manager') {
      const applications = await JobApplication.all()
      return {
        role: 'manager',
        applications,
      }
    }

    if (user.role === 'candidate') {
      const applications = await JobApplication.query()
        .where('user_id', user.id)
        .first()

      return {
        role: 'candidate',
        applications,
      }
    }

    return {
      error: 'Unauthorized role',
    }
  }
}
