Feature: Admin dashboard

  Scenario: The dashboard opens with the last 30 days
    Given a logged admin and orders made in the last 30 days
    When the admin opens "/admin"
    Then the period "Últims 30 dies" is selected
    And the dashboard shows "Ingressos", "Comandes", "Tiquet mitjà" and "Pendents"
    And it shows "Vendes per dia", "Comandes per estat", "Tipus d'entrega" and "Productes més venuts"

  Scenario: Every block follows the new period
    Given the admin is on the dashboard
    When the admin clicks "Últims 7 dies"
    Then the stats of the last 7 days are asked for
    And every block shows the figures of that period

  Scenario: The admin writes their own dates
    Given the admin is on the dashboard
    When the admin writes "2026-11-01" in "Des de" and clicks "Aplica"
    Then the stats from the 1st of November to today are asked for
    And no period button is selected

  Scenario: A period that goes backwards
    Given the admin is on the dashboard
    When the admin writes a start date after the end date and clicks "Aplica"
    Then the dashboard shows "La data d'inici no pot ser posterior a la final."
    And the period does not change

  Scenario: The chart as a table
    Given the admin is on the dashboard
    When the admin clicks "Veure com a taula"
    Then a table shows the orders and the revenue of each day

  Scenario: A period without orders
    Given no orders in the chosen period
    When the admin opens the dashboard
    Then the dashboard shows "Encara no hi ha comandes en aquestes dates."

  Scenario: The stats cannot be loaded
    Given the backend does not answer
    When the admin opens the dashboard
    Then the dashboard shows "No hem pogut carregar les dades del tauler."
    And the admin can click "Torna-ho a provar"
