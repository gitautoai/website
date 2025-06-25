import { fetchRepositoryFiles } from './fetch-repository-files';
import { getOctokitForUser } from '@/app/api/github';
import { isCodeFile } from '@/utils/is-code-file';
import { isTestFile } from '@/utils/is-test-file';
import { isTypeFile } from '@/utils/is-type-file';

// Mock the dependencies
// Mock the Octokit module before importing anything else
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(),
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

  const defaultParams = {
    ownerName: 'test-owner',
    repoName: 'test-repo',
    accessToken: 'test-token',
    branch: 'main',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOctokitForUser.mockReturnValue(mockOctokit as any);
  });

  describe('successful file fetching', () => {
    it('should fetch and filter repository files correctly', async () => {
      // Mock GitHub API response
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'src/components/Button.tsx',
              type: 'blob',
              sha: 'abc123',
              size: 1024,
            },
            {
              path: 'src/utils/helpers.ts',
              type: 'blob',
              sha: 'def456',
              size: 512,
            },
            {
              path: 'src/components/Button.test.tsx',
              type: 'blob',
              sha: 'ghi789',
              size: 256,
            },
            {
              path: 'types/api.ts',
              type: 'blob',
              sha: 'jkl012',
              size: 128,
            },
            {
              path: 'README.md',
              type: 'blob',
              sha: 'mno345',
              size: 64,
            },
            {
              path: 'src/assets',
              type: 'tree',
              sha: 'pqr678',
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);

      // Mock utility functions
      mockIsCodeFile.mockImplementation((path: string) => {
        return path.endsWith('.tsx') || path.endsWith('.ts');
      });
      mockIsTestFile.mockImplementation((path: string) => {
        return path.includes('.test.');
      });
      mockIsTypeFile.mockImplementation((path: string) => {
        return path.startsWith('types/');
      });

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken,
        defaultParams.branch
      );

      expect(mockGetOctokitForUser).toHaveBeenCalledWith('test-token');
      expect(mockOctokit.rest.git.getTree).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        tree_sha: 'main',
        recursive: 'true',
      });

      // Should only include code files that are not test files or type files
      expect(result).toEqual([
        {
          path: 'src/components/Button.tsx',
          sha: 'abc123',
          size: 1024,
        },
        {
          path: 'src/utils/helpers.ts',
          sha: 'def456',
          size: 512,
        },
      ]);
    });

    it('should use default branch "main" when no branch is specified', async () => {
      const mockTreeData = { data: { tree: [] } };
      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);

      await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      expect(mockOctokit.rest.git.getTree).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        tree_sha: 'main',
        recursive: 'true',
      });
    });

    it('should handle files with missing size property', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'src/app.ts',
              type: 'blob',
              sha: 'abc123',
              // size property is missing
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(true);
      mockIsTestFile.mockReturnValue(false);
      mockIsTypeFile.mockReturnValue(false);

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      expect(result).toEqual([
        {
          path: 'src/app.ts',
          sha: 'abc123',
          size: 0,
        },
      ]);
    });

    it('should handle files with missing path property', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              // path property is missing
              type: 'blob',
              sha: 'abc123',
              size: 1024,
            },
            {
              path: 'src/app.ts',
              type: 'blob',
              sha: 'def456',
              size: 512,
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(true);
      mockIsTestFile.mockReturnValue(false);
      mockIsTypeFile.mockReturnValue(false);

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      // Should skip the file without path and only include the valid one
      expect(result).toEqual([
        {
          path: 'src/app.ts',
          sha: 'def456',
          size: 512,
        },
      ]);
    });

    it('should filter out non-blob items (directories)', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'src',
              type: 'tree',
              sha: 'abc123',
            },
            {
              path: 'src/app.ts',
              type: 'blob',
              sha: 'def456',
              size: 512,
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(true);
      mockIsTestFile.mockReturnValue(false);
      mockIsTypeFile.mockReturnValue(false);

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      // Should only include blob items, not tree items
      expect(result).toEqual([
        {
          path: 'src/app.ts',
          sha: 'def456',
          size: 512,
        },
      ]);
    });
  });

  describe('error handling', () => {
    it('should throw error when GitHub API call fails', async () => {
      const mockError = new Error('GitHub API Error');
      mockOctokit.rest.git.getTree.mockRejectedValue(mockError);

      await expect(
        fetchRepositoryFiles(
          defaultParams.ownerName,
          defaultParams.repoName,
          defaultParams.accessToken
        )
      ).rejects.toThrow('GitHub API Error');

      expect(mockOctokit.rest.git.getTree).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        tree_sha: 'main',
        recursive: 'true',
      });
    });

    it('should log error and re-throw when API call fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Network error');
      mockOctokit.rest.git.getTree.mockRejectedValue(mockError);

      await expect(
        fetchRepositoryFiles(
          defaultParams.ownerName,
          defaultParams.repoName,
          defaultParams.accessToken
        )
      ).rejects.toThrow('Network error');

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching repository files:', mockError);
      consoleSpy.mockRestore();
    });
  });

  describe('filtering logic', () => {
    it('should call utility functions with correct parameters', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'src/app.ts',
              type: 'blob',
              sha: 'abc123',
              size: 512,
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(true);
      mockIsTestFile.mockReturnValue(false);
      mockIsTypeFile.mockReturnValue(false);

      await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      expect(mockIsCodeFile).toHaveBeenCalledWith('src/app.ts');
      expect(mockIsTestFile).toHaveBeenCalledWith('src/app.ts');
      expect(mockIsTypeFile).toHaveBeenCalledWith('src/app.ts');
    });

    it('should exclude files that are not code files', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'README.md',
              type: 'blob',
              sha: 'abc123',
              size: 512,
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(false); // Not a code file
      mockIsTestFile.mockReturnValue(false);
      mockIsTypeFile.mockReturnValue(false);

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      expect(result).toEqual([]);
    });

    it('should exclude test files', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'src/app.test.ts',
              type: 'blob',
              sha: 'abc123',
              size: 512,
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(true);
      mockIsTestFile.mockReturnValue(true); // Is a test file
      mockIsTypeFile.mockReturnValue(false);

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      expect(result).toEqual([]);
    });

    it('should exclude type files', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'types/api.ts',
              type: 'blob',
              sha: 'abc123',
              size: 512,
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(true);
      mockIsTestFile.mockReturnValue(false);
      mockIsTypeFile.mockReturnValue(true); // Is a type file

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      expect(result).toEqual([]);
    });

    it('should handle files with missing sha property', async () => {
      const mockTreeData = {
        data: {
          tree: [
            {
              path: 'src/app.ts',
              type: 'blob',
              // sha property is missing
              size: 1024,
            },
          ],
        },
      };

      mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);
      mockIsCodeFile.mockReturnValue(true);
      mockIsTestFile.mockReturnValue(false);
      mockIsTypeFile.mockReturnValue(false);

      const result = await fetchRepositoryFiles(
        defaultParams.ownerName,
        defaultParams.repoName,
        defaultParams.accessToken
      );

      expect(result).toHaveLength(1);
      expect(result[0].sha).toBeUndefined();
    });
  });
});
