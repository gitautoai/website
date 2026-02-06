import { getLatestUpdate } from './get-latest-update';
import type { CoverageData } from '../types';

describe('getLatestUpdate', () => {
  it('should return the most recent timestamp from coverage data', () => {
    const data = [
      {
        timestamp: '2024-01-15T10:00:00.000Z',
        totalFiles: 100,
        coveredFiles: 80,
        totalLines: 1000,
        coveredLines: 800,
        totalBranches: 500,
        coveredBranches: 400,
        totalFunctions: 200,
        coveredFunctions: 160,
        totalStatements: 1000,
        coveredStatements: 800,
      },
      {
        timestamp: '2024-01-20T14:30:00.000Z',
        totalFiles: 120,
        coveredFiles: 100,
        totalLines: 1200,
        coveredLines: 1000,
        totalBranches: 600,
        coveredBranches: 500,
        totalFunctions: 250,
        coveredFunctions: 210,
        totalStatements: 1200,
        coveredStatements: 1000,
      },
      {
        timestamp: '2024-01-10T08:45:00.000Z',
        totalFiles: 90,
        coveredFiles: 70,
        totalLines: 900,
        coveredLines: 700,
        totalBranches: 450,
        coveredBranches: 350,
        totalFunctions: 180,
        coveredFunctions: 140,
        totalStatements: 900,
        coveredStatements: 700,
      },
    ] as CoverageData[];

    const result = getLatestUpdate(data);
    expect(result).toBe('Jan 20, 2024, 2:30 PM');
  });

  it('should return the only timestamp when data has one item', () => {
    const data = [
      {
        timestamp: '2024-01-15T10:00:00.000Z',
        totalFiles: 100,
        coveredFiles: 80,
        totalLines: 1000,
        coveredLines: 800,
        totalBranches: 500,
        coveredBranches: 400,
        totalFunctions: 200,
        coveredFunctions: 160,
        totalStatements: 1000,
        coveredStatements: 800,
      },
    ] as CoverageData[];

    const result = getLatestUpdate(data);
    expect(result).toBe('Jan 15, 2024, 10:00 AM');
  });

  it('should return null when data array is empty', () => {
    const data = [] as CoverageData[];

    const result = getLatestUpdate(data);
    expect(result).toBe(null);
  });

  it('should handle data with identical timestamps', () => {
    const data = [
      {
        timestamp: '2024-01-15T10:00:00.000Z',
        totalFiles: 100,
        coveredFiles: 80,
        totalLines: 1000,
        coveredLines: 800,
        totalBranches: 500,
        coveredBranches: 400,
        totalFunctions: 200,
        coveredFunctions: 160,
        totalStatements: 1000,
        coveredStatements: 800,
      },
      {
        timestamp: '2024-01-15T10:00:00.000Z',
        totalFiles: 100,
        coveredFiles: 80,
        totalLines: 1000,
        coveredLines: 800,
        totalBranches: 500,
        coveredBranches: 400,
        totalFunctions: 200,
        coveredFunctions: 160,
        totalStatements: 1000,
        coveredStatements: 800,
      },
      {
        timestamp: '2024-01-15T10:00:00.000Z',
        totalFiles: 100,
        coveredFiles: 80,
        totalLines: 1000,
        coveredLines: 800,
        totalBranches: 500,
        coveredBranches: 400,
        totalFunctions: 200,
        coveredFunctions: 160,
        totalStatements: 1000,
        coveredStatements: 800,
      },
    ] as CoverageData[];

    const result = getLatestUpdate(data);
    expect(result).toBe('Jan 15, 2024, 10:00 AM');
  });
});
