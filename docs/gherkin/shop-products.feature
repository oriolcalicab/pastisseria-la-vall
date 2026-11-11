Feature: Public products list

  Scenario: Visitor lists the products
    Given a visitor without session
    When the visitor calls "/api/products"
    Then the backend responds 200 with the first page of products

  Scenario: Inactive products are hidden
    Given a product that is not active
    When a visitor lists the products
    Then the product is not in the list

  Scenario: Products without active variants are hidden
    Given an active product with all its variants inactive
    When a visitor lists the products
    Then the product is not in the list

  Scenario: Inactive variants are hidden
    Given a product with an active and an inactive variant
    When a visitor lists the products
    Then only the active variant is in the list

  Scenario: Filter by category
    Given products in several categories
    When a visitor calls "/api/products?category=cupcakes"
    Then only the cupcakes are in the list

  Scenario: Stock is not public
    Given a variant with 5 units and another one with 0
    When a visitor lists the products
    Then the variants show inStock true and false
    And the number of units is not shown

  Scenario: Invalid category
    Given a visitor
    When the visitor calls "/api/products?category=Cupcakes"
    Then the backend responds 400

    
  Scenario: Products are paginated
    Given there are 13 products available
    When a visitor opens "/productes"
    Then the page shows the first 12 products
    And the page shows "Pàgina 1 de 2"

  Scenario: Only one page of products
    Given there are 8 products available
    When a visitor opens "/productes"
    Then the page buttons are not shown

  Scenario: Too many products at once
    Given a visitor
    When the visitor calls "/api/products?pageSize=51"
    Then the backend responds 400

  Scenario: No products available
    Given there are no products available
    When a visitor opens "/productes"
    Then the page shows "De moment no hi ha cap producte disponible."

  Scenario: Backend error
    Given the backend is stopped
    When a visitor opens "/productes"
    Then the page shows "No s'han pogut carregar els productes."
    And the visitor can retry

  Scenario: Product without image
    Given a product without image
    When a visitor opens "/productes"
    Then the card shows the placeholder image

    
  Scenario: Filter by one diet
    Given vegan and non vegan products
    When a visitor calls "/api/products?diet=vegan"
    Then only the vegan products are in the list

  Scenario: Combine several diets
    Given a vegan product with gluten and a vegan product without gluten
    When a visitor calls "/api/products?diet=vegan,gluten_free"
    Then only the vegan product without gluten is in the list

  Scenario: Unknown diet
    Given a visitor
    When the visitor calls "/api/products?diet=keto"
    Then the backend responds 400

    
  Scenario: Visitor filters by diet in the page
    Given a visitor on "/productes"
    When the visitor checks "Vegà"
    Then only the vegan products are shown

  Scenario: No product matches the diets
    Given no product matches the selected diets
    When a visitor checks them
    Then the page shows "No hi ha cap producte amb aquests filtres."
    And the visitor can remove the filters

  Scenario: Changing a diet goes back to the first page
    Given a visitor on the second page of products
    When the visitor checks a diet
    Then the first page is shown

    
  Scenario: Combine a diet with a category
    Given vegan cupcakes and vegan cakes
    When a visitor calls "/api/products?diet=vegan&category=cupcakes"
    Then only the vegan cupcakes are in the list

  Scenario: Diets are kept when changing page
    Given a filtered list with two pages
    When the visitor clicks "Següent »"
    Then the second page of the same filter is shown

    
  Scenario: Visitor shows all the products again
    Given a visitor on "/productes" with "Vegà" checked
    When the visitor clicks "Tots"
    Then no diet is checked
    And all the products are shown

  Scenario: Number of products
    Given there are 13 products available
    When a visitor opens "/productes"
    Then the page shows "13 productes"

  Scenario: Diet tags on the cards
    Given a vegan product with plant milk
    When a visitor opens "/productes"
    Then its card shows "Llet vegetal" and "Vegà"
