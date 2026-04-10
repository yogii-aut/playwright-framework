export const inventoryLocators = {
  pageTitle: '[data-test="title"]',
  inventoryItems: '[data-test="inventory-item"]',
  inventoryItemName: '[data-test="inventory-item-name"]',
  inventoryItemDescription: '[data-test="inventory-item-desc"]',
  inventoryItemPrice: '[data-test="inventory-item-price"]',
  addToCartButton: 'button[data-test^="add-to-cart"]',
  removeButton: 'button[data-test^="remove"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
  cartLink: '[data-test="shopping-cart-link"]',
  burgerMenu: '#react-burger-menu-btn',
  sortDropdown: '[data-test="product-sort-container"]'
} as const;

