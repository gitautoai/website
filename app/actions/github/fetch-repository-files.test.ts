import { fetchRepositoryFiles } from './fetch-repository-files';
import { getOctokitForUser } from '@/app/api/github';
import { isCodeFile } from '@/utils/is-code-file';
import { isTestFile } from '@/utils/is-test-file';
import { isTypeFile } from '@/utils/is-type-file';

// Mock the dependencies
jest.mock('@/app/api/github');
jest.mock('@/utils/is-code-file');
jest.mock('@/utils/is-test-file');
jest.mock('@/utils/is-type-file');

const mockGetOctokitForUser = getOctokitForUser as jest.MockedFunction<typeof getOctokitForUser>;
const mockIsCodeFile = isCodeFile as jest.MockedFunction<typeof isCodeFile>;
const mockIsTestFile = isTestFile as jest.MockedFunction<typeof isTestFile>;
const mockIsTypeFile = isTypeFile as jest.MockedFunction<typeof isTypeFile>;

describe('fetchRepositoryFiles', () => {
  const mockOctokit = {
    rest: {
      git: {
        getTree: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOctokitForUser.mockReturnValue(mockOctokit as any);
  });

  it('should fetch repository files and exclude type files', async () => {
    const mockTreeData = {
      data: {
        tree: [
          {
            path: 'src/components/Button.tsx',
            type: 'blob',
            sha: 'sha1',
            size: 1000,
          },
          {
            path: 'src/types/user.ts',
            type: 'blob',
            sha: 'sha2',
            size: 500,
          },
          {
            path: 'src/components/Button.test.tsx',
            type: 'blob',
            sha: 'sha3',
            size: 800,
          },
          {
            path: 'types/api.d.ts',
            type: 'blob',
            sha: 'sha4',
            size: 300,
          },
          {
            path: 'utils/format-date.ts',
            type: 'blob',
            sha: 'sha5',
            size: 600,
          },
        ],
      },
    };

    mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);

    // Mock the utility functions
    mockIsCodeFile.mockImplementation((path: string) => {
      return path.endsWith('.tsx') || path.endsWith('.ts');
    });

    mockIsTestFile.mockImplementation((path: string) => {
      return path.includes('.test.') || path.includes('.spec.');
    });

    mockIsTypeFile.mockImplementation((path: string) => {
      return path.includes('/types/') || path.endsWith('.d.ts');
    });

    const result = await fetchRepositoryFiles('owner', 'repo', 'token', 'main');

    expect(mockOctokit.rest.git.getTree).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      tree_sha: 'main',
      recursive: 'true',
    });

    // Should only include files that are code files but not test files or type files
    expect(result).toEqual([
      {
        path: 'src/components/Button.tsx',
        sha: 'sha1',
        size: 1000,
      },
      {
        path: 'utils/format-date.ts',
        sha: 'sha5',
        size: 600,
      },
    ]);

    // Verify that all utility functions were called for each file
    expect(mockIsCodeFile).toHaveBeenCalledTimes(5);
    expect(mockIsTestFile).toHaveBeenCalledTimes(3); // Only called for code files
    expect(mockIsTypeFile).toHaveBeenCalledTimes(2); // Only called for code files that are not test files
  });

  it('should skip non-blob items', async () => {
    const mockTreeData = {
      data: {
        tree: [
          {
            path: 'src',
            type: 'tree',
            sha: 'sha1',
          },
          {
            path: 'src/components/Button.tsx',
            type: 'blob',
            sha: 'sha2',
            size: 1000,
          },
        ],
      },
    };

    mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
    mockIsCodeFile.mockReturnValue(true);
    mockIsTestFile.mockReturnValue(false);
    mockIsTypeFile.mockReturnValue(false);

    const result = await fetchRepositoryFiles('owner', 'repo', 'token');

    expect(result).toEqual([
      {
        path: 'src/components/Button.tsx',
        sha: 'sha2',
        size: 1000,
      },
    ]);

    // Should only check the blob item
    expect(mockIsCodeFile).toHaveBeenCalledTimes(1);
  });

  it('should handle items without path', async () => {
    const mockTreeData = {
      data: {
        tree: [
          {
            type: 'blob',
            sha: 'sha1',
            size: 1000,
          },
          {
            path: 'src/components/Button.tsx',
            type: 'blob',
            sha: 'sha2',
            size: 1000,
          },
        ],
      },
    };

    mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
    mockIsCodeFile.mockReturnValue(true);
    mockIsTestFile.mockReturnValue(false);
    mockIsTypeFile.mockReturnValue(false);

    const result = await fetchRepositoryFiles('owner', 'repo', 'token');

    expect(result).toEqual([
      {
        path: 'src/components/Button.tsx',
        sha: 'sha2',
        size: 1000,
      },
    ]);
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    mockOctokit.rest.git.getTree.mockRejectedValue(error);

    await expect(fetchRepositoryFiles('owner', 'repo', 'token')).rejects.toThrow('API Error');
  });

  it('should use default branch when not specified', async () => {
    const mockTreeData = {
      data: {
        tree: [],
      },
    };

    mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);

    await fetchRepositoryFiles('owner', 'repo', 'token');

    expect(mockOctokit.rest.git.getTree).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      tree_sha: 'main',
      recursive: 'true',
    });
  });

  it('should handle items with missing size', async () => {
    const mockTreeData = {
      data: {
        tree: [
          {
            path: 'src/components/Button.tsx',
            type: 'blob',
            sha: 'sha1',
            // size is undefined
          },
        ],
      },
    };

    mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
    mockIsCodeFile.mockReturnValue(true);
    mockIsTestFile.mockReturnValue(false);
    mockIsTypeFile.mockReturnValue(false);

    const result = await fetchRepositoryFiles('owner', 'repo', 'token');

    expect(result).toEqual([
      {
        path: 'src/components/Button.tsx',
        sha: 'sha1',
        size: 0, // Should default to 0
      },
    ]);
  });
});