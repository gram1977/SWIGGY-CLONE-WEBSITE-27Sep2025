/**
 * @file script.js
 * @description JavaScript for Swiggy Clone Website
 * @author Aman Greval
 * @version 1.0.0
 * @since 2024-06-20
 */
const dishes = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    desc: "Rich and creamy paneer cooked in tomato gravy.",
    price: 180,
    img: "./assets/images/paneer-butter-masala.jpg",
  },
  {
    id: 2,
    name: "Chicken Biryani",
    desc: "Aromatic basmati rice with tender chicken pieces.",
    price: 220,
    img: "./assets/images/chicken-biryani.jpg",
  },
  {
    id: 3,
    name: "Veg Hakka Noodles",
    desc: "Stir-fried noodles with fresh vegetables.",
    price: 120,
    img: "./assets/images/veg-noodles.jpg",
  },
  {
    id: 4,
    name: "Gulab Jamun",
    desc: "Soft and sweet milk-based dessert balls.",
    price: 80,
    img: "./assets/images/gulab-jamun.jpg",
  },
];

/**
 * @description Cart object to store dish IDs and their quantities.
 */
let cart = {};

/**
 * Renders the list of dishes on the page.
 * @function renderDishes
 * @since 1.0.0
 * Iterates over each dish in the dishes array and creates a card for each dish with its details and an "Add to Cart" button. *
 * The forEach() method is used to iterate over each dish in the dishes array.
 * For each dish, a new div element is created with the class name "dish-card".
 * The innerHTML property of the div element is set to include the dish's image, name, description, price, and an "Add to Cart" button.
 * The button has a data-id attribute set to the dish's ID, which is used later to identify which dish was added to the cart.
 * Finally, the div element is appended to the dishesSection element, which displays all the dishes on the page.
 */
function renderDishes() {
  const dishesSection = document.querySelector(".dishes");
  dishesSection.innerHTML = "";

  dishes.forEach((dish) => {
    const div = document.createElement("div");
    div.className = "dish-card";
    div.innerHTML = `
        <img src="${dish.img}" alt="${dish.name}">
        <div class="dish-title">${dish.name}</div>

        ${
          dish.name === "Chicken Biryani"
            ? `<div class="div-status-title">Promoted</div>
       <div class="dish-rating">★ 4.5</div>`
            : ""
        }

                ${
                  dish.name === "Gulab Jamun"
                    ? `<div class="div-status-title">Promoted</div>
       <div class="dish-rating">★ 4.5</div>`
                    : ""
                }

    <div class="dish-desc">${dish.desc}</div>
    <div class="dish-price">₹${dish.price}</div>
    <div class="dish-offer">
      <span class="offer-icon">🏷️</span>
        50% OFF | Use WELCOME50
    </div>
    <button class="add-btn" data-id="${dish.id}">Add to Cart</button>
    `;
    dishesSection.appendChild(div);
  });
}

/**
 * Updates the cart item count displayed on the cart button.
 * @function updateCartCount
 * @since 1.0.0
 */
function updateCartCount() {
  /* This uses the reduce() method to calculate the total quantity of items in the cart and returns the count.*/
  /* The reduce() method takes two arguments: an accumulator and a current value. */
  /* The accumulator keeps track of the total quantity, while the current value is the quantity of the item being processed. */
  /* Object.values is used to get the values of the cart object */

  const count = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  document.getElementById("cart-count").textContent = count;
}
/**
 * Adds a dish to the cart.
 * @function addToCart
 * @since 1.0.0
 * @param {*} dishId
 */
function addToCart(dishId) {
  /* This assigns a name/value pair to the cart object, where the name is dishId and the value is the quantity. */
  /**
   * If the dish is already in the cart, it increments the quantity by 1.
   * If the dish is not in the cart, it initializes the quantity to 1.
   */
  cart[dishId] = (cart[dishId] || 0) + 1;
  updateCartCount();
}

/**
 * Renders the cart items in the cart modal.
 * @function renderCart
 * @since 1.0.0
 */
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;
  /** Iterates over each key item in the cart, calculates the total price, and creates list items for each dish in the cart.
   * The forEach() method is used to iterate over each key in the cart object.
   * The find() method is used to get the dish details from the dishes array based on the dish ID.
   * The quantity of each dish is retrieved from the cart object using the dish ID as the key.
   * The total price is calculated by multiplying the dish price by the quantity and adding it to the total variable.
   * A new list item (li) is created for each dish in the cart, displaying the dish name, quantity, and total price for that dish.
   * Finally, the total price of all items in the cart is displayed at the bottom of the cart modal.
   */
  Object.keys(cart).forEach((id) => {
    const dish = dishes.find((d) => d.id === Number(id));
    const qty = cart[id];
    total += dish.price * qty;
    const li = document.createElement("li");
    li.textContent = `${dish.name} x ${qty} = ₹${dish.price * qty}`;
    cartItems.appendChild(li);

    /**
     * Adds a "Remove" button to each cart item that allows users to remove the item from the cart.
     * When the button is clicked, the item is deleted from the cart object, and the cart count and cart items are updated accordingly.
     */
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      delete cart[id];
      updateCartCount();
      renderCart();
    });
    li.appendChild(removeBtn);
  });
  document.getElementById("cart-total").textContent = `Total: ₹${total}`;

  // Only show payment form if cart has at least one item
  const modalContent = document.querySelector("#cart-modal .modal-content");
  const existingForm = document.getElementById("payment-form");
  if (Object.keys(cart).length > 0) {
    if (!existingForm) {
      showPaymentForm();
    }
  } else {
    if (existingForm) {
      existingForm.remove();
    }
  }
}

/**
 * Displays the payment form and handles form submission.
 * @function showPaymentForm
 * @since 1.0.0
 */
function showPaymentForm() {
  const formHtml = `
    <form id="payment-form">
      <label for="name">Name:</label><br>
      <input type="text" id="name" required /><br>
      <label for="card-number">Credit Card Number:</label><br>
      <input type="text" id="card-number" required /><br>
      <button type="submit">Pay Now</button>
    </form>
  `;
  document
    .querySelector("#cart-modal .modal-content")
    .insertAdjacentHTML("beforeend", formHtml);

  document.getElementById("payment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Remove unwanted spaces from the input values
    const name = document.getElementById("name").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();

    // Name should contain only letters and spaces
    const nameRegex = /^[A-Za-z ]+$/;

    // Credit Card Number should be exactly 16 digits, and no special characters allowed
    const cardRegex = /^\d{16}$/;
    if (!name || !cardNumber) {
      alert("Please fill in all fields.");
      return;
    }
    if (!nameRegex.test(name)) {
      alert("Name should contain only letters and spaces.");
      return;
    }
    if (!cardRegex.test(cardNumber)) {
      alert(
        "Credit Card Number should be exactly 16 digits, and no special characters allowed."
      );
      return;
    }
    alert("Payment Successful! Thank you for your order.");
    cart = {};
    updateCartCount();
    renderCart();
    hideCart();
  });
  /* Note: Actual payment processing would require integration with a payment gateway and is not implemented here. */
}

/**
 * Renders the cart items and displays the cart modal.
 * @function showCart
 * @since 1.0.0
 */
function showCart() {
  renderCart();
  document.getElementById("cart-modal").style.display = "flex";
}

/** Hides the cart modal.
 * @function hideCart
 * @since 1.0.0
 */
function hideCart() {
  document.getElementById("cart-modal").style.display = "none";
}

/** DOMContentLoaded event listener to render the dishes and set up event listeners
 * @since 1.0.0 */
document.addEventListener("DOMContentLoaded", () => {
  renderDishes();

  /** Event listener for adding dishes to the cart
   * @since 1.0.0 */
  document.querySelector(".dishes").addEventListener("click", (e) => {
    if (
      e.target &&
      e.target instanceof HTMLElement &&
      e.target.classList.contains("add-btn")
    ) {
      const id = e.target.getAttribute("data-id");
      addToCart(Number(id));
    }
  });

  /** Event listeners for opening and closing the cart modal
   * @since 1.0.0 */
  document.getElementById("cart-btn").addEventListener("click", showCart);
  document.getElementById("close-cart").addEventListener("click", hideCart);

  /**
   * @param {*} event
   * @description This code adds an event listener to the window object that listens for click events.
   * When a click event occurs, it checks if the target of the event (the element that was clicked) is the modal itself (i.e., the area outside the modal content).
   * If the target is the modal, it calls the hideCart() function to close the cart modal.
   */
  window.addEventListener("click", function (event) {
    /**
     * @description Gets the cart modal element by its ID "cart-modal".
     * Compares the event target with the modal element to determine if the user clicked outside the modal content.
     * If the user clicked outside the modal content, it calls the hideCart() function to close the cart modal.
     */
    const modal = document.getElementById("cart-modal");
    if (event.target === modal) {
      hideCart();
    }
  });
});
