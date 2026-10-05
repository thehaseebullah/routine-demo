export interface BOQItem {
  id: string;
  projectId: string;
  itemNumber: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number; // quantity * rate
  notes?: string;
}

export interface BOQCategorySummary {
  category: string;
  itemCount: number;
  totalAmount: number;
  percentageOfTotal: number;
}
