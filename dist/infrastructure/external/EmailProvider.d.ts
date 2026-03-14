export interface EmailMessage {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailProvider {
    private apiKey;
    private baseUrl;
    constructor();
    sendEmail(message: EmailMessage): Promise<void>;
}
//# sourceMappingURL=EmailProvider.d.ts.map