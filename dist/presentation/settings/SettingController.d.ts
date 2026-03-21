import type { Request, Response } from "express";
export declare class SettingController {
    private service;
    private logger;
    constructor();
    getAllSettings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSettingById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSettingByUserId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createSetting: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateSetting: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteSetting: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=SettingController.d.ts.map