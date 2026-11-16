Feature: Public product detail

  Scenario: Visitor asks for a product
    Given an available product with variants
    When a visitor calls "/api/products/7"
    Then the backend responds 200 with the product and its active variants
    And the variants show inStock and not the number of units

  Scenario: Product that does not exist
    Given no product with this id
    When a visitor calls "/api/products/9999"
    Then the backend responds 404

  Scenario: Inactive product
    Given a product that is not active
    When a visitor asks for it
    Then the backend responds 404

  Scenario: Product without active variants
    Given an active product with all its variants inactive
    When a visitor asks for it
    Then the backend responds 404

  Scenario: Invalid id
    Given a visitor
    When the visitor calls "/api/products/abc"
    Then the backend responds 400

    
  Scenario: Visitor chooses a variant
    Given a product page with two variants in stock
    When the visitor chooses the other variant
    Then the price changes

  Scenario: Sold out variant
    Given a product with a variant without stock
    When a visitor opens the product page
    Then that variant shows "Esgotat" and can not be chosen
    And the first variant in stock is selected

   Scenario: Product not available
    Given a product that is not available
    When a visitor opens its page
    Then the page shows "Pàgina no trobada"

  Scenario: Unknown route
    Given a visitor
    When the visitor opens a route that does not exist
    Then the page shows "Pàgina no trobada"
    And the visitor can go to the products

    
  Scenario: Inactive variant
    Given a product with an active and an inactive variant
    When a visitor opens the product page
    Then only the active variant can be chosen

  Scenario: Id too big
    Given a visitor
    When the visitor calls "/api/products/2147483648"
    Then the backend responds 400

    
  Scenario: Shared workshop notice
    Given a visitor on a product page
    Then the page shows "Ingredients i al·lèrgens"
    And it warns that the workshop is shared

  Scenario: Sold out size
    Given a product with a sold out size
    When a visitor opens the product
    Then that size card says "Esgotat"
    And it cannot be selected
