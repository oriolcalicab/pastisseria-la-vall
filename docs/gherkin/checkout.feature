Feature: Checkout

  Scenario: Visitor without session
    Given a visitor without session with products in the cart
    When the visitor opens "/checkout"
    Then the visitor is sent to "/login"
    And after logging in the visitor returns to "/checkout"

  Scenario: Empty cart
    Given a logged customer with an empty cart
    When the customer opens "/checkout"
    Then the customer is sent to "/carreto"

  Scenario: Go to the checkout from the cart
    Given a cart with products
    When the customer clicks "Tramita la comanda"
    Then the checkout shows the summary of the cart