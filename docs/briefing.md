# Functional briefing

## The client

Pastisseria La Vall is a small artisan bakery in Barcelona with four shops (Gràcia, Eixample, Sant Antoni and Poblenou). It makes cakes and cupcakes in small batches, with gluten-free, plant-milk and vegan options. Until now, orders were taken by phone and written in a notebook.

## The problem

- Orders by phone take time and mistakes happen (wrong day, wrong size, forgotten orders).
- The kitchen can only prepare a limited number of orders per day and needs at least 48 hours.
- The bakery has no clear view of what has to be delivered each day or of how sales are going.

## Goals

1. Let customers order online, any time, and choose the delivery day and method.
2. Never accept more orders than the kitchen can prepare.
3. Give the bakery one place to manage products, orders and deliveries.
4. Show the sales of a period at a glance.
5. Have a website with its own visual identity, accessible and usable on mobile.

## Users

| User | Needs |
| --- | --- |
| Visitor | Browse the catalogue, see prices, sizes and allergens |
| Customer | Order, choose the day and the delivery method, follow the order |
| Admin (bakery staff) | Manage products and photos, prepare and deliver orders, see the statistics |

## Business rules

- Prices are stored in cents to avoid rounding errors.
- An order needs at least **48 hours** of preparation.
- No deliveries on **Sundays** or on the closed days set by the bakery.
- Maximum **5 orders per delivery day** (configurable).
- Home delivery only in **Barcelona** (postal codes 080xx); shipping costs 5 €. Pickup at a shop is free.
- Stock is reserved when an order is created and returned if the order is cancelled.
- Order status: `pending → preparing → ready → delivered`, or `cancelled` from any status before delivery.

## Scope

**Included:** catalogue, cart, checkout, customer account and order history, admin dashboard, orders, delivery calendar, products with photos.

**Not included:** online payment (orders are paid on delivery or pickup), emails, invoices, multiple languages.
