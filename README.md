# Campus Canteen Management System

A Vue 3 single-page app for managing a school canteen menu, customer orders, inventory, and completed sales. The app uses Vue 3 `<script setup>` Single File Components, Vite, Vue Router, and browser `localStorage`; it does not need a backend.

## Requirements and setup

Install [Node.js](https://nodejs.org/) (which includes npm), then run these commands in PowerShell:

```powershell
npm create vue@latest canteen-management-system
cd canteen-management-system
npm install
npm install vue-router@^4
npm run dev
```

For this existing project, dependencies are already listed in `package.json`, so use:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create a production build, run `npm run build`.

## Project structure

```text
canteen-management-system/
├── .gitignore
├── .vscode/
│   └── extensions.json
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── App.vue
    ├── main.js
    ├── style.css
    ├── assets/
    │   ├── hero.png
    │   ├── vite.svg
    │   └── vue.svg
    ├── components/
    │   ├── HelloWorld.vue (unused Vite starter component)
    │   ├── InventoryTable.vue
    │   ├── ItemForm.vue
    │   ├── ItemTable.vue
    │   ├── NavBar.vue
    │   ├── OrderForm.vue
    │   ├── OrderTable.vue
    │   └── StatCard.vue
    ├── router/
    │   └── index.js
    ├── stores/
    │   └── canteen.js
    └── views/
        ├── DashboardView.vue
        ├── HomeView.vue
        ├── MenuItemsView.vue
        └── OrdersView.vue
```

## Class topics demonstrated

| Topic | Working example |
| --- | --- |
| Requirements, Node.js/npm, Vite, project structure | This README, `package.json`, and `vite.config.js` |
| Vue Single File Components | Views and reusable components have `<template>`, `<script setup>`, and app-wide CSS |
| Template syntax and directives | `v-if`/`v-else`, `v-for` with `:key`, `v-model`, `:class`/`:value`, `@click`/`@submit`, and `v-show` appear across the views and components |
| Reactivity | `ref` for page/form state, `reactive` for shared state and form models, `computed` for totals and filtered/summary data, and `watch` for localStorage and form synchronization |
| Props and emits | Forms, tables, and stat cards receive props and send user actions to their parent views with emits |
| Lifecycle hooks | `HomeView.vue` formats the date in `onMounted` |
| Vue Router | Home, Menu Items, Orders, and Inventory use working `RouterLink` navigation |
| Forms and validation | Required fields and custom checks reject empty names, negative values, decimal stock/quantities, unavailable items, and over-stock orders; food photos accept JPG, PNG, or WebP and are compressed before saving |
| CRUD | Create, list, edit (pre-filled), and confirm delete for menu items and orders; inventory stock can be updated and records deleted |
| localStorage | A deep watcher saves menu, order, and inventory changes; initial sample data appears on a clean browser profile |

Orders reserve stock when created or edited and return it when deleted. Only completed orders count toward total sales. A menu item linked to an existing order cannot be deleted, protecting order history.

On **Menu Items**, the canteen admin can upload a food photo while creating or editing an item. The customer-facing **Today's menu** gallery displays the photo, name, category, peso price, and availability; uploaded photos persist in localStorage with the rest of the menu.

## GitHub push steps

Create an empty GitHub repository first (do not add a README there), then replace the URL below with that repository's HTTPS URL:

```powershell
git init
git add .
git commit -m "Build campus canteen management SPA"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/canteen-management-system.git
git push -u origin main
```

If Git reports that `origin` already exists, update it with `git remote set-url origin <YOUR-REPOSITORY-URL>` before pushing. Configure your Git name/email and sign in to GitHub if prompted.

## Live demo walkthrough

1. Start at Home, show the overview cards, then click **Show class topics**.
2. Open **Menu Items**. Add a sample item (for example, Veggie Wrap, Meals, `₱6.50`, stock `10`), edit it to demonstrate the pre-filled form, then delete it and confirm.
3. Open **Orders**. Create an order for a customer with a couple of available items; point out the computed total and the inventory reservation. Change its status to Preparing, edit it, then delete it and confirm the stock is returned.
4. Open **Inventory**. Show the low-stock warning, change a stock quantity and update it, then demonstrate deleting a record. Explain that an item attached to an order is protected from deletion.
5. Refresh the page to show that saved records persist in localStorage, then return Home using the navigation.
