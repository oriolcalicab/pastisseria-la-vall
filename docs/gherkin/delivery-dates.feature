Feature: Delivery dates

  Background:
    Given it is Monday 2 November 2026 at 10:00 in Barcelona

  Scenario: Day with enough time
    When a visitor asks for the delivery dates of November
    Then Thursday 5 November is available

  Scenario: Past day
    When a visitor asks for the delivery dates of November
    Then Sunday 1 November is blocked because it is past

  Scenario: Less than 48 hours
    When a visitor asks for the delivery dates of November
    Then Wednesday 4 November is blocked because there is not enough time

  Scenario: Exactly 48 hours
    Given it is Tuesday 3 November 2026 at 00:00 in Barcelona
    When a visitor asks for the delivery dates of November
    Then Thursday 5 November is available

  Scenario: Sunday
    When a visitor asks for the delivery dates of November
    Then Sunday 8 November is blocked

  Scenario: Holiday
    Given 8 December is a closed date
    When a visitor asks for the delivery dates of December
    Then 8 December is blocked

  Scenario: Full day
    Given 5 orders that are not cancelled for 6 November
    When a visitor asks for the delivery dates of November
    Then 6 November is blocked because it is full

  Scenario: Cancelled orders do not count
    Given 4 orders and 1 cancelled order for 6 November
    When a visitor asks for the delivery dates of November
    Then 6 November is available

  Scenario: Invalid month
    When a visitor calls "/api/delivery-dates?month=2026-13"
    Then the backend responds 400

    
  Scenario: Several rules block the same day
    Given Sunday 15 November is also a holiday and full
    When a visitor asks for the delivery dates of November
    Then 15 November is blocked because it is Sunday

  Scenario: More orders than the maximum
    Given 6 orders for 6 November and a maximum of 5
    When a visitor asks for the delivery dates of November
    Then 6 November is blocked because it is full