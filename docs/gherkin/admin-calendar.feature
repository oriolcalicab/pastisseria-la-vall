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
    
      Scenario: The admin filters the calendar
    Given orders to pick up and to deliver at home in November
    When the admin picks "Llesta" in "Estat" and "Recollida" in "Tipus d'entrega"
    Then the backend is asked only for the ready orders to pick up
    And the calendar only shows those orders

  Scenario: Unknown calendar filter
    Given a logged admin
    When the admin asks for the calendar with the delivery method "drone"
    Then the backend responds 400

  Scenario: The admin sees the cancelled orders
    Given a cancelled order for the 12th of November
    When the admin picks "Cancel·lada" in "Estat"
    Then the cancelled order is shown in red

  Scenario: Summary of an order
    Given the calendar with a pending order
    When the admin clicks the order
    Then the panel "Resum de la comanda" shows its number, customer, day, delivery method, total and status
    And it has the link "Veure el detall"

  Scenario: Change the status from the calendar
    Given the summary of a pending order
    When the admin clicks "Passa a En preparació"
    Then the order is saved as being prepared
    And the calendar asks for the orders again and shows the new colour

  Scenario: Close the summary
    Given the summary of an order
    When the admin presses Escape or clicks "Tanca"
    Then the summary is closed

  Scenario: Views of the calendar
    Given the calendar
    When the admin changes to the week, the day or the list view
    Then each order is still on its delivery day

  Scenario: Calendar on a phone
    Given a screen narrower than 768 px
    When the admin opens the calendar
    Then it opens in the list of the week
