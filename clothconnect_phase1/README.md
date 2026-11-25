# ClothConnect – Phase 1 Frontend

A clothing-only multi-vendor marketplace prototype for a B.Tech project.

## Roles
- Customer: browse clothing, search/filter/sort, wishlist and cart.
- Producer: submit a clothing brand application and add demo products.
- Admin: approve/reject brand applications and configure commission by clothing category.

## Technology in Phase 1
- HTML
- CSS
- JavaScript
- Browser localStorage (temporary demo data only)

## Run the project
1. Extract the ZIP file.
2. Open the `clothconnect_phase1` folder in VS Code.
3. Open `index.html` in your browser, or use the VS Code Live Server extension.
4. Use the role selector in the top-right corner to switch between Customer, Brand Portal and Admin Portal.

## Demo workflow
1. Select **Brand portal**.
2. Submit a brand application.
3. Select **Admin portal**.
4. Approve or reject the application.
5. Change commission percentages by category and save.
6. Switch to **Customer view** to browse, filter, wishlist and add products to the cart.

## Important limitations
This is only the Phase 1 frontend prototype. It does not provide real authentication, secure role permissions, database persistence, real-time chat, payment processing, or actual commission settlement. Data is stored in the current browser using localStorage and can be cleared by clearing site data.

The next phase will add Java Spring Boot REST APIs, MySQL tables, password hashing, server-side role-based access control, producer approval rules, and persistent product/order data.
