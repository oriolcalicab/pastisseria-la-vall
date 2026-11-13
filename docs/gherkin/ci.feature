Feature: Continuous integration

  Scenario: The database tests run on every pull request
    Given a pull request to "develop"
    When the CI starts
    Then a temporary PostgreSQL database is created inside the job
    And the migrations create the tables
    And "pnpm test:db" passes against that database

  Scenario: The coverage must stay above the minimum
    Given the backend and the frontend tests
    When the CI runs "pnpm test:coverage"
    Then the coverage report is printed
    And the job fails if any value is below 20 %
