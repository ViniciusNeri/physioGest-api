import { RabbitMQService } from "../messaging/RabbitMQService.js";
import { EmailProvider } from "../external/EmailProvider.js";
import logger from "../logging/Logger.js";
export class EmailConsumerService {
    rabbitMQService;
    emailProvider;
    constructor(rabbitMQService, emailProvider) {
        this.rabbitMQService = rabbitMQService;
        this.emailProvider = emailProvider;
    }
    async startConsuming() {
        logger.info("Iniciando consumo de mensagens de email");
        await this.rabbitMQService.consumeMessages(async (message) => {
            logger.debug("Mensagem recebida da fila", { type: message.type });
            if (message.type === 'send_email') {
                try {
                    logger.debug("Enviando email", { to: message.data.to, subject: message.data.subject });
                    await this.emailProvider.sendEmail(message.data);
                    logger.info("Email enviado com sucesso", { to: message.data.to });
                }
                catch (error) {
                    logger.error("Erro ao enviar email", error, {
                        to: message.data.to,
                        subject: message.data.subject
                    });
                    throw error; // Re-throw para que o RabbitMQ possa fazer retry ou DLQ
                }
            }
            else {
                logger.warn("Tipo de mensagem desconhecido", { type: message.type });
            }
        });
        logger.info("Consumidor de email iniciado com sucesso");
    }
}
//# sourceMappingURL=EmailConsumerService.js.map