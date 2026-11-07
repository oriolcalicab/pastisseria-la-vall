Feature: Create an order

  Scenario: Customer creates a pickup order
    Given a logged customer
    And an available date and an active pickup point
    When the customer sends the order
    Then the order is saved for the customer of the token
    And the prices come from the database
    And the order starts as "pending"

  Scenario: Customer creates a home delivery order
    Given a logged customer with an address of Barcelona
    When the customer sends the order
    Then the shipping fee is added to the total

  Scenario: The user can not be chosen
    Given a logged customer
    When the order sends another userId
    Then the order is saved for the customer of the token

  Scenario: A price changed
    Given a product whose price changed after the review
    When the customer sends the order
    Then the backend responds 409 with the warning
    And nothing is saved

  Scenario: The date is no longer available
    Given a day that became full
    When the customer sends the order for that day
    Then the backend responds 409
    And nothing is saved

  Scenario: The pickup point was deactivated
    Given a pickup point that is no longer active
    When the customer sends the order
    Then the backend responds 409

  Scenario: Visitor without session
    Given a visitor without token
    When the visitor sends an order
    Then the backend responds 401


  Scenario: The stock is taken when the order is created
    Given a variant with 5 units
    When a customer orders 2 units
    Then the variant has 3 units left

  Scenario: Two customers want the last place of a day
    Given a day with 4 orders and a maximum of 5
    When two customers send an order for that day at the same time
    Then only one order is saved
    And the other customer is told the date is no longer available

  Scenario: Two customers want the last unit
    Given a variant with 1 unit
    When two customers order it at the same time
    Then only one order is saved
    And the other customer is told it is sold out

  Scenario: All or nothing
    Given an order with two products
    When the second product has no stock
    Then nothing is saved
    And the stock of the first product does not change
