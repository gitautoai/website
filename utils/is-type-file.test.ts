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

  describe('Type-only directories', () => {
    it('should identify files in types directories as type files', () => {
      expect(isTypeFile('types/supabase.ts')).toBe(true);
      expect(isTypeFile('types/github.ts')).toBe(true);
      expect(isTypeFile('src/types/account.ts')).toBe(true);
      expect(isTypeFile('app/types/user.ts')).toBe(true);
    });

    it('should identify root level types directory files as type files', () => {
      expect(isTypeFile('types/account.ts')).toBe(true);
      expect(isTypeFile('types/api.ts')).toBe(true);
    });
  });

  describe('Common type file names', () => {
    it('should identify types.ts files as type files', () => {
      expect(isTypeFile('app/settings/types.ts')).toBe(true);
      expect(isTypeFile('app/dashboard/coverage/types.ts')).toBe(true);
      expect(isTypeFile('src/components/types.ts')).toBe(true);
    });

    it('should identify type.ts files as type files', () => {
      expect(isTypeFile('src/user/type.ts')).toBe(true);
      expect(isTypeFile('app/api/type.ts')).toBe(true);
    });

    it('should identify Types.ts and Type.ts files as type files', () => {
      expect(isTypeFile('UserTypes.ts')).toBe(true);
      expect(isTypeFile('ApiType.ts')).toBe(true);
      expect(isTypeFile('src/UserTypes.ts')).toBe(true);
    });
  });

  describe('Interface files', () => {
    it('should identify files in interfaces directories as type files', () => {
      expect(isTypeFile('interfaces/user.ts')).toBe(true);
      expect(isTypeFile('src/interfaces/api.ts')).toBe(true);
      expect(isTypeFile('app/interfaces/database.ts')).toBe(true);
    });

    it('should identify interface.ts files as type files', () => {
      expect(isTypeFile('src/user/interface.ts')).toBe(true);
      expect(isTypeFile('app/api/interface.ts')).toBe(true);
    });

    it('should identify Interface.ts files as type files', () => {
    it('should debug Interface pattern', () => {
      console.log('Testing UserInterface.ts:', /[A-Z].*Interface\.ts$/.test('UserInterface.ts'));
      console.log('Testing src/ApiInterface.ts:', /[A-Z].*Interface\.ts$/.test('src/ApiInterface.ts'));
    });

      expect(isTypeFile('UserInterface.ts')).toBe(true);
      expect(isTypeFile('src/ApiInterface.ts')).toBe(true);
    });
  });

  describe('Schema files', () => {
    it('should identify schema.ts files as type files', () => {
      expect(isTypeFile('src/database/schema.ts')).toBe(true);
      expect(isTypeFile('app/api/schema.ts')).toBe(true);
    });

    it('should identify Schema.ts files as type files', () => {
      expect(isTypeFile('DatabaseSchema.ts')).toBe(true);
      expect(isTypeFile('src/UserSchema.ts')).toBe(true);
    });

    it('should identify files in schemas directories as type files', () => {
      expect(isTypeFile('schemas/user.ts')).toBe(true);
      expect(isTypeFile('src/schemas/database.ts')).toBe(true);
    });
  });

  describe('GraphQL type files', () => {
    it('should identify .graphql files as type files', () => {
      expect(isTypeFile('schema.graphql')).toBe(true);
      expect(isTypeFile('src/graphql/user.graphql')).toBe(true);
    });

    it('should identify .gql files as type files', () => {
      expect(isTypeFile('queries.gql')).toBe(true);
      expect(isTypeFile('src/graphql/mutations.gql')).toBe(true);
    });

    it('should identify TypeScript files in graphql directories as type files', () => {
      expect(isTypeFile('src/graphql/types.ts')).toBe(true);
      expect(isTypeFile('graphql/schema.ts')).toBe(true);
    });
  });

  describe('Protocol buffer files', () => {
    it('should identify .proto files as type files', () => {
      expect(isTypeFile('user.proto')).toBe(true);
      expect(isTypeFile('src/proto/api.proto')).toBe(true);
    });
  });

  describe('Other type definition patterns', () => {
    it('should identify .types.ts files as type files', () => {
      expect(isTypeFile('api.types.ts')).toBe(true);
      expect(isTypeFile('user.types.ts')).toBe(true);
      expect(isTypeFile('src/database.types.ts')).toBe(true);
    });

    it('should identify .type.ts files as type files', () => {
      expect(isTypeFile('user.type.ts')).toBe(true);
      expect(isTypeFile('api.type.ts')).toBe(true);
      expect(isTypeFile('src/config.type.ts')).toBe(true);
    });
  });

  describe('Non-type files', () => {
    it('should not identify regular code files as type files', () => {
      expect(isTypeFile('src/components/Button.tsx')).toBe(false);
      expect(isTypeFile('app/api/users/route.ts')).toBe(false);
      expect(isTypeFile('utils/format-date.ts')).toBe(false);
      expect(isTypeFile('lib/database.ts')).toBe(false);
      expect(isTypeFile('pages/index.tsx')).toBe(false);
      expect(isTypeFile('src/hooks/useAuth.ts')).toBe(false);
    });

    it('should not identify test files as type files', () => {
      expect(isTypeFile('src/components/Button.test.tsx')).toBe(false);
      expect(isTypeFile('utils/format-date.spec.ts')).toBe(false);
      expect(isTypeFile('__tests__/api.test.ts')).toBe(false);
    });

    it('should not identify config files as type files', () => {
      expect(isTypeFile('next.config.js')).toBe(false);
      expect(isTypeFile('tailwind.config.ts')).toBe(false);
      expect(isTypeFile('jest.config.ts')).toBe(false);
    });

    it('should handle empty strings and edge cases', () => {
      expect(isTypeFile('')).toBe(false);
      expect(isTypeFile('.')).toBe(false);
      expect(isTypeFile('.ts')).toBe(false);
      expect(isTypeFile('types')).toBe(false);
    });
  });
});
