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

    
  Scenario: See the pickup points on the map
    Given a customer on the second step of the checkout
    When the pickup points are loaded
    Then the map shows a marker for each point

  Scenario: Open the information of a point
    Given the map with the pickup points
    When the customer clicks a marker
    Then a popup shows the name, the address and the opening hours

  Scenario: The map can not be loaded
    Given the backend is stopped
    When the customer opens the second step of the checkout
    Then the page shows "No s'han pogut carregar els punts de recollida."
    And the customer can retry