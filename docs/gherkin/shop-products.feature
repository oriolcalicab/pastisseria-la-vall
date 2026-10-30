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

    
  Scenario: Products are paginated
    Given there are 13 products available
    When a visitor opens "/productes"
    Then the page shows the first 12 products
    And the page shows "Pàgina 1 de 2"

  Scenario: Only one page of products
    Given there are 8 products available
    When a visitor opens "/productes"
    Then the page buttons are not shown

  Scenario: Too many products at once
    Given a visitor
    When the visitor calls "/api/products?pageSize=51"
    Then the backend responds 400

  Scenario: No products available
    Given there are no products available
    When a visitor opens "/productes"
    Then the page shows "De moment no hi ha cap producte disponible."

  Scenario: Backend error
    Given the backend is stopped
    When a visitor opens "/productes"
    Then the page shows "No s'han pogut carregar els productes."
    And the visitor can retry

  Scenario: Product without image
    Given a product without image
    When a visitor opens "/productes"
    Then the card shows the placeholder image