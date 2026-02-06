import { getLatestUpdate } from './get-latest-update';
import type { CoverageData } from '../types';

describe('getLatestUpdate', () => {
  it('should return the most recent timestamp from coverage data', () => {
    const data: CoverageData[] = [
      {
        id: 1,
        scheduleId: 1,
        commitSha: 'abc123',
        timestamp: '2024-01-15T10:00:00Z',
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
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: 2,
        scheduleId: 1,
        commitSha: 'def456',
        timestamp: '2024-01-20T14:30:00Z',
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
        createdAt: new Date('2024-01-20T14:30:00Z'),
        updatedAt: new Date('2024-01-20T14:30:00Z'),
      },
      {
        id: 3,
        scheduleId: 1,
        commitSha: 'ghi789',
        timestamp: '2024-01-10T08:45:00Z',
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
        createdAt: new Date('2024-01-10T08:45:00Z'),
        updatedAt: new Date('2024-01-10T08:45:00Z'),
      },
    ];

    const result = getLatestUpdate(data);
    expect(result).toBe('Jan 20, 2024, 2:30 PM');
  });

  it('should return the only timestamp when data has one item', () => {
    const data: CoverageData[] = [
      {
        id: 1,
        scheduleId: 1,
        commitSha: 'abc123',
        timestamp: '2024-01-15T10:00:00Z',
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
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const result = getLatestUpdate(data);
    expect(result).toBe('Jan 15, 2024, 10:00 AM');
  });

  it('should return empty string when data array is empty', () => {
    const data: CoverageData[] = [];

    const result = getLatestUpdate(data);
    expect(result).toBe(null);
  });

  it('should handle data with identical timestamps', () => {
    const data: CoverageData[] = [
      {
        id: 1,
        scheduleId: 1,
        commitSha: 'abc123',
        timestamp: '2024-01-15T10:00:00Z',
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
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: 2,
        scheduleId: 1,
        commitSha: 'def456',
        timestamp: '2024-01-15T10:00:00Z',
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
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: 3,
        scheduleId: 1,
        commitSha: 'ghi789',
        timestamp: '2024-01-15T10:00:00Z',
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
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const result = getLatestUpdate(data);
    expect(result).toBe('Jan 15, 2024, 10:00 AM');
  });
});
