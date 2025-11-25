export const pomXml = `<project>
  <!-- ... other configuration ... -->

  <build>
    <plugins>
      <plugin>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
        <version>0.8.15</version>
        <executions>
          <execution>
            <goals>
              <goal>prepare-agent</goal>
            </goals>
          </execution>
          <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
              <goal>report</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>`;

export const buildGradle = `plugins {
    id 'java'
    id 'jacoco'
}

jacoco {
    toolVersion = "0.8.15"
}

test {
    finalizedBy jacocoTestReport
}

jacocoTestReport {
    dependsOn test
    reports {
        xml.required = true
        html.required = true
        csv.required = false
    }
}

// Configure JaCoCo to generate reports in the correct location
jacocoTestReport {
    reports {
        xml.enabled true
        xml.destination file("\${buildDir}/reports/jacoco/test/jacoco.xml")
    }
}`;
