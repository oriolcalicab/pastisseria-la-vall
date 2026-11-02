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