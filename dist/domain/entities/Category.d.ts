export interface Category {
    id?: string;
    userId: string;
    name: string;
    description?: string;
    type: 'income' | 'expense' | 'general';
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=Category.d.ts.map