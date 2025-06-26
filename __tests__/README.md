# Test Coverage for PR #424 Files

This directory contains comprehensive unit tests for the files modified in PR #424. The tests are organized to provide maximum coverage while following best practices.

## Test Structure

### Unit Tests (Next to Source Files)
- `utils/create-cron-expression.test.ts` - Tests for cron expression generation
- `utils/get-schedule-name.test.ts` - Tests for schedule name generation
- `lib/aws-scheduler.test.ts` - Tests for AWS scheduler client configuration
- `app/actions/aws/create-or-update-schedule.test.ts` - Tests for schedule creation/update logic
- `app/actions/aws/delete-schedule.test.ts` - Tests for schedule deletion logic
- `app/actions/aws/get-schedule-status.test.ts` - Tests for schedule status retrieval
- `app/settings/triggers/page.test.tsx` - Tests for the triggers page React component

### Integration Tests
- `__tests__/integration/aws-scheduler-integration.test.ts` - End-to-end workflow tests

### Edge Case Tests
- `__tests__/utils/edge-cases.test.ts` - Boundary value and edge case testing

### Mock Verification Tests
- `__tests__/mocks/aws-sdk.test.ts` - Ensures AWS SDK imports work correctly

## Test Coverage

The tests cover the following aspects:

### Utility Functions
- ✅ `createCronExpression`: All time formats, weekend/weekday variations
- ✅ `getScheduleName`: Various ID combinations, edge cases

### AWS Scheduler Library
- ✅ Client configuration with different environment variables
- ✅ Default region fallback behavior

### AWS Actions
- ✅ Schedule creation when schedule doesn't exist
- ✅ Schedule update when schedule exists
- ✅ Schedule deletion with error handling
- ✅ Schedule status retrieval with all possible states
- ✅ Error handling for ResourceNotFoundException and other AWS errors
- ✅ Environment variable handling

### React Component
- ✅ Component rendering and initial state
- ✅ Loading states and data fetching
- ✅ Toggle interactions for all trigger types
- ✅ Mutual exclusivity between commit and merge triggers
- ✅ Schedule configuration (time and weekend settings)
- ✅ AWS schedule creation/deletion integration
- ✅ Error handling and user feedback
- ✅ Repository change handling

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test Files
```bash
# Run utility tests
npm test utils/

# Run AWS action tests
npm test app/actions/aws/

# Run React component tests
npm test app/settings/triggers/

# Run integration tests
npm test __tests__/integration/
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

## Test Configuration

- **Setup**: `__tests__/setup.ts` - Global test setup with environment variables and mocks
- **Jest Config**: `jest.config.ts` - Updated to include new test directories and coverage paths
- **Mocking Strategy**: Uses Jest mocks for AWS SDK, React contexts, and external dependencies

## Key Testing Patterns

1. **Mocking External Dependencies**: All AWS SDK calls and external services are mocked
2. **Error Simulation**: Tests include various error scenarios and edge cases
3. **Environment Variable Testing**: Tests verify behavior with different environment configurations
4. **React Testing**: Uses React Testing Library for component testing with proper user interaction simulation
5. **Integration Testing**: Verifies complete workflows across multiple functions

These tests ensure that all the files modified in PR #424 have comprehensive test coverage, helping to prevent regressions and document expected behavior.