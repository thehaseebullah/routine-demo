import { describe, it, expect } from 'vitest';
import {
  calculateBOQAmount,
  calculateBOQTotal,
  getBOQCategorySummaries
} from '../services/boqService';
import { BOQItem } from '../types/boq';

describe('BOQ Service Calculations', () => {
  it('TC-BOQ-01: calculates amount accurately for valid quantity and rate', () => {
    const amount = calculateBOQAmount(150, 45.0);
    expect(amount).toBe(6750.0);
  });

  it('TC-BOQ-02: calculates total amount correctly for a list of items', () => {
    const items: BOQItem[] = [
      {
        id: '1',
        projectId: 'p1',
        itemNumber: '1.01',
        category: 'Concrete',
        description: 'Slab',
        unit: 'cu.m',
        quantity: 10,
        rate: 200,
        amount: 2000
      },
      {
        id: '2',
        projectId: 'p1',
        itemNumber: '1.02',
        category: 'Finishes',
        description: 'Tiling',
        unit: 'm²',
        quantity: 50,
        rate: 40,
        amount: 2000
      }
    ];

    expect(calculateBOQTotal(items)).toBe(4000);
  });

  it('TC-BOQ-04: handles zero quantity gracefully', () => {
    expect(calculateBOQAmount(0, 150.5)).toBe(0);
  });

  it('TC-BOQ-05: handles large numbers and decimal precision without scientific notation overflow', () => {
    const amount = calculateBOQAmount(10000, 125.75);
    expect(amount).toBe(1257500.0);
  });

  it('TC-BOQ-06: rejects or clamps negative values defensively', () => {
    expect(calculateBOQAmount(-10, 50)).toBe(0);
    expect(calculateBOQAmount(10, -50)).toBe(0);
  });

  it('TC-BOQ-07: handles NaN and invalid numeric formats defensively', () => {
    expect(calculateBOQAmount(NaN, 50)).toBe(0);
    expect(calculateBOQAmount(50, NaN)).toBe(0);
  });

  it('TC-BOQ-08: aggregates category summaries correctly with percentage of total', () => {
    const items: BOQItem[] = [
      {
        id: '1',
        projectId: 'p1',
        itemNumber: '1.01',
        category: 'MEP',
        description: 'Wiring',
        unit: 'linear m',
        quantity: 100,
        rate: 30,
        amount: 3000
      },
      {
        id: '2',
        projectId: 'p1',
        itemNumber: '1.02',
        category: 'MEP',
        description: 'Pipes',
        unit: 'linear m',
        quantity: 50,
        rate: 20,
        amount: 1000
      },
      {
        id: '3',
        projectId: 'p1',
        itemNumber: '2.01',
        category: 'Finishes',
        description: 'Paint',
        unit: 'm²',
        quantity: 200,
        rate: 30,
        amount: 6000
      }
    ];

    const summaries = getBOQCategorySummaries(items);
    expect(summaries).toHaveLength(2);

    const finishes = summaries.find((s) => s.category === 'Finishes');
    const mep = summaries.find((s) => s.category === 'MEP');

    expect(finishes?.totalAmount).toBe(6000);
    expect(finishes?.percentageOfTotal).toBe(60);

    expect(mep?.totalAmount).toBe(4000);
    expect(mep?.itemCount).toBe(2);
    expect(mep?.percentageOfTotal).toBe(40);
  });
});
