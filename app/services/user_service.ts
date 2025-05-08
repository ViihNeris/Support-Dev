import PasswordReset from '#models/password_reset';
import User from '#models/user';
import hash from '@adonisjs/core/services/hash';

type SignUpResponse = | { success: true; user: User } | { success: false; error: string };
type SignInResponse = | { success: true; token: string } | { success: false; error: string };

export default class UserService {

  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findBy('email', email);
    return user;
  }

  static async signUp({
    email,
    password,
    fullName,
    role
  }: {
    email: string;
    password: string;
    fullName: string;
    role: 'manager' | 'candidate'
  }): Promise<SignUpResponse> {

    // Validate email and password format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    // Validate email format
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Validate password strength
    if (!passwordRegex.test(password)) {
      return { success: false, error: 'Invalid password format' };
    }

    // Check if the email is already in use
    const existingUser = await User.findBy('email', email);

    if (existingUser) {
      return { success: false, error: 'E-mail already in use' };
    }

    const user = await User.create({
      email,
      password: await hash.make(password),
      fullName,
      role
    });

    return { success: true, user };
  }

  static async signIn({
    email,
    password,
    auth
  }: {
    email: string;
    password: string;
    auth: any;
  }): Promise<SignInResponse> {

    // Validate email and password format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate email format
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    const user = await User.findBy('email', email);

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const passwordVerified = await hash.verify(user.password, password);

    if (!passwordVerified) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = await auth.use('jwt').generate(user);

    return { success: true, token };
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {

    const passwordReset = await PasswordReset.query()
      .where('token', token)
      .first();

    if (!passwordReset) {
      return { success: false, error: 'Invalid or expired token' };
    }

    const user = await User.find(passwordReset.userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const newPasswordHash = await hash.make(newPassword);
    user.password = newPasswordHash;
    await user.save();

    return { success: true };
  }

}
