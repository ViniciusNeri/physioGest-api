import { RabbitMQService } from "../messaging/RabbitMQService.js";
import { EmailProvider } from "../external/EmailProvider.js";
export declare class EmailConsumerService {
    private rabbitMQService;
    private emailProvider;
    constructor(rabbitMQService: RabbitMQService, emailProvider: EmailProvider);
    startConsuming(): Promise<void>;
}
//# sourceMappingURL=EmailConsumerService.d.ts.map