Feature: Admin access

  Scenario: Visitor opens the admin area
    Given a visitor without session
    When the visitor opens "/admin"
    Then the visitor is redirected to "/login"
    And after logging in as admin the visitor returns to "/admin"

  Scenario: Customer opens the admin area
    Given a logged customer
    When the customer opens "/admin"
    Then the page shows "Accés denegat"

  Scenario: Admin opens the admin area
    Given a logged admin
    When the admin opens "/admin"
    Then the page shows the admin side menu

  Scenario: Customer calls an admin endpoint
    Given a logged customer
    When the customer calls "/api/admin/ping"
    Then the backend responds 403

  Scenario: Customer tries to send an admin role
    Given a logged customer
    When the customer calls "/api/admin/ping" with role "admin" in the request
    Then the backend responds 403

  Scenario: Register asking for admin role
    Given a new user
    When the user registers sending role "admin"
    Then the user is saved with role "customer"