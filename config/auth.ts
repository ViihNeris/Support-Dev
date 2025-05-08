import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'
import { JwtGuardUser, BaseJwtContent } from '@maximemrf/adonisjs-jwt/types'
import User from '#models/user'

interface JwtContent extends BaseJwtContent {
  email: string,
  role: 'manager' | 'candidate',
  fullName: string | null,
}

const authConfig = defineConfig({
  // Define o autenticador padrão como JWT
  default: 'jwt',

  guards: {
    // Autenticador de sessão (web)
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    }),

    // Autenticador JWT
    jwt: jwtGuard({
      tokenExpiresIn: '1h',
      useCookies: false,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
      content: <T>(user: JwtGuardUser<T>): JwtContent => {
        return {
          userId: user.getId(),
          email: (user.getOriginal() as User).email,
          role: (user.getOriginal() as User).role,
          fullName: (user.getOriginal() as User).fullName,
        }
      },
    }),
  },
})

export default authConfig
