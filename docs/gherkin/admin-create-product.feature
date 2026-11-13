Feature: Admin creates a product

  Scenario: Admin creates a product with variants
    Given a logged admin on "/admin/productes/nou"
    When the admin fills the product with one variant of 39,50 € and stock 5
    And saves the form
    Then the product is created with a price of 3950 cents
    And the list shows "Producte "..." creat correctament"

  Scenario: Product without variants
    Given a logged admin
    When the admin sends a product without variants
    Then the backend responds 400 with "El producte ha de tenir com a mínim una variant"

  Scenario: Variant with a negative price in the form
    Given a logged admin on "/admin/productes/nou"
    When the admin writes "-5" as the price of the second variant
    And saves the form
    Then the price of the second variant is marked as wrong
    And the product is not sent

  Scenario: Variant with a negative price in the API
    Given a logged admin
    When the admin sends a variant with priceCents -100
    Then the backend responds 400 with a message about "variant 1"

  Scenario: Variant with stock 0
    Given a logged admin
    When the admin sends a variant with stock 0
    Then the product is created

  Scenario: Customer tries to create a product
    Given a logged customer
    When the customer sends a product to "/api/admin/products"
    Then the backend responds 403

  Scenario: Visitor tries to create a product
    Given a visitor without token
    When the visitor sends a product to "/api/admin/products"
    Then the backend responds 401

      Scenario: The admin adds a photo to a new product
    Given the admin is on the new product form
    When the admin picks a JPG photo
    Then the form shows "Pujant la imatge..." and then a preview of the photo
    And the product is saved with the address of the photo in Cloudinary
    And the photo is shown in the shop

  Scenario: The admin picks a file that is not an image
    Given the admin is on the new product form
    When the admin picks a PDF
    Then the form shows "Tria una imatge JPG, PNG o WebP"
    And nothing is uploaded

  Scenario: Only images of Cloudinary are saved
    Given a product with the image "https://evil.example/pastis.jpg"
    When it is sent to the backend
    Then the backend responds 400 with "La imatge ha de ser una adreça de Cloudinary"

  Scenario: A customer cannot sign uploads
    Given a logged customer
    When the customer asks for "/api/admin/uploads/signature"
    Then the backend responds 403
