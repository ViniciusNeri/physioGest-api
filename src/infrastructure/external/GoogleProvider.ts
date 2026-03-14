import { OAuth2Client } from 'google-auth-library';
import logger from '../logging/Logger.js';

export class GoogleProvider {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    logger.debug("GoogleProvider inicializado", {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI
    });
  }

  async verifyToken(token: string): Promise<any> {
    logger.debug("Verificando token do Google", { tokenLength: token.length });

    try {
      const startTime = Date.now();

      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();
      const duration = Date.now() - startTime;

      if (payload) {
        logger.info("Token do Google verificado com sucesso", {
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          duration: `${duration}ms`
        });
      } else {
        logger.warn("Token do Google verificado mas payload vazio", { duration: `${duration}ms` });
      }

      return payload;
    } catch (error) {
      logger.error("Erro ao verificar token do Google", error, {
        tokenLength: token.length
      });
      throw error;
    }
  }

  getAuthUrl(): string {
    logger.debug("Gerando URL de autorização do Google");

    try {
      const authorizeUrl = this.client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      });

      logger.debug("URL de autorização do Google gerada", {
        urlLength: authorizeUrl.length
      });

      return authorizeUrl;
    } catch (error) {
      logger.error("Erro ao gerar URL de autorização do Google", error);
      throw error;
    }
  }
}