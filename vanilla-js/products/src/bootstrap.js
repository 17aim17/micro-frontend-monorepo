import faker from 'faker';

const mountProducts = (el) => {
  let products = '';

  for (let i = 0; i < 5; i++) {
    const name = faker.commerce.productName();
    products += `<div>${name}</div>`;
  }

  el.innerHTML = products;

}
// things to note

// 1. Use local element id for islolated developement (using local index.html), immediately render the js code
if (process.env.NODE_ENV === 'development') {
  const element = document.querySelector("#dev-products");
  if (element) {
    mountProducts(element);
  }
}
// 2. In case of prod/mfe scenario, the specific id might not exist, DO NOT immediately render the app
export { mountProducts }