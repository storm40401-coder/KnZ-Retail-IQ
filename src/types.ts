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

export type View = 'dashboard' | 'inventory' | 'optimizer';
