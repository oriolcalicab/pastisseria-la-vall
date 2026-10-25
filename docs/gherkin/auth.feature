Feature: Authentication

  Scenario: Register with an email that already exists
    Given an email that is already registered
    When the visitor submits the register form
    Then the page shows "Aquest correu ja està registrat"

  Scenario: Login with wrong credentials
    Given a registered user
    When the user logs in with a wrong password
    Then the page shows "Correu o contrasenya incorrectes"

  Scenario: Request with an expired token
    Given a request with an expired token
    When it reaches a protected endpoint
    Then the backend responds 401

  Scenario: Access a private page without session
    Given a visitor without session
    When the visitor opens "/compte"
    Then the visitor is redirected to "/login"
    And after logging in the visitor returns to "/compte"