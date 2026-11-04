Feature: Pickup points

  Scenario: List the pickup points
    Given four active pickup points
    When a visitor calls "/api/pickup-points"
    Then the backend responds 200 with the four points
    And each point has its name, address, opening hours and coordinates

  Scenario: Inactive pickup point
    Given a pickup point that is not active
    When a visitor calls "/api/pickup-points"
    Then that point is not in the list