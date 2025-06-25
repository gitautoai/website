import { isTypeFile } from './is-type-file';

describe('isTypeFile', () => {
  describe('TypeScript declaration files', () => {
    it('should identify .d.ts files as type files', () => {
      expect(isTypeFile('next-auth.d.ts')).toBe(true);
      expect(isTypeFile('css.d.ts')).toBe(true);
      expect(isTypeFile('prismjs.d.ts')).toBe(true);
      expect(isTypeFile('src/types/global.d.ts')).toBe(true);
    });
  });

  describe('Type directories', () => {
    it('should identify files in types directories as type files', () => {
      expect(isTypeFile('types/supabase.ts')).toBe(true);
      expect(isTypeFile('types/github.ts')).toBe(true);
      expect(isTypeFile('types/account.ts')).toBe(true);
      expect(isTypeFile('src/types/user.ts')).toBe(true);
      expect(isTypeFile('app/types/api.ts')).toBe(true);
    });

    it('should identify files in nested types directories as type files', () => {
      expect(isTypeFile('src/components/types/props.ts')).toBe(true);
      expect(isTypeFile('lib/utils/types/helpers.ts')).toBe(true);
    });
  });

  describe('Common type file names', () => {
    it('should identify types.ts files as type files', () => {
      expect(isTypeFile('app/settings/types.ts')).toBe(true);
      expect(isTypeFile('app/dashboard/coverage/types.ts')).toBe(true);
      expect(isTypeFile('src/types.ts')).toBe(true);
    });

    it('should identify type.ts files as type files', () => {
      expect(isTypeFile('user/type.ts')).toBe(true);
      expect(isTypeFile('api/type.ts')).toBe(true);
    });

    it('should identify Types.ts and Type.ts files as type files', () => {
      expect(isTypeFile('UserTypes.ts')).toBe(true);
      expect(isTypeFile('ApiType.ts')).toBe(true);
    });
  });

  describe('Interface files', () => {
    it('should identify files in interfaces directories as type files', () => {
      expect(isTypeFile('interfaces/user.ts')).toBe(true);
      expect(isTypeFile('src/interfaces/api.ts')).toBe(true);
      expect(isTypeFile('app/interfaces/database.ts')).toBe(true);
    });

    it('should identify interface.ts files as type files', () => {
      expect(isTypeFile('user/interface.ts')).toBe(true);
      expect(isTypeFile('api/interface.ts')).toBe(true);
    });

    it('should identify Interface.ts files as type files', () => {
      expect(isTypeFile('UserInterface.ts')).toBe(true);
      expect(isTypeFile('ApiInterface.ts')).toBe(true);
    });
  });

  describe('Schema files', () => {
    it('should identify schema.ts files as type files', () => {
      expect(isTypeFile('database/schema.ts')).toBe(true);
      expect(isTypeFile('api/schema.ts')).toBe(true);
    });

    it('should identify Schema.ts files as type files', () => {
      expect(isTypeFile('DatabaseSchema.ts')).toBe(true);
      expect(isTypeFile('ApiSchema.ts')).toBe(true);
    });

    it('should identify files in schemas directories as type files', () => {
      expect(isTypeFile('schemas/user.ts')).toBe(true);
      expect(isTypeFile('src/schemas/database.ts')).toBe(true);
    });
  });

  describe('GraphQL files', () => {
    it('should identify .graphql files as type files', () => {
      expect(isTypeFile('schema.graphql')).toBe(true);
      expect(isTypeFile('queries.graphql')).toBe(true);
    });

    it('should identify .gql files as type files', () => {
      expect(isTypeFile('schema.gql')).toBe(true);
      expect(isTypeFile('mutations.gql')).toBe(true);
    });

    it('should identify TypeScript files in graphql directories as type files', () => {
      expect(isTypeFile('graphql/schema.ts')).toBe(true);
      expect(isTypeFile('src/graphql/types.ts')).toBe(true);
    });
  });

  describe('Protocol buffer files', () => {
    it('should identify .proto files as type files', () => {
      expect(isTypeFile('api.proto')).toBe(true);
      expect(isTypeFile('messages.proto')).toBe(true);
    });
  });

  describe('Other type definition patterns', () => {
    it('should identify .types.ts files as type files', () => {
      expect(isTypeFile('api.types.ts')).toBe(true);
      expect(isTypeFile('user.types.ts')).toBe(true);
    });

    it('should identify .type.ts files as type files', () => {
      expect(isTypeFile('user.type.ts')).toBe(true);
      expect(isTypeFile('api.type.ts')).toBe(true);
    });
  });

  describe('Non-type files', () => {
    it('should not identify regular code files as type files', () => {
      expect(isTypeFile('src/components/Button.tsx')).toBe(false);
      expect(isTypeFile('src/utils/helpers.ts')).toBe(false);
      expect(isTypeFile('src/pages/index.tsx')).toBe(false);
      expect(isTypeFile('src/api/users.ts')).toBe(false);
      expect(isTypeFile('src/hooks/useAuth.ts')).toBe(false);
      expect(isTypeFile('src/services/api.ts')).toBe(false);
      expect(isTypeFile('README.md')).toBe(false);
      expect(isTypeFile('package.json')).toBe(false);
      expect(isTypeFile('src/styles/globals.css')).toBe(false);
    });

    it('should not identify test files as type files', () => {
      expect(isTypeFile('src/components/Button.test.tsx')).toBe(false);
      expect(isTypeFile('src/utils/helpers.spec.ts')).toBe(false);
      expect(isTypeFile('__tests__/api.test.ts')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isTypeFile('')).toBe(false);
      expect(isTypeFile('file-without-extension')).toBe(false);
      expect(isTypeFile('.')).toBe(false);
      expect(isTypeFile('..')).toBe(false);
    });

    it('should handle case sensitivity correctly', () => {
      // Test case variations that should still match
      expect(isTypeFile('UserTypes.ts')).toBe(true);
      expect(isTypeFile('ApiType.ts')).toBe(true);
      
      // Test lowercase variations that should not match capital patterns
      expect(isTypeFile('usertypes.ts')).toBe(false);
      expect(isTypeFile('apitype.ts')).toBe(false);
    });
  });
});
