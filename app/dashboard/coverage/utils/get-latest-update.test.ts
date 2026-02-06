import { getLatestUpdate } from './get-latest-update';

describe('getLatestUpdate', () => {
  it('should return the most recent timestamp from coverage data', () => {
    const data = [
      {
        file_path: 'file1.ts',
        line_coverage: 80,
        statement_coverage: 85,
        function_coverage: 90,
        branch_coverage: 75,
        uncovered_lines: [],
        uncovered_functions: [],
        uncovered_branches: [],
        timestamp: '2026-01-01T10:00:00Z',
      },
      {
        file_path: 'file2.ts',
        line_coverage: 70,
        statement_coverage: 75,
        function_coverage: 80,
        branch_coverage: 65,
        uncovered_lines: [],
        uncovered_functions: [],
        uncovered_branches: [],
        timestamp: '2026-01-03T15:30:00Z',
      },
      {
        file_path: 'file3.ts',
        line_coverage: 90,
        statement_coverage: 95,
        function_coverage: 100,
        branch_coverage: 85,
        uncovered_lines: [],
        uncovered_functions: [],
        uncovered_branches: [],
        timestamp: '2026-01-02T12:00:00Z',
      },
    ];

    const result = getLatestUpdate(data);
    expect(result).toBe('2026-01-03T15:30:00Z');
  });

  it('should return the only timestamp when data has one item', () => {
    const data = [
      {
        file_path: 'single-file.ts',
        line_coverage: 100,
        statement_coverage: 100,
        function_coverage: 100,
        branch_coverage: 100,
        uncovered_lines: [],
        uncovered_functions: [],
        uncovered_branches: [],
        timestamp: '2026-02-01T08:00:00Z',
      },
    ];

    const result = getLatestUpdate(data);
    expect(result).toBe('2026-02-01T08:00:00Z');
  });

  it('should return empty string when data array is empty', () => {
    const data: Array<{
      file_path: string;
      line_coverage: number;
      statement_coverage: number;
      function_coverage: number;
      branch_coverage: number;
      uncovered_lines: string[];
      uncovered_functions: string[];
      uncovered_branches: string[];
      timestamp: string;
    }> = [];

    const result = getLatestUpdate(data);
    expect(result).toBe('');
  });
});
