Feature: Edit a product

  Scenario: The admin opens a product to edit it
    Given a logged admin on the products page
    When the admin clicks "Edita" on a product
    Then the form shows the saved name, description, options and variants
    And the prices are in euros

  Scenario: The admin changes the price of a variant
    Given the form of a product with a variant of 39,00 €
    When the admin changes the price to 42,00 € and saves
    Then the list shows "Producte … desat correctament"
    And the public catalog shows the new price

  Scenario: The admin adds a variant to a product
    Given the form of a product
    When the admin adds a new variant and saves
    Then the product has the new variant

  Scenario: A saved variant can not be removed
    Given the form of a product with a saved variant
    Then there is no button to remove it
    And the form explains that it can be deactivated in the products list

  Scenario: A variant of another product
    Given a logged admin
    When the admin sends a variant that belongs to another product
    Then the backend responds 400
    And nothing is saved
