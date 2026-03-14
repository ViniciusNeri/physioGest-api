export declare class RabbitMQService {
    private connection;
    private channel;
    private queueName;
    connect(): Promise<void>;
    sendMessage(message: any): Promise<void>;
    consumeMessages(callback: (message: any) => Promise<void>): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=RabbitMQService.d.ts.map