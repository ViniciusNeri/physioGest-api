import amqp from 'amqplib';
import logger from '../logging/Logger.js';
export class RabbitMQService {
    connection = null;
    channel = null;
    queueName = 'email_queue';
    async connect() {
        logger.debug("Tentando conectar ao RabbitMQ", {
            url: process.env.RABBITMQ_URL || 'amqp://localhost',
            queueName: this.queueName
        });
        try {
            const startTime = Date.now();
            const url = process.env.RABBITMQ_URL || 'amqp://localhost';
            this.connection = await amqp.connect(url);
            const connectionTime = Date.now() - startTime;
            if (this.connection) {
                this.channel = await this.connection.createChannel();
                const channelTime = Date.now() - startTime;
                if (this.channel) {
                    await this.channel.assertQueue(this.queueName, { durable: true });
                    const queueTime = Date.now() - startTime;
                    logger.info("Conectado ao RabbitMQ com sucesso", {
                        connectionTime: `${connectionTime}ms`,
                        channelTime: `${channelTime}ms`,
                        queueTime: `${queueTime}ms`,
                        queueName: this.queueName
                    });
                }
            }
        }
        catch (error) {
            logger.error("Falha ao conectar ao RabbitMQ", error, {
                url: process.env.RABBITMQ_URL || 'amqp://localhost',
                queueName: this.queueName
            });
            throw error;
        }
    }
    async sendMessage(message) {
        if (!this.channel) {
            logger.error("Tentativa de enviar mensagem sem canal inicializado");
            throw new Error('RabbitMQ channel not initialized');
        }
        try {
            logger.debug("Enviando mensagem para fila", {
                queueName: this.queueName,
                messageType: message.type,
                messageSize: JSON.stringify(message).length
            });
            this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
            logger.trace("Mensagem enviada para fila com sucesso", {
                queueName: this.queueName,
                messageType: message.type
            });
        }
        catch (error) {
            logger.error("Erro ao enviar mensagem para fila", error, {
                queueName: this.queueName,
                messageType: message.type
            });
            throw error;
        }
    }
    async consumeMessages(callback) {
        if (!this.channel) {
            logger.error("Tentativa de consumir mensagens sem canal inicializado");
            throw new Error('RabbitMQ channel not initialized');
        }
        logger.debug("Configurando consumidor de mensagens", { queueName: this.queueName });
        this.channel.consume(this.queueName, async (msg) => {
            if (msg) {
                const messageContent = msg.content.toString();
                logger.trace("Mensagem recebida da fila", {
                    queueName: this.queueName,
                    messageSize: messageContent.length
                });
                try {
                    const message = JSON.parse(messageContent);
                    await callback(message);
                    this.channel.ack(msg);
                    logger.trace("Mensagem processada com sucesso", {
                        queueName: this.queueName,
                        messageType: message.type
                    });
                }
                catch (error) {
                    logger.error("Erro ao processar mensagem da fila", error, {
                        queueName: this.queueName,
                        messageContent: messageContent.substring(0, 200) + '...'
                    });
                    this.channel.nack(msg, false, false);
                }
            }
        });
        logger.info("Consumidor de mensagens configurado", { queueName: this.queueName });
    }
    async close() {
        logger.debug("Fechando conexões do RabbitMQ");
        try {
            if (this.channel) {
                await this.channel.close();
                logger.debug("Canal RabbitMQ fechado");
            }
            if (this.connection) {
                await this.connection.close();
                logger.debug("Conexão RabbitMQ fechada");
            }
            logger.info("Conexões RabbitMQ fechadas com sucesso");
        }
        catch (error) {
            logger.error("Erro ao fechar conexões RabbitMQ", error);
            throw error;
        }
    }
}
//# sourceMappingURL=RabbitMQService.js.map