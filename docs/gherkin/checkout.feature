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

    
  Scenario: The day became full before confirming
    Given a customer on the review step
    And the chosen day became full
    When the customer clicks "Confirma la comanda"
    Then the page shows "La data de lliurament ja no està disponible"
    And the customer can click "Tria una altra data"
    And the first step is shown without a date

  Scenario: The pickup point was deactivated before confirming
    Given a customer on the review step with a pickup point
    And the pickup point was deactivated
    When the customer clicks "Confirma la comanda"
    Then the page shows "El punt de recollida ja no està disponible"
    And the customer can click "Tria un altre punt de recollida"
    And the second step is shown without a pickup point

  Scenario: The cart changed before confirming
    Given a customer on the review step
    And the price of a product changed
    When the customer clicks "Confirma la comanda"
    Then the page shows "Alguns productes han canviat. Revisa el carretó"
    And the cart keeps its products
    And there is a link to the cart

  Scenario: The order could not be sent
    Given a customer on the review step
    And the backend can not be reached
    When the customer clicks "Confirma la comanda"
    Then the page shows "No s'ha pogut confirmar la comanda. Torna-ho a provar"
    And the customer can confirm the order again

  Scenario: The city must be Barcelona for a home delivery
    Given a customer who chooses home delivery
    When the customer writes "Madrid" as the city and "08036" as the postal code
    Then the form shows "Només entreguem a Barcelona: la població ha de ser Barcelona"
    And the order is not sent

  Scenario: The backend rejects another city with a Barcelona postal code
    Given an order to deliver at "Carrer Major, 1", "Madrid", "08036"
    When it is sent to the backend
    Then the backend responds 400 with "Només entreguem a Barcelona: la població ha de ser Barcelona"

  Scenario: The city can be written in different ways
    Given a home delivery with the postal code "08036"
    When the customer writes "barcelona" or "BARCELONA" as the city
    Then the address is accepted
