import { BOQItem, BOQCategorySummary } from '../types/boq';

/**
 * Calculates item amount: Quantity * Rate rounded to 2 decimal places.
 */
export function calculateBOQAmount(quantity: number, rate: number): number {
  const safeQty = Math.max(0, isNaN(quantity) ? 0 : quantity);
  const safeRate = Math.max(0, isNaN(rate) ? 0 : rate);
  return Math.round(safeQty * safeRate * 100) / 100;
}

/**
 * Calculates total BOQ amount for a given list of items.
 */
export function calculateBOQTotal(items: BOQItem[]): number {
  return items.reduce((acc, item) => acc + (item.amount || 0), 0);
}

/**
 * Generates category breakdowns with item count, category total, and percentage.
 */
export function getBOQCategorySummaries(items: BOQItem[]): BOQCategorySummary[] {
  const total = calculateBOQTotal(items);
  const grouped: Record<string, { count: number; sum: number }> = {};

  items.forEach((item) => {
    const cat = item.category || 'Uncategorized';
    if (!grouped[cat]) {
      grouped[cat] = { count: 0, sum: 0 };
    }
    grouped[cat].count += 1;
    grouped[cat].sum += item.amount || 0;
  });

  return Object.entries(grouped).map(([category, data]) => ({
    category,
    itemCount: data.count,
    totalAmount: data.sum,
    percentageOfTotal: total > 0 ? Math.round((data.sum / total) * 100) : 0
  })).sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Filters BOQ items for a specific project.
 */
export function getProjectBOQItems(allItems: BOQItem[], projectId: string): BOQItem[] {
  return allItems.filter((i) => i.projectId === projectId);
}
