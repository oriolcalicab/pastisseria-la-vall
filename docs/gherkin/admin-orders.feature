Feature: Admin orders

  Scenario: The admin sees all the orders
    Given orders of different customers
    When the admin asks for the orders
    Then the backend returns the orders of all the customers
    And each order has the name and the email of the customer
    And the newest order is the first one

  Scenario: The admin filters the orders by status
    Given orders that are pending and orders that are ready
    When the admin asks for the ready orders
    Then only the ready orders are returned

  Scenario: The admin moves to another page
    Given 21 orders
    When the admin asks for the second page with 20 orders per page
    Then the backend returns 1 order
    And it says there are 2 pages

  Scenario: Unknown status
    Given a logged admin
    When the admin asks for the orders with the status "lost"
    Then the backend responds 400

  Scenario: The admin opens an order
    Given an order of a customer
    When the admin asks for that order
    Then the backend returns the order with its products and its customer

  Scenario: A customer tries to see the orders of the admin
    Given a logged customer
    When the customer asks for the admin orders
    Then the backend responds 403

    
  Scenario: The admin opens the orders page
    Given a logged admin
    When the admin clicks "Comandes" in the admin menu
    Then the page shows a table with the number, the customer, the date, the delivery date, the method, the total and the status of each order

  Scenario: The admin filters the orders on the page
    Given the admin on the second page of the orders
    When the admin chooses "Llesta" in the status filter
    Then the first page of the ready orders is shown

  Scenario: No order has the chosen status
    Given no order is cancelled
    When the admin chooses "Cancel·lada" in the status filter
    Then the page shows "No hi ha cap comanda amb aquest estat."

  Scenario: The orders can not be loaded on the page
    Given a backend that fails
    When the admin opens the orders page
    Then the page shows an error
    And the admin can try again


  Scenario: The admin opens an order from the table
    Given the admin on the orders page
    When the admin clicks the number of an order
    Then the detail page of that order is shown
    And it shows the customer, the products, the method and the delivery date

  Scenario: Home delivery order on the map
    Given a home delivery order
    When the admin opens the order
    Then the page shows the address
    And there is a link to see the address on the map in a new tab

  Scenario: Pickup order
    Given a pickup order
    When the admin opens the order
    Then the page shows the pickup point
    And there is no map link

  Scenario: The order does not exist
    Given an id without order
    When the admin opens "/admin/comandes/999"
    Then the page shows "Pàgina no trobada"


  Scenario: The admin moves an order forward
    Given a pending order
    When the admin changes it to "En preparació"
    Then the order is being prepared
    And the history saves the old status, the new status, the admin and the time

  Scenario: Invalid status change
    Given a delivered order
    When the admin tries to change it to "Pendent"
    Then the backend responds 409
    And nothing is saved

  Scenario: The admin cancels an order
    Given a pending order with 2 units of a product
    When the admin cancels it
    Then the 2 units go back to the stock
    And the day has one free place again

  Scenario: Two admins cancel the same order at the same time
    Given a pending order
    When two admins cancel it at the same time
    Then the order is cancelled only once
    And the stock goes back only once

  Scenario: Final statuses
    Given a delivered or cancelled order
    When the admin tries to change its status
    Then the backend responds 409


  Scenario: The admin moves an order forward from the detail page
    Given the admin on the detail page of a pending order
    When the admin clicks "Passa a En preparació"
    Then the status shows "En preparació" without reloading the page
    And the page shows "Estat canviat a En preparació."
    And the buttons now are "Passa a Llesta" and "Cancel·la la comanda"

  Scenario: The admin does not confirm the cancellation
    Given the admin on the detail page of a pending order
    When the admin clicks "Cancel·la la comanda"
    And the admin says no in the confirmation
    Then the order is still pending

  Scenario: Someone else changed the order first
    Given the admin on the detail page of a pending order
    And another admin has already prepared it
    When the admin clicks "Passa a En preparació"
    Then the page says that someone else changed the order
    And the page shows the current status

  Scenario: Delivered order
    Given a delivered order
    When the admin opens it
    Then there are no buttons to change the status


  Scenario: A customer tries to change the status of an order
    Given a logged customer
    When the customer tries to cancel an order with the admin endpoint
    Then the backend responds 403
    And the order does not change
