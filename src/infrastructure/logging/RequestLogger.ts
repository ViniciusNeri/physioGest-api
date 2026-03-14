import type { Request, Response, NextFunction } from 'express';
import logger from './Logger.js';

export interface RequestLoggingOptions {
  logRequestBody?: boolean;
  logResponseBody?: boolean;
  logHeaders?: boolean;
  excludePaths?: string[];
  maskFields?: string[];
}

export const createRequestLogger = (options: RequestLoggingOptions = {}) => {
  const {
    logRequestBody = false,
    logResponseBody = false,
    logHeaders = false,
    excludePaths = ['/health', '/favicon.ico'],
    maskFields = ['password', 'token', 'authorization', 'api-key']
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Pular logging para caminhos excluídos
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const requestId = Math.random().toString(36).substring(7);
    const start = Date.now();

    // Log da requisição
    const requestLog: any = {
      requestId,
      method: req.method,
      url: req.url,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentType: req.get('Content-Type'),
      contentLength: req.get('Content-Length')
    };

    if (logHeaders) {
      requestLog.headers = maskSensitiveData(req.headers, maskFields);
    }

    if (logRequestBody && req.body && Object.keys(req.body).length > 0) {
      requestLog.body = maskSensitiveData(req.body, maskFields);
    }

    logger.info(`[REQUEST] ${req.method} ${req.url}`, requestLog);

    // Capturar resposta
    const originalSend = res.send;
    let responseBody: any = null;

    res.send = function(body: any) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;

      const responseLog: any = {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get('Content-Length')
      };

      if (logResponseBody && responseBody) {
        try {
          const parsedBody = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
          responseLog.body = maskSensitiveData(parsedBody, maskFields);
        } catch (error) {
          responseLog.body = '[UNPARSABLE]';
        }
      }

      if (logHeaders) {
        responseLog.headers = maskSensitiveData(res.getHeaders(), maskFields);
      }

      const level = res.statusCode >= 400 ? 'warn' : 'info';
      logger[level](`[RESPONSE] ${req.method} ${req.url} - ${res.statusCode}`, responseLog);
    });

    next();
  };
};

function maskSensitiveData(data: any, maskFields: string[]): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const masked = { ...data };

  for (const field of maskFields) {
    if (masked[field] !== undefined) {
      masked[field] = '***MASKED***';
    }
  }

  // Recursivamente mascarar objetos aninhados
  for (const key in masked) {
    if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key], maskFields);
    }
  }

  return masked;
}