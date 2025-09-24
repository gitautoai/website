import { isTypeFile } from "./is-type-file";

describe("isTypeFile", () => {
  describe("type directories", () => {
    it("should identify files in type directories", () => {
      // Type directories with singular and plural forms
      expect(isTypeFile("services/github/types/user.py")).toBe(true);
      expect(isTypeFile("src/types/api.ts")).toBe(true);
      expect(isTypeFile("types/constants.py")).toBe(true);
      expect(isTypeFile("type/user.py")).toBe(true);
      expect(isTypeFile("app/type/models.js")).toBe(true);
    });
  });

  describe("type file naming patterns", () => {
    it("should identify files with type naming patterns", () => {
      // Files with .type. or .types. in the name
      expect(isTypeFile("user.types.ts")).toBe(true);
      expect(isTypeFile("api.type.js")).toBe(true);
      expect(isTypeFile("models.types.py")).toBe(true);
      expect(isTypeFile("config.type.json")).toBe(true);
    });
  });

  describe("typescript declaration files", () => {
    it("should identify TypeScript declaration files", () => {
      // TypeScript declaration files (.d.ts)
      expect(isTypeFile("index.d.ts")).toBe(true);
      expect(isTypeFile("global.d.ts")).toBe(true);
      expect(isTypeFile("types.d.ts")).toBe(true);
      expect(isTypeFile("api.d.ts")).toBe(true);
    });
  });

  describe("type prefix patterns", () => {
    it("should identify files with type prefixes", () => {
      // Files starting with types or type
      expect(isTypeFile("UserTypes.java")).toBe(true);
      expect(isTypeFile("ApiType.cs")).toBe(true);
      expect(isTypeFile("types.user.py")).toBe(true);
      expect(isTypeFile("type.api.js")).toBe(true);
    });
  });

  describe("type underscore patterns", () => {
    it("should identify files with underscore patterns", () => {
      // Files with underscore patterns
      expect(isTypeFile("user_types.py")).toBe(true);
      expect(isTypeFile("api_type.py")).toBe(true);
      expect(isTypeFile("types_user.py")).toBe(true);
      expect(isTypeFile("type_api.py")).toBe(true);
    });
  });

  describe("schema directories", () => {
    it("should identify files in schema directories", () => {
      // Schema directories
      expect(isTypeFile("schemas/user.py")).toBe(true);
      expect(isTypeFile("schema/api.py")).toBe(true);
      expect(isTypeFile("app/schemas/models.js")).toBe(true);
      expect(isTypeFile("src/schema/types.ts")).toBe(true);
    });
  });

  describe("schema file patterns", () => {
    it("should identify files with schema patterns", () => {
      // Schema file naming patterns
      expect(isTypeFile("user.schema.ts")).toBe(true);
      expect(isTypeFile("api.schema.json")).toBe(true);
      expect(isTypeFile("UserSchema.java")).toBe(true);
      expect(isTypeFile("ApiSchemas.cs")).toBe(true);
    });
  });

  describe("interface directories", () => {
    it("should identify files in interface directories", () => {
      // Interface directories
      expect(isTypeFile("interfaces/user.py")).toBe(true);
      expect(isTypeFile("interface/api.py")).toBe(true);
      expect(isTypeFile("app/interfaces/models.js")).toBe(true);
      expect(isTypeFile("src/interface/types.ts")).toBe(true);
    });
  });

  describe("interface file patterns", () => {
    it("should identify files with interface patterns", () => {
      // Interface file naming patterns
      expect(isTypeFile("user.interface.ts")).toBe(true);
      expect(isTypeFile("api.interface.js")).toBe(true);
      expect(isTypeFile("UserInterface.java")).toBe(true);
      expect(isTypeFile("ApiInterfaces.cs")).toBe(true);
    });
  });

  describe("model files", () => {
    it("should identify Python model files only", () => {
      // Python model files (data classes without business logic)
      expect(isTypeFile("models/user.py")).toBe(true);
      expect(isTypeFile("model/api.py")).toBe(true);
      expect(isTypeFile("app/models/customer.py")).toBe(true);
      expect(isTypeFile("src/model/product.py")).toBe(true);
      // Non-Python model files should not match this pattern
      expect(isTypeFile("models/user.js")).toBe(false);
      expect(isTypeFile("model/api.ts")).toBe(false);
    });
  });

  describe("constants directories", () => {
    it("should identify files in constants directories", () => {
      // Constants directories
      expect(isTypeFile("constants/urls.py")).toBe(true);
      expect(isTypeFile("constant/messages.py")).toBe(true);
      expect(isTypeFile("app/constants/config.js")).toBe(true);
      expect(isTypeFile("src/constant/api.ts")).toBe(true);
    });
  });

  describe("constants file patterns", () => {
    it("should identify files with constants patterns", () => {
      // Constants file naming patterns
      expect(isTypeFile("user.constants.ts")).toBe(true);
      expect(isTypeFile("api.constant.js")).toBe(true);
      expect(isTypeFile("UserConstants.java")).toBe(true);
      expect(isTypeFile("ApiConstants.cs")).toBe(true);
      expect(isTypeFile("user_constants.py")).toBe(true);
      expect(isTypeFile("api_constant.py")).toBe(true);
    });
  });

  describe("enum directories", () => {
    it("should identify files in enum directories", () => {
      // Enum directories
      expect(isTypeFile("enums/status.py")).toBe(true);
      expect(isTypeFile("enum/types.py")).toBe(true);
      expect(isTypeFile("app/enums/colors.js")).toBe(true);
      expect(isTypeFile("src/enum/states.ts")).toBe(true);
    });
  });

  describe("enum file patterns", () => {
    it("should identify files with enum patterns", () => {
      // Enum file naming patterns
      expect(isTypeFile("status.enums.ts")).toBe(true);
      expect(isTypeFile("types.enum.js")).toBe(true);
      expect(isTypeFile("StatusEnums.java")).toBe(true);
      expect(isTypeFile("TypeEnums.cs")).toBe(true);
    });
  });

  describe("case insensitive matching", () => {
    it("should handle case insensitive matching", () => {
      // Test case insensitive matching
      expect(isTypeFile("TYPES/USER.PY")).toBe(true);
      expect(isTypeFile("User.TYPES.TS")).toBe(true);
      expect(isTypeFile("API.D.TS")).toBe(true);
      expect(isTypeFile("SCHEMAS/CONFIG.JSON")).toBe(true);
      expect(isTypeFile("INTERFACES/MODEL.JS")).toBe(true);
      expect(isTypeFile("CONSTANTS/URLS.PY")).toBe(true);
      expect(isTypeFile("ENUMS/STATUS.PY")).toBe(true);
    });
  });

  describe("non-type files", () => {
    it("should reject regular non-type files", () => {
      // Regular files that should not be considered type files
      expect(isTypeFile("user_service.py")).toBe(false);
      expect(isTypeFile("api_handler.js")).toBe(false);
      expect(isTypeFile("test_user.py")).toBe(false);
      expect(isTypeFile("main.py")).toBe(false);
      expect(isTypeFile("config.json")).toBe(false);
      expect(isTypeFile("utils/helpers.py")).toBe(false);
      expect(isTypeFile("src/components/Button.tsx")).toBe(false);
    });
  });

  describe("invalid input", () => {
    it("should handle invalid input types", () => {
      // Test with invalid input types (decorator should handle these)
      expect(isTypeFile(null as any)).toBe(false);
      expect(isTypeFile(123 as any)).toBe(false);
      expect(isTypeFile([] as any)).toBe(false);
      expect(isTypeFile({} as any)).toBe(false);
      expect(isTypeFile("")).toBe(false);
    });
  });

  describe("edge cases with paths", () => {
    it("should handle edge cases with different path structures", () => {
      // Test edge cases with different path separators and structures
      expect(isTypeFile("src\\types\\user.py")).toBe(false); // Windows path separator not supported
      expect(isTypeFile("./types/config.js")).toBe(true);
      expect(isTypeFile("../type/models.py")).toBe(true);
      expect(isTypeFile("deeply/nested/types/complex/structure.ts")).toBe(true);
    });
  });

  describe("mixed patterns", () => {
    it("should handle files that match multiple patterns", () => {
      // Test files that might match multiple patterns
      expect(isTypeFile("types/UserTypes.java")).toBe(true); // Both directory and naming pattern
      expect(isTypeFile("schemas/user.schema.ts")).toBe(true); // Both directory and file pattern
      expect(isTypeFile("interfaces/api.interface.js")).toBe(true); // Both directory and file pattern
      expect(isTypeFile("constants/app.constants.py")).toBe(true); // Both directory and file pattern
    });
  });

  describe("partial matches should not match", () => {
    it("should reject files that contain type-related words but do not match patterns", () => {
      // Test files that contain type-related words but shouldn't match patterns
      expect(isTypeFile("user_service_types_handler.py")).toBe(false); // Contains "types" but not in pattern
      expect(isTypeFile("schema_validator.py")).toBe(false); // Contains "schema" but not in pattern
      expect(isTypeFile("interface_manager.py")).toBe(false); // Contains "interface" but not in pattern
      expect(isTypeFile("constant_loader.py")).toBe(false); // Contains "constant" but not in pattern
      expect(isTypeFile("enum_parser.py")).toBe(false); // Contains "enum" but not in pattern
      expect(isTypeFile("model_factory.py")).toBe(false); // Contains "model" but not in pattern
      expect(isTypeFile("services/stripe/get_billing_type.py")).toBe(false); // Contains "type" but is business logic
    });
  });

  describe("boundary conditions", () => {
    it("should handle boundary conditions for regex patterns", () => {
      // Test boundary conditions for regex patterns
      expect(isTypeFile("type")).toBe(false); // Just the word "type" without extension
      expect(isTypeFile("types")).toBe(false); // Just the word "types" without extension
      expect(isTypeFile("type.")).toBe(true); // Matches "types?." pattern
      expect(isTypeFile("types.")).toBe(true); // Matches "types?." pattern
      expect(isTypeFile("_type.py")).toBe(true); // Matches "_types?." pattern
      expect(isTypeFile("_types.js")).toBe(true); // Matches "_types?." pattern
      expect(isTypeFile("type_")).toBe(true); // Matches "^types?_" pattern
      expect(isTypeFile("types_")).toBe(true); // Matches "^types?_" pattern
    });
  });

  describe("specific model file restrictions", () => {
    it("should only match Python model files for model pattern", () => {
      // Test that only Python model files match the model pattern
      expect(isTypeFile("models/user.py")).toBe(true);
      expect(isTypeFile("model/api.py")).toBe(true);
      expect(isTypeFile("models/config.js")).toBe(false); // Not Python
      expect(isTypeFile("model/service.ts")).toBe(false); // Not Python, doesn't match type patterns
      expect(isTypeFile("models/data.java")).toBe(false); // Not Python
      expect(isTypeFile("models/service.rb")).toBe(false); // Not Python
      expect(isTypeFile("model/handler.php")).toBe(false); // Not Python
      expect(isTypeFile("models/component.tsx")).toBe(false); // Not Python
    });
  });
});
