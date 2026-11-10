Feature: Admin creates a product

  Scenario: Admin creates a product with variants
    Given a logged admin on "/admin/productes/nou"
    When the admin fills the product with one variant of 39,50 € and stock 5
    And saves the form
    Then the product is created with a price of 3950 cents
    And the list shows "Producte "..." creat correctament"

  Scenario: Product without variants
    Given a logged admin
    When the admin sends a product without variants
    Then the backend responds 400 with "El producte ha de tenir com a mínim una variant"

  Scenario: Variant with a negative price in the form
    Given a logged admin on "/admin/productes/nou"
    When the admin writes "-5" as the price of the second variant
    And saves the form
    Then the price of the second variant is marked as wrong
    And the product is not sent

  Scenario: Variant with a negative price in the API
    Given a logged admin
    When the admin sends a variant with priceCents -100
    Then the backend responds 400 with a message about "variant 1"

  Scenario: Variant with stock 0
    Given a logged admin
    When the admin sends a variant with stock 0
    Then the product is created

  Scenario: Customer tries to create a product
    Given a logged customer
    When the customer sends a product to "/api/admin/products"
    Then the backend responds 403

  Scenario: Visitor tries to create a product
    Given a visitor without token
    When the visitor sends a product to "/api/admin/products"
    Then the backend responds 401