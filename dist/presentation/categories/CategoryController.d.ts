import type { Request, Response } from "express";
export declare class CategoryController {
    private service;
    private logger;
    constructor();
    getAllCategories: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getCategoryById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getCategoriesByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=CategoryController.d.ts.map