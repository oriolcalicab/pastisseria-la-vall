Feature: Backend security

  Scenario: The published frontend can use the API
    Given the backend allows "https://pastisseria-la-vall.vercel.app"
    When the frontend calls the API from the browser
    Then the browser is allowed to read the answer

  Scenario: Another website cannot use the API from a browser
    Given the backend allows only its own frontend
    When "https://evil.example" calls the API from a browser
    Then the answer has no permission for that website

  Scenario: An unexpected error does not show internal details
    Given a request that fails inside the backend
    When the backend answers
    Then the status is 500 with "Hi ha hagut un error al servidor. Torna-ho a provar."
    And the answer does not contain the internal message

  Scenario: A body that is not JSON
    Given a request with a broken JSON body
    When the backend answers
    Then the status is 400 with "El cos de la petició no és un JSON vàlid"

  Scenario: A route that does not exist
    When the client calls "/api/no-existeix"
    Then the status is 404 with "Aquesta ruta no existeix"

  Scenario: Too many requests
    Given a client that has already created 10 orders in 15 minutes
    When it tries to create another one
    Then the status is 429 with "Massa peticions. Torna-ho a provar d'aquí a una estona."
