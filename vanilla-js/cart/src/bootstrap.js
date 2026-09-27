import faker from 'faker';

const mountCart = (el) => {
    let cart = `<div>You got ${faker.random.number()} items in your cart.</div`;
    el.innerHTML = cart;

}
// things to note

// 1. Use local element id for islolated developement (using local index.html), immediately render the js code
if (process.env.NODE_ENV === 'development') {
    const element = document.querySelector("#dev-carts");
    if (element) {
        mountCart(element);
    }
}
// 2. In case of prod/mfe scenario, the specific id might not exist, DO NOT immediately render the app
export { mountCart }
