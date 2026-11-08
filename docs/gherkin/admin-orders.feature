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
