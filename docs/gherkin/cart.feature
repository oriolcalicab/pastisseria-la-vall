Feature: Cart

  Scenario: Add a variant
    Given an empty cart
    When a visitor adds a variant
    Then the cart has one line with that variant

  Scenario: Add a variant that is already in the cart
    Given a cart with two units of a variant
    When the visitor adds one more
    Then the cart has one line with three units

  Scenario: Keep the cart after reloading
    Given a cart with products
    When the visitor reloads the page
    Then the cart has the same products

  Scenario: Corrupt saved cart
    Given a saved cart that is not valid
    When the visitor opens the shop
    Then the cart is empty and the page works

    
  Scenario: Add from the product page
    Given a product page with a variant chosen
    When the visitor clicks "Afegeix al carretó"
    Then the variant is in the cart
    And the header count goes up

  Scenario: Change the quantity
    Given a line in the cart
    When the visitor clicks "+"
    Then the subtotal and the total change

  Scenario: Minimum quantity
    Given a line with one unit
    Then the "−" button is disabled

  Scenario: Remove a line
    Given a cart with one line
    When the visitor clicks "Elimina"
    Then the page shows "El teu carretó està buit."

    
  Scenario: Price changed
    Given a line in the cart with an old price
    When the visitor opens "/carreto"
    Then the cart shows the current price
    And the page warns that the price changed

  Scenario: Not enough stock
    Given a line with more units than the stock
    When the visitor opens "/carreto"
    Then the quantity is reduced to the stock
    And the page warns about it

  Scenario: Sold out variant
    Given a line of a variant without stock
    When the visitor opens "/carreto"
    Then the line is removed
    And the page explains that it is sold out

  Scenario: Inactive variant
    Given a line of a variant that is not active
    When the visitor opens "/carreto"
    Then the line is removed
    And the page explains that it is not available

  Scenario: Validation fails
    Given the backend is stopped
    When the visitor opens "/carreto"
    Then the cart does not change
    And the page warns that it could not be checked

    
  Scenario: Empty cart
    Given an empty cart
    When the visitor opens "/carreto"
    Then the page shows "El teu carretó està buit."
    And the cart is not sent to the backend

  Scenario: Keep the adjusted cart after reloading
    Given a cart that the backend adjusted
    When the visitor reloads the page
    Then the adjusted cart is kept
    And there are no warnings