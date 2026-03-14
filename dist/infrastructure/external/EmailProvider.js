import axios from 'axios';
import logger from '../logging/Logger.js';
export class EmailProvider {
    apiKey;
    baseUrl;
    constructor() {
        this.apiKey = process.env.BREVO_API_KEY || '';
        this.baseUrl = 'https://api.brevo.com/v3';
        logger.debug("EmailProvider inicializado", {
            hasApiKey: !!this.apiKey,
            baseUrl: this.baseUrl,
            fromEmail: process.env.BREVO_FROM_EMAIL
        });
    }
    async sendEmail(message) {
        logger.debug("Enviando email via Brevo", {
            to: message.to,
            subject: message.subject,
            hasHtml: !!message.html,
            hasText: !!message.text
        });
        const startTime = Date.now();
        try {
            const startTime = Date.now();
            const response = await axios.post(`${this.baseUrl}/smtp/email`, {
                sender: {
                    name: 'PhysioGest',
                    email: process.env.BREVO_FROM_EMAIL || 'noreply@physiogest.com'
                },
                to: [{ email: message.to }],
                subject: message.subject,
                htmlContent: message.html,
                textContent: message.text,
            }, {
                headers: {
                    'api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                timeout: 30000, // 30 segundos
            });
            const duration = Date.now() - startTime;
            if (response.status === 201) {
                logger.info("Email enviado com sucesso via Brevo", {
                    to: message.to,
                    subject: message.subject,
                    messageId: response.data?.messageId,
                    duration: `${duration}ms`
                });
            }
            else {
                logger.warn("Resposta inesperada do Brevo", {
                    status: response.status,
                    statusText: response.statusText,
                    to: message.to
                });
            }
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger.error("Falha ao enviar email via Brevo", error, {
                to: message.to,
                subject: message.subject,
                duration: `${duration}ms`,
                status: error.response?.status,
                statusText: error.response?.statusText,
                errorMessage: error.response?.data?.message || error.message
            });
            throw new Error('Failed to send email');
        }
    }
}
//# sourceMappingURL=EmailProvider.js.map