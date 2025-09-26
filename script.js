let cart = JSON.parse(localStorage.getItem("cart")) || []
let products = []
let allProducts = []

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadProductsFromDatabase()
  updateCartCount()
  initializeNavigation()
  initializeChatbot()

  // Load page-specific content
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  if (currentPage === "index.html" || currentPage === "") {
    loadFeaturedProducts()
  } else if (currentPage === "products.html") {
    loadAllProducts()
  } else if (currentPage === "cart.html") {
    loadCartItems()
  }
})

// Load products from database
async function loadProductsFromDatabase() {
  try {
    const response = await fetch("./api/products.php")
    if (response.ok) {
      const data = await response.json()
      products = data
      allProducts = [...products]

      // Update displays if on relevant pages
      const currentPage = window.location.pathname.split("/").pop() || "index.html"
      if (currentPage === "index.html" || currentPage === "") {
        loadFeaturedProducts()
      } else if (currentPage === "products.html") {
        loadAllProducts()
      }
    } else {
      console.error("Failed to load products from database")
      // Fallback to sample data
      loadSampleProducts()
    }
  } catch (error) {
    console.error("Error loading products:", error)
    // Fallback to sample data
    loadSampleProducts()
  }
}

// Fallback sample products
function loadSampleProducts() {
  products = [
    {
      id: 1,
      name: "Luxury Matte Lipstick",
      price: 24.99,
      category: "lipstick",
      description: "Long-lasting matte finish with rich color payoff",
      image: "/placeholder.svg?height=250&width=250",
      stock: 15,
    },
    {
      id: 2,
      name: "Flawless Foundation",
      price: 39.99,
      category: "foundation",
      description: "Full coverage foundation for all skin types",
      image: "/placeholder.svg?height=250&width=250",
      stock: 20,
    },
    {
      id: 3,
      name: "Shimmer Eyeshadow Palette",
      price: 45.99,
      category: "eyeshadow",
      description: "12 stunning shades for day and night looks",
      image: "/placeholder.svg?height=250&width=250",
      stock: 12,
    },
    {
      id: 4,
      name: "Volume Boost Mascara",
      price: 19.99,
      category: "mascara",
      description: "Dramatic volume and length for stunning lashes",
      image: "/placeholder.svg?height=250&width=250",
      stock: 25,
    },
    {
      id: 5,
      name: "Hydrating Face Serum",
      price: 55.99,
      category: "skincare",
      description: "Intensive hydration with hyaluronic acid",
      image: "/placeholder.svg?height=250&width=250",
      stock: 18,
    },
  ]
  allProducts = [...products]
}

// Navigation functionality
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }
}

// Load featured products on homepage
function loadFeaturedProducts() {
  const featuredContainer = document.getElementById("featured-products")
  if (!featuredContainer) return

  const featuredProducts = products.slice(0, 4)
  featuredContainer.innerHTML = featuredProducts.map((product) => createProductCard(product)).join("")
}

// Load all products on products page
function loadAllProducts() {
  const productsContainer = document.getElementById("products-grid")
  if (!productsContainer) return

  productsContainer.innerHTML = products.map((product) => createProductCard(product)).join("")
}

// Create product card HTML
function createProductCard(product) {
  const stockStatus = product.stock > 0 ? "" : " (Out of Stock)"
  const stockClass = product.stock > 0 ? "" : " out-of-stock"
  const buttonDisabled = product.stock > 0 ? "" : " disabled"

  return `
        <div class="product-card${stockClass}" data-category="${product.category}" data-price="${product.price}">
            <img src="./images/${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}${stockStatus}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${Number.parseFloat(product.price).toFixed(2)}</div>
                <div class="stock-info">Stock: ${product.stock}</div>
                <button class="add-to-cart${buttonDisabled}" onclick="addToCart(${product.id})" ${product.stock > 0 ? "" : "disabled"}>
                    <i class="fas fa-shopping-cart"></i> ${product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    `
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product || product.stock <= 0) {
    showMessage("Product is out of stock!", "error")
    return
  }

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      showMessage("Cannot add more items. Stock limit reached!", "error")
      return
    }
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showMessage("Product added to cart!", "success")
}

// Update cart count in navigation
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

// Load cart items on cart page
function loadCartItems() {
  const cartContainer = document.getElementById("cart-items")
  if (!cartContainer) return

  if (cart.length === 0) {
    cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some beautiful products to get started!</p>
                <a href="products.html" class="cta-button">Shop Now</a>
            </div>
        `
    updateCartSummary()
    return
  }

  cartContainer.innerHTML = cart.map((item) => createCartItemHTML(item)).join("")
  updateCartSummary()
}

// Create cart item HTML
function createCartItemHTML(item) {
  return `
        <div class="cart-item">
            <img src="./images/${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" class="quantity" value="${item.quantity}" min="1" max="${item.stock}" onchange="setQuantity(${item.id}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <small>Available: ${item.stock}</small>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `
}

// Update item quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  const product = products.find((p) => p.id === productId)

  if (!item || !product) return

  const newQuantity = item.quantity + change

  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }

  if (newQuantity > product.stock) {
    showMessage("Cannot add more items. Stock limit reached!", "error")
    return
  }

  item.quantity = newQuantity
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCartItems()
  updateCartCount()
}

// Set specific quantity
function setQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId)
  const product = products.find((p) => p.id === productId)

  if (!item || !product) return

  const newQuantity = Number.parseInt(quantity)

  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }

  if (newQuantity > product.stock) {
    showMessage("Cannot add more items. Stock limit reached!", "error")
    return
  }

  item.quantity = newQuantity
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCartItems()
  updateCartCount()
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCartItems()
  updateCartCount()
  showMessage("Item removed from cart", "success")
}

// Update cart summary
function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08 
  const total = subtotal + shipping + tax

  const subtotalElement = document.getElementById("subtotal")
  const shippingElement = document.getElementById("shipping")
  const taxElement = document.getElementById("tax")
  const totalElement = document.getElementById("total")

  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`
  if (shippingElement) shippingElement.textContent = subtotal > 50 ? "FREE" : `$${shipping.toFixed(2)}`
  if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`
  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`
}

// Proceed to checkout
async function proceedToCheckout() {
  if (cart.length === 0) {
    showMessage("Your cart is empty!", "error")
    return
  }

  // Simple checkout form
  const customerName = prompt("Enter your name:")
  const customerEmail = prompt("Enter your email:")
  const shippingAddress = prompt("Enter your shipping address:")

  if (!customerName || !customerEmail || !shippingAddress) {
    showMessage("Please fill in all required information", "error")
    return
  }

  const orderData = {
    customer_name: customerName,
    customer_email: customerEmail,
    shipping_address: shippingAddress,
    total_amount:
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      5.99 +
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08,
    items: cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  }

  try {
    const response = await fetch("./api/orders.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const result = await response.json()

    if (result.success) {
      showMessage("Order placed successfully! Order ID: " + result.order_id, "success")
      cart = []
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCount()
      setTimeout(() => {
        window.location.href = "index.html"
      }, 2000)
    } else {
      showMessage("Error placing order: " + result.error, "error")
    }
  } catch (error) {
    console.error("Error placing order:", error)
    showMessage("Error placing order. Please try again.", "error")
  }
}

// Filter products with database integration
async function filterProducts() {
  const category = document.getElementById("category").value
  const priceRange = document.getElementById("price-range").value

  try {
    const url = "./api/products.php?"
    const params = new URLSearchParams()

    if (category !== "all") {
      params.append("category", category)
    }

    if (priceRange !== "all") {
      params.append("price_range", priceRange)
    }

    const response = await fetch(url + params.toString())
    if (response.ok) {
      products = await response.json()
      loadAllProducts()
    }
  } catch (error) {
    console.error("Error filtering products:", error)
  }
}

// Search products with database integration
async function searchProducts() {
  const searchTerm = document.getElementById("search").value

  try {
    const url = "./api/products.php?"
    const params = new URLSearchParams()

    if (searchTerm) {
      params.append("search", searchTerm)
    }

    const response = await fetch(url + params.toString())
    if (response.ok) {
      products = await response.json()
      loadAllProducts()
    }
  } catch (error) {
    console.error("Error searching products:", error)
  }
}

// Chatbot functionality
function initializeChatbot() {
  const chatInput = document.getElementById("user-input")
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    })
  }
}

// Toggle chatbot
function toggleChat() {
  const chatBody = document.getElementById("chatbot-body")
  const chatToggle = document.getElementById("chat-toggle")

  if (chatBody && chatToggle) {
    chatBody.classList.toggle("open")
    chatToggle.style.transform = chatBody.classList.contains("open") ? "rotate(180deg)" : "rotate(0deg)"
  }
}

// Send message to chatbot
function sendMessage() {
  const userInput = document.getElementById("user-input")
  const chatMessages = document.getElementById("chat-messages")

  if (!userInput || !chatMessages) return

  const message = userInput.value.trim()
  if (message === "") return

  // Add user message
  addMessage(message, "user")
  userInput.value = ""

  // Simulate bot response
  setTimeout(() => {
    const botResponse = generateBotResponse(message)
    addMessage(botResponse, "bot")
  }, 1000)
}

// Add message to chat
function addMessage(message, sender) {
  const chatMessages = document.getElementById("chat-messages")
  if (!chatMessages) return

  const messageDiv = document.createElement("div")
  messageDiv.className = sender === "user" ? "user-message" : "bot-message"
  messageDiv.innerHTML = `<p>${message}</p>`

  chatMessages.appendChild(messageDiv)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Generate bot response
function generateBotResponse(userMessage) {
  const message = userMessage.toLowerCase()

  if (message.includes("hello") || message.includes("hi")) {
    return "Hello! Welcome to GlamourShop! How can I help you find the perfect beauty products today?"
  } else if (message.includes("product") || message.includes("recommend")) {
    return "I'd be happy to recommend products! Are you looking for skincare, makeup, or something specific? Our bestsellers include our Luxury Matte Lipstick and Hydrating Face Serum."
  } else if (message.includes("prices") || message.includes("cost")) {
    return "Our products range from $16.99 to $68.99. We offer free shipping on orders over $50! Would you like to see products in a specific price range?"
  } else if (message.includes("shipping") || message.includes("delivery")) {
    return "We offer free shipping on orders over $50! Standard shipping takes 3-5 business days, and express shipping is available for $9.99 (1-2 business days)."
  } else if (message.includes("return product") || message.includes("refund")) {
    return "We have a 30-day return policy! If you're not completely satisfied with your purchase, you can return it for a full refund within 30 days."
  } else if (message.includes("stock available") || message.includes("available")) {
    return "You can check product availability on our products page. Each item shows current stock levels. If something is out of stock, we restock regularly!"
  } else if (message.includes("skin products available") || message.includes("skincare")) {
    return "Our skincare collection includes hydrating serums, anti-aging creams, and cleansers. The Hydrating Face Serum is very popular! What's your skin type?"
  } else if (message.includes("makeup") || message.includes("cosmetic")) {
    return "We have a full range of makeup including lipsticks, foundations, eyeshadows, and more! Our Luxury Matte Lipstick and Shimmer Eyeshadow Palette are customer favorites."
  } else if (message.includes("help") || message.includes("support")) {
    return "I'm here to help! You can ask me about products, shipping, returns, or anything else. You can also call us at (555) 123-4567 or email info@glamourshop.com."
  } else if (message.includes("thanks") || message.includes("thank you")) {
    return "You're welcome! 😊 Is there anything else I can help you with? I'm here to make your beauty shopping experience amazing!"
  } else if (message.includes("bye") || message.includes("goodbye")) {
    return "Thank you for visiting GlamourShop! Have a beautiful day! ✨ Feel free to chat with me anytime you need beauty advice!"
  } else {
    return "Thank you for your message! I'm here to help with any questions about our products, shipping, returns, or recommendations. What would you like to know?"
  }
}

// Newsletter subscription
document.addEventListener("DOMContentLoaded", () => {
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector('input[type="email"]').value

      // Simulate newsletter subscription
      showMessage("Thank you for subscribing to our newsletter!", "success")
      this.reset()
    })
  }
})

// Show message function
function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".message")
  existingMessages.forEach((msg) => msg.remove())

  // Create new message
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}`
  messageDiv.textContent = message

  // Insert at top of page
  document.body.insertBefore(messageDiv, document.body.firstChild)

  // Remove message after 3 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})

