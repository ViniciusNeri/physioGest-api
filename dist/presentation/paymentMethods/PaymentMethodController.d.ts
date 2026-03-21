import type { Request, Response } from "express";
export declare class PaymentMethodController {
    private service;
    private logger;
    constructor();
    getAllPaymentMethods: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPaymentMethodById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPaymentMethodsByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createPaymentMethod: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updatePaymentMethod: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deletePaymentMethod: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=PaymentMethodController.d.ts.map