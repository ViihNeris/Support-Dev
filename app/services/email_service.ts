import axios from 'axios';

/**
 * EmailService is a class that provides a method to send emails using an external API.
 * It uses the axios library to make HTTP requests.
 * The sendEmail method constructs a URL with the recipient's email and subject,
 * and sends a POST request to the specified endpoint with the email body.
 * The method is asynchronous and returns a Promise that resolves when the email is sent.
 * It also handles potential errors during the email sending process.
 *
 * @param to - The recipient's email address.
 * @param subject - The subject of the email.
 * @param body - The body content of the email.
 * @throws Error if the email sending fails.
 */
export default class EmailService {
  static async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const url = `https://mssbdel1hl.execute-api.us-east-1.amazonaws.com/default/emailpassword?email=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}`;
      console.log("Enviando e-mail...");
      console.log("URL:", url);
      await axios.post(url, body, { headers: { 'Content-Type': 'text/plain' } });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
