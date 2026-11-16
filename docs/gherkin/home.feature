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
    
  Scenario: The home photo fills the screen and moves
    Given a visitor on the home page
    When the page is shown
    Then the photo of the cake fills the screen under the header with a dark gradient
    And the photo zooms in and out slowly
    And the title "Les coses bones volen el seu temps." appears moving up

  Scenario: The visitor stops the movement
    Given the home photo is moving
    When the visitor clicks "Atura l'animació"
    Then the photo stops
    And the button says "Reprodueix l'animació"

  Scenario: Reduced motion
    Given a visitor who asked the system to reduce motion
    When the home page is shown
    Then the photo does not move and there is no button to stop it
