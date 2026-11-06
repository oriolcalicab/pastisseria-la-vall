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

    
  Scenario: Continue without a delivery date
    Given a logged customer on "/checkout"
    When no date is chosen
    Then the "Continua" button is disabled
    And the page shows "Tria una data per continuar."

  Scenario: Continue with a delivery date
    Given a logged customer on "/checkout"
    When the customer chooses an available date
    And clicks "Continua"
    Then the next step shows the chosen date

  Scenario: Change the delivery date
    Given a customer on the second step
    When the customer clicks "Canvia la data"
    Then the calendar is shown with the chosen date

    
  Scenario: Choose the delivery method
    Given a customer on the second step of the checkout
    When no delivery method is chosen
    Then the "Continua" button is disabled

  Scenario: Home delivery with an address of Barcelona
    Given a customer who chose home delivery
    When the customer writes an address with the postal code "08036"
    And clicks "Continua"
    Then the review shows the address

  Scenario: Home delivery outside Barcelona
    Given a customer who chose home delivery
    When the customer writes the postal code "28001"
    And clicks "Continua"
    Then the page shows "El codi postal ha de ser de Barcelona (080xx)"
    And the step does not change

  Scenario: Pickup in a point
    Given a customer who chose to pick up the order
    Then the map and the list of pickup points are shown

    
  Scenario: Summary of a home delivery
    Given a customer on the review step with a home delivery
    And products for 92,00 €
    Then the summary shows the date, the address and the products
    And the subtotal is 92,00 €, the shipping 5,00 € and the total 97,00 €

  Scenario: Summary of a pickup
    Given a customer on the review step with a pickup
    And products for 92,00 €
    Then the shipping is "Gratuït"
    And the total is 92,00 €

  Scenario: Shipping fee not available
    Given the shipping fee can not be loaded
    When a customer reviews a home delivery
    Then no total is shown
    And the customer can retry