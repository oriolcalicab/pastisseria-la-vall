Feature: Admin activates and deactivates products

  Scenario: Admin deactivates a product
    Given a logged admin on "/admin/productes"
    And an active product
    When the admin clicks "Desactiva"
    Then the product shows "Inactiu" without reloading the list
    And it stays inactive after reloading the page

  Scenario: Admin activates a product again
    Given an inactive product
    When the admin clicks "Activa"
    Then the product shows "Actiu"

  Scenario: Admin deactivates a variant
    Given the variants of a product are visible
    When the admin deactivates the cheapest variant
    Then only that variant shows "Inactiu"
    And the "from" price uses the next active variant

  Scenario: Variant of another product
    Given a logged admin
    When the admin calls "/api/admin/products/7/variants/12" and the variant is of another product
    Then the backend responds 404

  Scenario: Product that does not exist
    Given a logged admin
    When the admin calls "/api/admin/products/9999"
    Then the backend responds 404

  Scenario: Invalid status
    Given a logged admin
    When the admin sends isActive as the text "false"
    Then the backend responds 400

  Scenario: Backend is not running
    Given the backend is stopped
    When the admin clicks "Desactiva"
    Then the page shows "No s'ha pogut canviar l'estat"

  Scenario: Customer tries to change a product
    Given a logged customer
    When the customer calls "/api/admin/products/7"
    Then the backend responds 403

  Scenario: Visitor tries to change a product
    Given a visitor without token
    When the visitor calls "/api/admin/products/7"
    Then the backend responds 401