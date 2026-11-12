Feature: Shop header and footer

  Scenario: Every shop page has the header and the footer
    Given a visitor on "/login"
    Then the header shows the La Vall logo, "Inici", "Productes" and the cart
    And the footer shows the La Vall seal

  Scenario: The current page is marked
    Given a visitor on "/productes"
    Then the "Productes" link is shown in caramel

  Scenario: Visitor without session
    Given a visitor without session
    Then the header shows "Inicia sessió"

  Scenario: Logged customer
    Given a logged customer
    Then the header shows "El meu compte"

  Scenario: Cart units in the header
    Given a cart with 3 units
    Then the cart link says "Carretó, 3 unitats"

  Scenario: Mobile menu
    Given a visitor on a phone
    When the visitor clicks "Obre el menú"
    Then the mobile menu shows "Inici", "Productes" and "Inicia sessió"
    And clicking a link closes the menu

  Scenario: Unknown address
    Given a visitor
    When the visitor opens "/no-existeix"
    Then the page shows "Pàgina no trobada" with the header and the footer

  Scenario: Account pages use the shop layout
    Given I am on "/login"
    Then I see the main menu "Menú principal"
    And I see the footer with "Fet a mà, per compartir."
