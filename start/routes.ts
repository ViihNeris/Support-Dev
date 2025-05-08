/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import JobApplicationsController from '#controllers/job_applications_controller';
import { middleware } from './kernel.js';
import DashboardController from '#controllers/dashboard_controller';
const UserController = () => import('#controllers/user_controller')

router.group(() => {
  router.post('signup', [UserController, 'signUp']);
  router.post('signin', [UserController, 'signIn']);
  router.put('/reset-password/:token', [UserController, 'resetPassword']);
}).prefix('/users');

router.post('job-application', [JobApplicationsController, 'create']);

router.group(() => {
  router.put('/job-applications/:id/approve', [JobApplicationsController, 'approve']);
  router.put('/job-applications/:id/decline', [JobApplicationsController, 'decline']);
}).prefix('/applications').use(middleware.auth()).use(middleware.managerOnly());

router.get('/dashboard', [DashboardController, 'index'])
  .use(middleware.auth());
