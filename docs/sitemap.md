# Sitemap

```mermaid
flowchart TD
  home["/ Home"]
  products["/productes Catalogue"]
  detail["/productes/:id Product"]
  cart["/carreto Cart"]
  login["/login Sign in"]
  register["/registre Sign up"]
  forgot["/contrasenya-oblidada Forgotten password"]
  checkout["/checkout Checkout"]
  confirmation["/confirmacio/:id Confirmation"]
  orders["/comandes My orders"]
  order["/comandes/:id Order detail"]
  account["/compte My account"]

  admin["/admin Dashboard"]
  adminOrders["/admin/comandes Orders"]
  adminOrder["/admin/comandes/:id Order detail"]
  calendar["/admin/calendari Delivery calendar"]
  adminProducts["/admin/productes Products"]
  newProduct["/admin/productes/nou New product"]
  editProduct["/admin/productes/:id/editar Edit product"]

  home --> products --> detail --> cart --> checkout --> confirmation
  home --> login
  login --> register
  login --> forgot
  account --> orders --> order

  admin --> adminOrders --> adminOrder
  admin --> calendar --> adminOrder
  admin --> adminProducts
  adminProducts --> newProduct
  adminProducts --> editProduct

  subgraph Public
    home
    products
    detail
    cart
    login
    register
    forgot
  end

  subgraph Customer["Signed-in customer"]
    checkout
    confirmation
    orders
    order
    account
  end

  subgraph Admin["Admin only"]
    admin
    adminOrders
    adminOrder
    calendar
    adminProducts
    newProduct
    editProduct
  end
```

- Customer pages are protected by `ProtectedRoute`: a visitor is sent to `/login` and comes back after signing in.
- Admin pages are protected by `AdminRoute` on the frontend and by the `adminOnly` middleware on the backend.
- Any other address shows the "page not found" page inside the shop layout.
