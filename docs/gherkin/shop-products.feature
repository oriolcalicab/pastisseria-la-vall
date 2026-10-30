Feature: Public products list

  Scenario: Visitor lists the products
    Given a visitor without session
    When the visitor calls "/api/products"
    Then the backend responds 200 with the first page of products

  Scenario: Inactive products are hidden
    Given a product that is not active
    When a visitor lists the products
    Then the product is not in the list

  Scenario: Products without active variants are hidden
    Given an active product with all its variants inactive
    When a visitor lists the products
    Then the product is not in the list

  Scenario: Inactive variants are hidden
    Given a product with an active and an inactive variant
    When a visitor lists the products
    Then only the active variant is in the list

  Scenario: Filter by category
    Given products in several categories
    When a visitor calls "/api/products?category=cupcakes"
    Then only the cupcakes are in the list

  Scenario: Stock is not public
    Given a variant with 5 units and another one with 0
    When a visitor lists the products
    Then the variants show inStock true and false
    And the number of units is not shown

  Scenario: Invalid category
    Given a visitor
    When the visitor calls "/api/products?category=Cupcakes"
    Then the backend responds 400