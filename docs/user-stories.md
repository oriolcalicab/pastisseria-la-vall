# User stories

Each story follows the format "As a … I want … so that …", with its acceptance criteria. The detailed scenarios are in [`gherkin/`](gherkin).

## Shop

**US-01 · Browse the catalogue**
As a visitor, I want to see all the cakes and cupcakes so that I can choose what to order.
- Every active product shows its photo, name, starting price and dietary tags.
- I can filter by gluten-free, plant milk and vegan, and clear the filters with "Tots".
- Inactive products are not shown.

**US-02 · See a product**
As a visitor, I want to see the sizes, prices and allergens of a product so that I know what I buy.
- Each size shows its price, and sold-out sizes cannot be chosen.
- The allergens are listed when the product has them.

**US-03 · Cart**
As a customer, I want to keep products in a cart so that I can order several at once.
- I can add, change the quantity and remove products.
- The cart is kept after closing the browser.
- Before the checkout, the cart is checked with the backend (prices, stock and active products).

**US-04 · Choose the delivery day**
As a customer, I want to see which days are available so that I don't choose a day the bakery cannot deliver.
- Days less than 48 hours away, Sundays, closed days and full days cannot be chosen, and the reason is shown.

**US-05 · Choose how to receive the order**
As a customer, I want to choose between home delivery and pickup.
- Home delivery only accepts Barcelona: postal code 080xx and city Barcelona. It costs 5 €.
- Pickup shows the shops on a map and in a list. The chosen shop stands out in both.

**US-06 · Confirm the order**
As a customer, I want to review and confirm my order so that the bakery receives it.
- The review shows the products, the day, the delivery method and the total.
- Clicking twice does not create two orders.
- If the day is full or there is no stock, I see what to change.

**US-07 · Follow my orders**
As a customer, I want to see my orders and their status.
- The list shows the number, the day and the status of each order, and the detail shows everything.
- I can only see my own orders.

## Accounts

**US-08 · Sign up and sign in**
As a visitor, I want to create an account and sign in.
- Errors are shown under each field, and a used email is reported clearly.
- After signing in, I go back to the page I wanted. An admin goes straight to the dashboard.
- I can reset a forgotten password.

## Admin

**US-09 · Dashboard**
As an admin, I want to see the sales of a period so that I know how the business is going.
- Revenue, orders, average order value and pending orders, for the last 7 or 30 days, this month or my own dates.
- Sales per day (chart with a table alternative), orders by status and by delivery method, best-selling products.
- Cancelled orders do not count as revenue.

**US-10 · Manage orders**
As an admin, I want to move orders through their statuses so that the team knows what to do.
- Only the allowed next statuses are offered, and cancelling asks for confirmation and returns the stock.
- If someone else changed the order, I see its current status.

**US-11 · Delivery calendar**
As an admin, I want to see the deliveries of each day so that I can plan the kitchen.
- Month, week, day and list views, with a colour per status and a legend.
- Filters by status and by delivery method, asked to the backend.
- Clicking an order opens its summary, where I can change its status.

**US-12 · Manage products**
As an admin, I want to create and edit products so that the catalogue is always up to date.
- Name, category, description, allergens, dietary options and sizes with price and stock are validated.
- I can upload a JPG, PNG or WebP photo up to 5 MB.
- I can activate or deactivate products and sizes, and search and filter the list by category and status.
