export const customRulesExample = `## Repository Context
This is a financial trading platform with real-time market data processing.

## Test-Critical Requirements
- All monetary calculations must use BigDecimal, never floating point numbers
- Test data must use realistic market scenarios: bull market, bear market, flash crash
- Mock external APIs with realistic latency delays (50-200ms) to catch timing issues
- Always test edge cases: market closed, connection timeout, invalid ticker symbols

## Domain-Specific Testing
- Price movements: test with actual historical data patterns
- User portfolio tests: include margin calls, stop-loss triggers
- Integration tests must handle market data feed interruptions gracefully`;
