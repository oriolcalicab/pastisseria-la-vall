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
