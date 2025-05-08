import UserService from '#services/user_service';
import type { HttpContext } from '@adonisjs/core/http';

export default class UserController {

    async signUp({ request, response }: HttpContext) {
        const { email, password, fullName } = request.only(['email', 'password', 'fullName']);

        const data = await UserService.signUp({ email, password, fullName, role: 'manager' });

        if (!data.success) {
            return response.badRequest({ message: data.error });
        }

        return response.created({ message: 'User created successfully' });
    }

    async signIn({ request, response, auth }: HttpContext) {
        const { email, password } = request.only(['email', 'password']);

        const data = await UserService.signIn({ email, password, auth });

        if (!data.success) {
            return response.badRequest({ message: data.error })
        }

        const { token } = data;

        return response.ok(token);
    }

    async resetPassword({ params, request, response }: HttpContext) {
        const { token } = params;
        const { newPassword } = request.only(['newPassword']);
        const data = await UserService.resetPassword(token, newPassword);

        if (!data.success) {
            return response.badRequest({ message: data.error });
        }

        return response.ok({ message: 'Password reset successfully' });
    }

}