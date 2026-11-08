Feature: Orders of the customer

  Scenario: The customer sees their orders
    Given a customer with two orders
    When the customer asks for the orders
    Then the backend returns the two orders
    And the newest order is the first one

  Scenario: The customer only sees their own orders
    Given a customer and an order of another customer
    When the customer asks for the orders
    Then the order of the other customer is not returned

  Scenario: The customer opens an order of another customer
    Given an order of another customer
    When the customer asks for that order
    Then the backend responds 404

  Scenario: Visitor without session
    Given a visitor without session
    When the visitor asks for the orders
    Then the backend responds 401
    
    
  Scenario: The customer opens the page of their orders
    Given a customer with one order
    When the customer opens "Les meves comandes"
    Then the page shows the number, the date, the delivery date, the method, the total and the status

  Scenario: The customer has no orders yet
    Given a customer without orders
    When the customer opens "Les meves comandes"
    Then the page shows "Encara no has fet cap comanda."
    And there is a link to the products

  Scenario: The orders can not be loaded
    Given a backend that fails
    When the customer opens "Les meves comandes"
    Then the page shows an error
    And the customer can try again

  Scenario: Visitor without session opens the page
    Given a visitor without session
    When the visitor opens "/comandes"
    Then the visitor is sent to the login page
