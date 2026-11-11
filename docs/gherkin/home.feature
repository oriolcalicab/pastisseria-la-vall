Feature: Home page

  Scenario: Visitor opens the home page
    Given a visitor on "/"
    Then the page shows "Les coses bones volen el seu temps."
    And "Veure productes" goes to "/productes"

  Scenario: Favourite products
    Given there are 5 products available
    When a visitor opens "/"
    Then "Els preferits de casa" shows 4 products

  Scenario: How it works
    Given a visitor on "/"
    When the visitor clicks "Com funciona"
    Then the page scrolls to the 3 steps

  Scenario: Backend error on the home page
    Given the backend is stopped
    When a visitor opens "/"
    Then the page shows "No hem pogut carregar els productes."
    And the visitor can retry
    