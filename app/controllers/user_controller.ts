import UserService from '#services/user_service';
import type { HttpContext } from '@adonisjs/core/http';

export default class UserController {
  async signUp({ request, response }: HttpContext) {
    const { email, password, fullName } = request.only(['email', 'password', 'fullName']);

    const signUpResult = await UserService.signUp({ email, password, fullName, role: 'manager' });
    if (!signUpResult.success) {
      return response.badRequest({ message: signUpResult.error });
    }

    return response.created({ message: 'User created successfully' });
  }

  async signIn({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password']);
    const signInResult = await UserService.signIn({ email, password, auth });

    if (!signInResult.success) {
      return response.badRequest({ message: signInResult.error })
    }

    const { token } = signInResult;

    return response.ok(token);
  }

  async resetPassword({ params, request, response }: HttpContext) {
    const { token } = params;
    const { newPassword } = request.only(['newPassword']);
    const resetPasswordResult = await UserService.resetPassword(token, newPassword);

    if (!resetPasswordResult.success) {
      const error = resetPasswordResult?.error;
      console.log('Error resetting password:', error);
      return response.badRequest({ message: error });
    }

    return response.ok({ message: 'Password reset successfully' });
  }

}
