Feature: Admin stats

  Scenario: The admin asks for the stats of the last 30 days
    Given orders made between "2026-10-14" and "2026-11-12"
    When the admin asks for the stats from "2026-10-14" to "2026-11-12"
    Then the backend returns the revenue, the number of orders, the orders by status, the orders by delivery method, the top products and the sales of each day

  Scenario: Cancelled orders do not count as sales
    Given a delivered order of 25 € and a cancelled order of 30 €
    When the admin asks for the stats of that day
    Then the revenue is 25 €
    And the orders by status show one cancelled order

  Scenario: Days without sales
    Given no orders on the 11th of November
    When the admin asks for the stats from "2026-11-10" to "2026-11-12"
    Then the 11th of November appears with 0 orders and 0 €

  Scenario: Range backwards
    Given a logged admin
    When the admin asks for the stats from "2026-11-12" to "2026-10-14"
    Then the backend responds 400

  Scenario: Impossible date
    Given a logged admin
    When the admin asks for the stats from "2026-02-30"
    Then the backend responds 400

  Scenario: A visitor without session
    Given a visitor without token
    When the visitor asks for the stats
    Then the backend responds 401

  Scenario: A customer asks for the stats
    Given a logged customer
    When the customer asks for the stats
    Then the backend responds 403
