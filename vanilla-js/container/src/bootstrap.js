import { mountProducts } from 'products/ProductsIndex';
import { mountCart } from 'cart/CartShow';

const productsEl = window.document.createElement("div");

productsEl.id = "__products__";

document.querySelector("#__container__").appendChild(productsEl);

const cartEl = window.document.createElement("div");

cartEl.id = "__cart__";

document.querySelector("#__container__").appendChild(cartEl);

mountProducts(productsEl);
mountCart(cartEl);
