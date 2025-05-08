import type { HttpContext } from '@adonisjs/core/http';
import JobApplicationService from '#services/job_application_service';

export default class JobApplicationsController {
  // Já existente:
  async create({ request, response }: HttpContext) {
    const data = request.only([
      'name',
      'birthDate',
      'email',
      'phone',
      'address',
      'zipCode',
      'educations',
      'skills',
    ]);

    

    const result = await JobApplicationService.createApplication(data);

    if (!result.success) {
      return response.badRequest({ message: result.error });
    }

    return response.ok(result.application);
  }

  
  async approve({ params, response }: HttpContext) {
    const result = await JobApplicationService.approveApplication(Number(params.id));

    if (!result.success) {
      return response.notFound({ message: result.error });
    }

    return response.ok(result.application);
  }

  
  async decline({ params, response }: HttpContext) {
    const result = await JobApplicationService.declineApplication(Number(params.id));

    if (!result.success) {
      return response.notFound({ message: result.error });
    }

    return response.ok(result.application);
  }
}
