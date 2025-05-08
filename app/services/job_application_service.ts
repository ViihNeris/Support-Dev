import JobApplication from '#models/job_application';
import PasswordReset from '#models/password_reset';
import UserService from '#services/user_service';
import hash from '@adonisjs/core/services/hash';
import axios from 'axios';
import { addBusinessDays } from 'date-fns';
import EmailService from '#services/email_service';
import TokenService from '#services/token_service';


type CreateApplicationPayload = {
  name: string;
  birthDate: any;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  educations: any[];
  skills: any[];
};

type CreateApplicationResponse =
  | { success: true; application: JobApplication }
  | { success: false; error: string };

type UpdateStatusResponse =
  | { success: true; application: JobApplication }
  | { success: false; error: string };

export default class JobApplicationService {
  static async createApplication(data: CreateApplicationPayload): Promise<CreateApplicationResponse> {
    const existingUser = await UserService.getUserByEmail(data.email.trim().toLowerCase());

    if (existingUser) {
      return { success: false, error: 'E-mail already in use' };
    }

    const createdUser = await UserService.signUp({
      email: data.email.trim().toLowerCase(),
      password: await hash.make(`pwd-${Date.now().toString()}`),
      fullName: data.name,
      role: 'candidate',
    });

    if (!createdUser.success) {
      return { success: false, error: createdUser.error };
    }

    const passwordReset = await PasswordReset.create({ userId: createdUser.user.id, token: TokenService.generateToken() });
    await passwordReset.save();

    try {
      const body = `Olá ${createdUser.user.fullName},\n\nVocê pode redefinir sua senha usando este link:\n\nhttp://localhost:5173/reset-password/${String(passwordReset.token)}\n\nSe não foi você, ignore este e-mail.`;
      await EmailService.sendEmail(createdUser.user.email, "Recuperação de Senha", body);
    } catch (err) {
      console.error("Erro ao enviar o e-mail de recuperação:", err.message);
    }

    const application = await JobApplication.create({
      ...data,
      userId: createdUser.user.id,
      skills: JSON.stringify(data.skills),
      educations: JSON.stringify(data.educations),
      status: 'pending'
    });


    return { success: true, application };
  }

  static async approveApplication(id: number): Promise<UpdateStatusResponse> {
    const application = await JobApplication.find(id);

    if (!application) return { success: false, error: 'Application not found' };

    application.status = 'approved';
    await application.save();


    const interviewDate = addBusinessDays(new Date(), 3);
    const body = `Olá ${application.name},\n\nParabéns! Você foi aprovado para uma entrevista conosco. A entrevista ocorrerá em ${interviewDate.toLocaleDateString()}.\n\nSe você tiver alguma dúvida, não hesite em nos contatar.\n\nAtenciosamente,\nEquipe de Recrutamento`;

    try {
      await EmailService.sendEmail(application.email, "Aprovação para Entrevista", body);
    } catch (err) {
      console.error("Erro ao enviar o e-mail de aprovação:", err.message);
    }

    return { success: true, application };
  }

  static async declineApplication(id: number): Promise<UpdateStatusResponse> {
    const application = await JobApplication.find(id);

    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    application.status = 'refused';
    await application.save();


    return { success: true, application };
  }
}
