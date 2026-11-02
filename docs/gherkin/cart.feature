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