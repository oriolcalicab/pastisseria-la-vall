Feature: Admin delivery calendar

  Scenario: The admin asks for the orders of a month
    Given orders to deliver in November
    When the admin asks for the calendar from "2026-11-01" to "2026-11-30"
    Then the backend returns the orders of November
    And each order has its number, status, method, delivery date and customer name

  Scenario: Cancelled orders are not in the calendar
    Given a cancelled order for the 12th of November
    When the admin asks for the calendar of November
    Then the cancelled order is not returned

  Scenario: Range backwards
    Given a logged admin
    When the admin asks for the calendar from "2026-11-30" to "2026-11-01"
    Then the backend responds 400

  Scenario: Range too long
    Given a logged admin
    When the admin asks for the calendar of a whole year
    Then the backend responds 400

  Scenario: Impossible date
    Given a logged admin
    When the admin asks for the calendar from "2026-13-01"
    Then the backend responds 400 and does not break

  Scenario: A customer asks for the calendar
    Given a logged customer
    When the customer asks for the admin calendar
    Then the backend responds 403

    
  Scenario: The admin opens the delivery calendar
    Given a logged admin
    When the admin clicks "Calendari" in the admin menu
    Then the calendar shows the current month in Catalan, starting on Monday
    And each order is on its delivery day with its number, its customer and the colour of its status

  Scenario: The admin changes the month
    Given the admin on the calendar of November
    When the admin goes to December
    Then the orders of the days shown in December are loaded

  Scenario: The admin opens an order from the calendar
    Given the admin on the calendar with an order on the 12th
    When the admin clicks the order or presses Enter on it
    Then the detail of the order is shown

  Scenario: The calendar can not be loaded
    Given a backend that fails
    When the admin opens the calendar
    Then the page shows an error
    And the admin can try again
    