document.addEventListener("DOMContentLoaded", function () {
    // 1. LocalStorage for Cart Array
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartButton = document.querySelector('header [data-bs-target="#cartModal"]');

    function updateCartUI() {
        if (cartButton) {
            cartButton.innerHTML = `<i class="fa-solid fa-cart-shopping me-1"></i> কার্ট (${cartItems.length})`;
        }

        const cartItemsList = document.getElementById("cartItemsList");
        if (cartItemsList) {
            if (cartItems.length === 0) {
                cartItemsList.innerHTML = `<div class="text-center py-4 text-muted"><i class="fa-solid fa-basket-shopping fa-3x mb-2"></i><p>আপনার কার্টে বর্তমানে কোনো প্রোডাক্ট নেই!</p></div>`;
            } else {
                let html = '<ul class="list-group mb-3">';
                cartItems.forEach((item, index) => {
                    html += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <img src="${item.img}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded me-3" alt="product">
                                <div>
                                    <h6 class="mb-0 fw-bold">${item.title}</h6>
                                    <small class="text-danger fw-bold">${item.price}</small>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                        </li>
                    `;
                });
                html += '</ul>';
                cartItemsList.innerHTML = html;

                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const idx = parseInt(this.getAttribute('data-index'));
                        cartItems.splice(idx, 1);
                        localStorage.setItem("cartItems", JSON.stringify(cartItems));
                        updateCartUI();
                    });
                });
            }
        }
    }

    updateCartUI();

    // 2. Dynamic Details Link for All Product Cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(function (card) {
        const titleEl = card.querySelector('.card-title');
        const imgEl = card.querySelector('img');
        const priceEl = card.querySelector('.text-danger');
        const detailsBtn = card.querySelector('a.btn');

        if (detailsBtn && titleEl && imgEl && priceEl) {
            const title = titleEl.textContent.trim();
            const img = imgEl.src;
            const price = priceEl.textContent.trim();

            detailsBtn.href = `product-details.html?title=${encodeURIComponent(title)}&img=${encodeURIComponent(img)}&price=${encodeURIComponent(price)}`;
        }
    });

    // 3. Category Click Filter
    const categoryItems = document.querySelectorAll('aside .list-group-item');
    categoryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            categoryItems.forEach(i => i.classList.remove('active', 'bg-primary', 'text-white'));
            this.classList.add('active', 'bg-primary', 'text-white');

            const categoryText = this.textContent.toLowerCase().trim();

            productCards.forEach(function (card) {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const desc = card.querySelector('.card-text') ? card.querySelector('.card-text').textContent.toLowerCase() : '';

                if (categoryText.includes("মোবাইল") && (title.includes("phone") || title.includes("smart") || title.includes("tablet") || desc.includes("মোবাইল"))) {
                    card.parentElement.style.display = "block";
                } else if (categoryText.includes("কম্পিউটার") && (title.includes("laptop") || title.includes("keyboard") || title.includes("mouse") || title.includes("monitor") || title.includes("desktop") || title.includes("notebook"))) {
                    card.parentElement.style.display = "block";
                } else if (categoryText.includes("টিভি") && (title.includes("tv") || title.includes("kettle") || title.includes("blender") || title.includes("speaker") || title.includes("juicer"))) {
                    card.parentElement.style.display = "block";
                } else if (categoryText.includes("ক্যামেরা") && (title.includes("camera") || title.includes("security") || title.includes("ip") || title.includes("gimbal") || title.includes("tripod"))) {
                    card.parentElement.style.display = "block";
                } else if (categoryText.includes("গ্যাজেট") && (title.includes("watch") || title.includes("headphone") || title.includes("earbuds") || title.includes("power bank") || title.includes("airpods") || title.includes("mic"))) {
                    card.parentElement.style.display = "block";
                } else {
                    card.parentElement.style.display = "none";
                }
            });
        });
    });

    // 4. Load Data dynamically inside product-details.html
    const urlParams = new URLSearchParams(window.location.search);
    const paramTitle = urlParams.get('title');
    const paramImg = urlParams.get('img');
    const paramPrice = urlParams.get('price');

    if (paramTitle && paramImg) {
        const detailTitle = document.querySelector('main h3.fw-bold');
        const detailImg = document.querySelector('main img.img-fluid');
        const detailPrice = document.querySelector('main .text-danger');
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');

        if (detailTitle) detailTitle.textContent = paramTitle;
        if (detailImg) detailImg.src = paramImg;
        if (detailPrice && paramPrice) detailPrice.textContent = paramPrice;
        if (breadcrumbActive) breadcrumbActive.textContent = paramTitle;
    }

    // 5. Add to Cart Logic inside Details page
    const addToCartBtns = document.querySelectorAll('button');
    addToCartBtns.forEach(btn => {
        if (btn.textContent.includes("কার্টে রাখুন")) {
            btn.addEventListener("click", function () {
                const title = paramTitle || document.querySelector('main h3.fw-bold')?.textContent || "প্রোডাক্ট";
                const img = paramImg || document.querySelector('main img.img-fluid')?.src || "";
                const price = paramPrice || document.querySelector('main .text-danger')?.textContent || "৳ 0";

                cartItems.push({ title, img, price });
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                updateCartUI();
                alert("প্রোডাক্টটি সফলভাবে আপনার কার্টে যোগ করা হয়েছে!");
            });
        }
    });

    // 6. Checkout Form
    const cartCheckoutForm = document.getElementById("cartCheckoutForm");
    if (cartCheckoutForm) {
        cartCheckoutForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (cartItems.length === 0) {
                alert("আপনার কার্ট খালি! অনুগ্রহ করে প্রোডাক্ট কার্টে যোগ করুন।");
                return;
            }
            alert(`অভিনন্দন! আপনার কার্টের ${cartItems.length}টি প্রোডাক্টের অর্ডার সফলভাবে গৃহীত হয়েছে।`);
            cartItems = [];
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            updateCartUI();
            cartCheckoutForm.reset();
            const modalElement = document.getElementById('cartModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        });
    }

    // 7. Live Search
    const searchInput = document.querySelector('header input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener("keyup", function () {
            const query = searchInput.value.toLowerCase().trim();
            productCards.forEach(function (card) {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                card.parentElement.style.display = title.includes(query) ? "block" : "none";
            });
        });
    }
});