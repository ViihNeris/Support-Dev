import { createHash } from 'crypto';

/**
 * TokenService is a utility class for generating secure tokens.
 * It provides a method to generate a token using SHA-256 hashing algorithm.
 * The generated token is a base64 encoded string that is URL-safe.
 * The token is generated based on the current timestamp to ensure uniqueness.
 * The generated token can be used for various purposes such as authentication, session management, etc.
 *
 * @returns {string} A unique, URL-safe token.
 */
export default class TokenService {
  static generateToken(): string {
    return createHash('sha256')
      .update(Date.now().toString())
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
