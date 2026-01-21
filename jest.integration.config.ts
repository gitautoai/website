import baseConfig from "./jest.config";

const integrationConfig = async () => {
  const config = await baseConfig();
  return {
    ...config,
    testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
    testMatch: ["**/*.integration.test.[jt]s?(x)"],
  };
};

export default integrationConfig;
