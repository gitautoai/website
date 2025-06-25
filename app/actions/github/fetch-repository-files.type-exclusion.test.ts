import { fetchRepositoryFiles } from './fetch-repository-files';
import { getOctokitForUser } from '@/app/api/github';

// Mock only the GitHub API to test the actual type file exclusion logic
jest.mock('@/app/api/github');

const mockGetOctokitForUser = getOctokitForUser as jest.MockedFunction<typeof getOctokitForUser>;

describe('fetchRepositoryFiles - Type File Exclusion (Commit Validation)', () => {
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

  it('should exclude type files from dashboard like test files and non-code files', async () => {
    // This test validates the exact commit message: "Exclude type files from dashboard like test files and non-code files"
    const mockTreeData = {
      data: {
        tree: [
          // Files that should be included (code files that are not tests or types)
          { path: 'app/actions/github/fetch-repository-files.ts', type: 'blob', sha: 'sha1', size: 1000 },
          { path: 'utils/format-date.ts', type: 'blob', sha: 'sha2', size: 500 },
          
          // Type files that should be excluded (new functionality from commit)
          { path: 'utils/is-type-file.ts', type: 'blob', sha: 'sha3', size: 800 }, // This would be a type utility, but not in types dir
          { path: 'types/supabase.ts', type: 'blob', sha: 'sha4', size: 600 },
          { path: 'types/github.ts', type: 'blob', sha: 'sha5', size: 400 },
          { path: 'app/dashboard/coverage/types.ts', type: 'blob', sha: 'sha6', size: 300 },
          { path: 'next-auth.d.ts', type: 'blob', sha: 'sha7', size: 200 },
          
          // Test files that should be excluded (existing functionality)
          { path: 'app/api/auth/[...nextauth]/route.test.ts', type: 'blob', sha: 'sha8', size: 700 },
          { path: 'app/components/LoadingSpinner.test.tsx', type: 'blob', sha: 'sha9', size: 500 },
          
          // Non-code files that should be excluded (existing functionality)
          { path: 'README.md', type: 'blob', sha: 'sha10', size: 1000 },
          { path: 'package.json', type: 'blob', sha: 'sha11', size: 2000 },
        ],
      },
    };

    mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);

    const result = await fetchRepositoryFiles('owner', 'repo', 'token', 'main');

    // Verify that only non-test, non-type code files are included
    expect(result).toHaveLength(3);
    
    const includedPaths = result.map(f => f.path);
    expect(includedPaths).toContain('app/actions/github/fetch-repository-files.ts');
    expect(includedPaths).toContain('utils/format-date.ts');
    expect(includedPaths).toContain('utils/is-type-file.ts'); // This is a utility, not a type definition file
    
    // Verify that type files are excluded
    expect(includedPaths).not.toContain('types/supabase.ts');
    expect(includedPaths).not.toContain('types/github.ts');
    expect(includedPaths).not.toContain('app/dashboard/coverage/types.ts');
    expect(includedPaths).not.toContain('next-auth.d.ts');
  });
});