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