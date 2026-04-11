import logger from '../logging/Logger.js';
export class EmailProvider {
    apiKey;
    baseUrl;
    constructor() {
        this.apiKey = (process.env.BREVO_API_KEY || '').trim();
        this.baseUrl = 'https://api.brevo.com/v3';
        const maskedKey = this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NÃO DEFINIDA';
        logger.info(`EmailProvider: Inicializado. API Key: ${maskedKey}`, {
            baseUrl: this.baseUrl,
            fromEmail: process.env.BREVO_FROM_EMAIL
        });
    }
    async sendEmail(message) {
        logger.debug("Enviando email via Brevo", {
            to: message.to,
            subject: message.subject
        });
        if (!this.apiKey) {
            logger.error("Falha ao enviar e-mail: BREVO_API_KEY não está configurada no ambiente.");
            throw new Error('Email provider not configured');
        }
        const startTime = Date.now();
        try {
            const response = await fetch(`${this.baseUrl}/smtp/email`, {
                method: 'POST',
                headers: {
                    'api-key': this.apiKey,
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: {
                        name: 'PhysioGest',
                        email: process.env.BREVO_FROM_EMAIL || 'noreply@physiogest.com'
                    },
                    to: [{ email: message.to }],
                    subject: message.subject,
                    htmlContent: message.html,
                    textContent: message.text,
                }),
                signal: AbortSignal.timeout(30000), // 30 segundos
            });
            const duration = Date.now() - startTime;
            const data = await response.json().catch(() => ({}));
            if (response.status === 201) {
                logger.info("Email enviado com sucesso via Brevo", {
                    to: message.to,
                    subject: message.subject,
                    messageId: data?.messageId,
                    duration: `${duration}ms`
                });
            }
            else {
                logger.warn("Resposta inesperada do Brevo", {
                    status: response.status,
                    statusText: response.statusText,
                    to: message.to,
                    error: data
                });
                throw new Error(`Unexpected status ${response.status}`);
            }
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger.error("Falha ao enviar email via Brevo", error, {
                to: message.to,
                subject: message.subject,
                duration: `${duration}ms`,
                errorMessage: error.message
            });
            throw new Error('Failed to send email');
        }
    }
}
//# sourceMappingURL=EmailProvider.js.map