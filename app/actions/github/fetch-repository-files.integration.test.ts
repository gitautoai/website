import { fetchRepositoryFiles } from './fetch-repository-files';
import { getOctokitForUser } from '@/app/api/github';

// Mock only the GitHub API, use real utility functions
jest.mock('@/app/api/github');

const mockGetOctokitForUser = getOctokitForUser as jest.MockedFunction<typeof getOctokitForUser>;

describe('fetchRepositoryFiles - Type File Exclusion Integration', () => {
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

  it('should exclude various type files from repository files', async () => {
    const mockTreeData = {
      data: {
        tree: [
          // Regular code files (should be included)
          { path: 'src/components/Button.tsx', type: 'blob', sha: 'sha1', size: 1000 },
          { path: 'utils/format-date.ts', type: 'blob', sha: 'sha2', size: 600 },
          { path: 'app/api/users/route.ts', type: 'blob', sha: 'sha3', size: 800 },
          
          // TypeScript declaration files (should be excluded)
          { path: 'types/next-auth.d.ts', type: 'blob', sha: 'sha4', size: 300 },
          { path: 'src/types/global.d.ts', type: 'blob', sha: 'sha5', size: 200 },
          
          // Type directories (should be excluded)
          { path: 'types/supabase.ts', type: 'blob', sha: 'sha6', size: 500 },
          { path: 'src/types/github.ts', type: 'blob', sha: 'sha7', size: 400 },
          
          // Type file names (should be excluded)
          { path: 'app/settings/types.ts', type: 'blob', sha: 'sha8', size: 350 },
          { path: 'src/user/type.ts', type: 'blob', sha: 'sha9', size: 250 },
          { path: 'UserTypes.ts', type: 'blob', sha: 'sha10', size: 450 },
          
          // Interface files (should be excluded)
          { path: 'interfaces/user.ts', type: 'blob', sha: 'sha11', size: 300 },
          { path: 'src/api/interface.ts', type: 'blob', sha: 'sha12', size: 200 },
          { path: 'ApiInterface.ts', type: 'blob', sha: 'sha13', size: 400 },
          
          // Schema files (should be excluded)
          { path: 'src/database/schema.ts', type: 'blob', sha: 'sha14', size: 600 },
          { path: 'DatabaseSchema.ts', type: 'blob', sha: 'sha15', size: 500 },
          { path: 'schemas/user.ts', type: 'blob', sha: 'sha16', size: 300 },
          
          // GraphQL files (should be excluded)
          { path: 'schema.graphql', type: 'blob', sha: 'sha17', size: 800 },
          { path: 'queries.gql', type: 'blob', sha: 'sha18', size: 400 },
          { path: 'src/graphql/types.ts', type: 'blob', sha: 'sha19', size: 350 },
          
          // Protocol buffer files (should be excluded)
          { path: 'user.proto', type: 'blob', sha: 'sha20', size: 300 },
          
          // Other type patterns (should be excluded)
          { path: 'api.types.ts', type: 'blob', sha: 'sha21', size: 400 },
          { path: 'user.type.ts', type: 'blob', sha: 'sha22', size: 250 },
          
          // Test files (should be excluded)
          { path: 'src/components/Button.test.tsx', type: 'blob', sha: 'sha23', size: 800 },
          
          // Non-code files (should be excluded)
          { path: 'README.md', type: 'blob', sha: 'sha24', size: 1000 },
        ],
      },
    };

    mockOctokit.rest.git.getTree.mockResolvedValue(mockTreeData);

    const result = await fetchRepositoryFiles('owner', 'repo', 'token', 'main');

    // Should only include the regular code files, excluding type files, test files, and non-code files
    expect(result).toHaveLength(3);
    expect(result.map(f => f.path)).toEqual([
      'src/components/Button.tsx',
      'utils/format-date.ts',
      'app/api/users/route.ts',
    ]);
  });
});