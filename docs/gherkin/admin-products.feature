Feature: Admin products list

  Scenario: Admin opens the products list
    Given a logged admin
    When the admin opens "/admin/productes"
    Then the page shows a table with name, category, from price, variants, stock and status

  Scenario: Products are paginated
    Given there are 25 products
    When the admin opens the products list
    Then the page shows the first 20 products
    And the page shows "Pàgina 1 de 2"
    And the "« Anterior" button is disabled

  Scenario: Admin goes to the next page
    Given the admin is on the first page of two
    When the admin clicks "Següent »"
    Then the page shows the second page
    And the "Següent »" button is disabled

  Scenario: Search by name ignoring accents
    Given a product called "Pastís de xocolata"
    When the admin searches "pastis"
    Then the list shows "Pastís de xocolata"

  Scenario: Search keeps working across pages
    Given a search with two pages of results
    When the admin clicks "Següent »"
    Then the second page of the same search is shown

  Scenario: Search without results
    Given no product matches "zzz"
    When the admin searches "zzz"
    Then the page shows "No hi ha cap producte que coincideixi amb "zzz"."

  Scenario: Invalid page
    Given a logged admin
    When the admin calls "/api/admin/products?page=0"
    Then the backend responds 400

  Scenario: Customer asks for the products
    Given a logged customer
    When the customer calls "/api/admin/products"
    Then the backend responds 403

  Scenario: Visitor asks for the products
    Given a visitor without token
    When the visitor calls "/api/admin/products"
    Then the backend responds 401