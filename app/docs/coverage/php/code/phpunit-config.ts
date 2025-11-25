export const phpunitConfig = `<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php">
    <testsuites>
        <testsuite name="Test Suite">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory suffix=".php">src</directory>
        </include>
        <report>
            <clover outputFile="coverage/clover.xml"/>
        </report>
    </coverage>
</phpunit>`;

export const composerJson = `{
  "require-dev": {
    "phpunit/phpunit": "^12.0"
  },
  "scripts": {
    "test": "phpunit",
    "test:coverage": "phpunit --coverage-clover coverage/clover.xml"
  }
}`;
