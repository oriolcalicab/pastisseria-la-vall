Feature: Delivery calendar

  Scenario: Choose an available day
    Given the delivery calendar
    When the customer clicks an available day
    Then the day is selected
    And the page shows "Data triada" with the day

  Scenario: Blocked day
    Given a Sunday in the calendar
    When the customer clicks it
    Then it is not selected
    And the screen reader explains why

  Scenario: Use the keyboard
    Given the focus on a day of the calendar
    When the customer presses the arrow keys
    Then the focus moves one day or one week
    And pressing Enter selects the day

  Scenario: Change the month with the keyboard
    Given the focus on the last day of the month
    When the customer presses the right arrow
    Then the calendar shows the next month

  Scenario: First month
    Given the calendar on the current month
    Then the "« Anterior" button is disabled