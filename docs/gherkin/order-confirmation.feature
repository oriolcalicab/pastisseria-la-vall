Feature: Order confirmation

  Scenario: The customer sees the order after confirming it
    Given a customer on the review step
    When the customer clicks "Confirma la comanda"
    And the order is created
    Then the confirmation page of the order is shown
    And the page shows the order number, the delivery and the products
    And the cart is empty

  Scenario: Going back after the confirmation
    Given a customer on the confirmation page
    When the customer goes back in the browser
    Then the checkout of the order is not shown again

  Scenario: The order failed
    Given a customer on the review step
    When the order is rejected
    Then the customer stays on the checkout
    And the cart keeps its products

  Scenario: Order of another customer
    Given an order of another customer
    When the customer opens its confirmation page
    Then the page shows "Pàgina no trobada"

  Scenario: Visitor without session
    Given a visitor without session
    When the visitor opens a confirmation page
    Then the visitor is sent to the login page
