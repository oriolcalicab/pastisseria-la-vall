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

    
  Scenario: Choose a point in the list
    Given the pickup points in the checkout
    When the customer chooses a point in the list
    Then its marker is highlighted on the map
    And its popup is opened

  Scenario: Choose a point on the map
    Given the pickup points in the checkout
    When the customer clicks a marker on the map
    Then that point is checked in the list

  Scenario: Map on a phone
    Given a customer on a phone
    When the pickup points are shown
    Then the map does not fill the screen
    And the list is below the map

    
  Scenario: Pickup without a point
    Given a customer on the second step of the checkout
    When no pickup point is chosen
    Then the "Continua" button is disabled
    And the page shows "Tria un punt de recollida per continuar."

  Scenario: Pickup with a point
    Given a customer on the second step of the checkout
    When the customer chooses a pickup point and clicks "Continua"
    Then the review shows the chosen point with its address

  Scenario: Change the pickup point
    Given a customer on the review step
    When the customer clicks "Canvia el punt de recollida"
    Then the second step is shown with the point still chosen