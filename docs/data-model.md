# Data model

PostgreSQL database managed with Prisma. The schema is in [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma).

```mermaid
erDiagram
  USER ||--o{ ORDER : places
  USER ||--o{ ORDER_STATUS_HISTORY : changes
  CATEGORY ||--o{ PRODUCT : groups
  PRODUCT ||--|{ PRODUCT_VARIANT : "has sizes"
  PRODUCT_VARIANT ||--o{ ORDER_ITEM : "is ordered in"
  ORDER ||--|{ ORDER_ITEM : contains
  ORDER ||--o{ ORDER_STATUS_HISTORY : "keeps history"
  PICKUP_POINT ||--o{ ORDER : "is chosen for"

  USER {
    int id PK
    string firebaseUid UK
    string name
    string email UK
    Role role "customer or admin"
    datetime createdAt
  }
  CATEGORY {
    int id PK
    string name
    string slug UK
  }
  PRODUCT {
    int id PK
    int categoryId FK
    string name
    string description
    string imageUrl "Cloudinary, optional"
    boolean isGlutenFree
    boolean isPlantMilk
    boolean isVegan
    string allergens
    boolean isActive
  }
  PRODUCT_VARIANT {
    int id PK
    int productId FK
    string name "size, for example 6 racions"
    int priceCents
    int stock
    boolean isActive
    int sortOrder
  }
  PICKUP_POINT {
    int id PK
    string name
    string address
    string city
    decimal latitude
    decimal longitude
    string openingHours
    boolean isActive
  }
  ORDER {
    int id PK
    string orderNumber UK
    string idempotencyKey "unique per user"
    int userId FK
    OrderStatus status
    DeliveryMethod deliveryMethod
    date deliveryDate
    int pickupPointId FK "pickup only"
    string shippingAddress "delivery only"
    int subtotalCents
    int shippingCents
    int totalCents
  }
  ORDER_ITEM {
    int id PK
    int orderId FK
    int variantId FK
    string productName "copy at the time of the order"
    string variantName
    int unitPriceCents
    int quantity
    int lineTotalCents
  }
  ORDER_STATUS_HISTORY {
    int id PK
    int orderId FK
    OrderStatus fromStatus
    OrderStatus toStatus
    int changedBy FK
    datetime changedAt
  }
  CLOSED_DATE {
    int id PK
    date date UK
    string reason
  }
  SETTING {
    string key PK "min_prep_hours, max_orders_per_day, shipping_fee_cents"
    string value
  }
```

## Notes

- **Money in cents** (`priceCents`, `totalCents`…) as integers: no rounding errors.
- **Order items copy** the product name, size and price, so an old order does not change when a product is edited.
- **`(userId, idempotencyKey)` is unique**: the same checkout sent twice creates only one order.
- **Indexes** on `(deliveryDate, status)` for the calendar and the daily capacity, and on `(categoryId, isActive)` for the catalogue.
- **Settings** and **closed dates** are tables, so the bakery rules can change without a new deploy.
