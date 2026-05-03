/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
    id: string;
    name: string;
    sku: string;
    stock: number;
    minStock: number;
    price: number;
    category: string;
    description: string;
    lastUpdated: string;
}

export interface InventoryStats {
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    categoryDistribution: { name: string; value: number }[];
}

export interface UserUsage {
    aiOptimizations: number;
    marketReports: number;
    forecasts: number;
}

export const PLAN_LIMITS = {
    free: {
        aiOptimizations: Infinity,
        marketReports: 0,
        forecasts: 0,
        multiStore: false,
        financials: false,
    },
    pro: {
        aiOptimizations: Infinity,
        marketReports: 50,
        forecasts: 50,
        multiStore: true,
        financials: true,
    }
};

export type View = 'dashboard' | 'inventory' | 'optimizer' | 'financials' | 'market-insights';
