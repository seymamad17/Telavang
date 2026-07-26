 /*--------- open menu & close ---------*/

window.onload = function () {

  let supportPhone = document.getElementById('phone-support');

  // باز شدن
  supportPhone.style.transform = "translateX(0)";

  // بعد از 4 ثانیه بسته شود
  setTimeout(() => {
    supportPhone.style.transform = "translateX(-120px)"; // یا هر مقداری که برای مخفی شدن استفاده می‌کنی
  }, 4000);

};
 
/*--------- open search ---------*/

// Mobile: open overlay
document.getElementById('openMobileSearch').addEventListener('click', function(e) {
    e.stopPropagation();
    const overlay = document.getElementById('mobileSearchOverlay');
    overlay.style.display = 'grid';
    document.getElementById('inputSearchPhone').focus();
});

// Mobile: close overlay
document.getElementById('closeMobileSearch').addEventListener('click', function() {
    document.getElementById('mobileSearchOverlay').style.display = 'none';
    document.getElementById('mobileSearchResults').classList.remove('active');
});

// Close mobile overlay on outside click (background)
document.getElementById('mobileSearchOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
        document.getElementById('mobileSearchResults').classList.remove('active');
    }
});

/* ----------- جستجوی محصولات ----------- */

function getAllProducts() {
    return document.querySelectorAll('.box-item');
}

function getProductName(item) {
    const p = item.querySelector('p');
    return p ? p.textContent.trim() : '';
}

function getProductImage(item) {
    const img = item.querySelector('img');
    return img ? img.getAttribute('src') : '';
}

function getProductPrice(item) {
    const priceEl = item.querySelector('.item-price-original');
    return priceEl ? priceEl.textContent.trim() : '';
}

function getProductDiscount(item) {
    const offEl = item.querySelector('.item-num-off');
    return offEl ? offEl.textContent.trim() : '';
}

// تابع استخراج لینک صفحه محصول از داخل تگ a
function getProductUrl(item) {
    const a = item.querySelector('a');
    return a ? a.getAttribute('href') : '#';
}

function searchProducts(query) {
    const items = getAllProducts();
    const results = [];
    const lower = query.toLowerCase().trim();
    if (!lower) return results;
    items.forEach(item => {
        const name = getProductName(item);
        if (name.toLowerCase().includes(lower)) {
            results.push(item);
        }
    });
    return results;
}

function renderResults(results, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // پاک کردن نتایج قبلی
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<div class="no-result">نتیجه‌ای یافت نشد</div>';
        container.classList.add('active');
        return;
    }

    results.forEach(item => {
        const name = getProductName(item);
        const img = getProductImage(item);
        const price = getProductPrice(item);
        const discount = getProductDiscount(item);
        const productUrl = getProductUrl(item); // دریافت آدرس لینک

        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <img src="${img}" alt="${name}" onerror="this.style.display='none'">
            <div class="result-info">
                <div class="result-name">${name}</div>
                <div class="result-price">${price} تومان ${discount ? '| ' + discount + ' تخفیف' : ''}</div>
            </div>
        `;
        
        div.addEventListener('click', function() {
            // بستن منوهای جستجو و پاک کردن فیلدها
            document.getElementById('desktopSearchResults').classList.remove('active');
            document.getElementById('mobileSearchResults').classList.remove('active');
            
            const overlay = document.getElementById('mobileSearchOverlay');
            if (overlay) overlay.style.display = 'none';
            
            const desktopInput = document.getElementById('desktopSearchInput');
            if (desktopInput) desktopInput.value = '';
            
            const mobileInput = document.getElementById('inputSearchPhone');
            if (mobileInput) mobileInput.value = '';

            // انتقال کاربر به صفحه محصول
            window.location.href = productUrl;
        });

        container.appendChild(div);
    });

    container.classList.add('active');
}

// Desktop search
const desktopInput = document.getElementById('desktopSearchInput');
const desktopResults = document.getElementById('desktopSearchResults');

if (desktopInput) {
    desktopInput.addEventListener('input', function() {
        const query = this.value;
        if (!query.trim()) {
            desktopResults.classList.remove('active');
            return;
        }
        const results = searchProducts(query);
        renderResults(results, 'desktopSearchResults');
    });
}

// Close desktop dropdown on outside click
document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.dor-div-search-box');
    if (searchBox && !searchBox.contains(e.target)) {
        if (desktopResults) desktopResults.classList.remove('active');
    }
});

// Mobile search
const mobileInput = document.getElementById('inputSearchPhone');
const mobileResults = document.getElementById('mobileSearchResults');

if (mobileInput) {
    mobileInput.addEventListener('input', function() {
        const query = this.value;
        if (!query.trim()) {
            if (mobileResults) mobileResults.classList.remove('active');
            return;
        }
        const results = searchProducts(query);
        renderResults(results, 'mobileSearchResults');
    });
}

        // Close mobile dropdown when typing empty (already handled above)

        /* ----------- برای تغییر خودکار پوستر در صفحه ----------- */

        /* const container = document.querySelector(".ads-container");

         setInterval(() => {
           container.scrollBy({
             left: 500, // هر بار چند پیکسل حرکت کنه
             behavior: "smooth"
           });
           // وقتی رسید به آخر، برگرده اول
           if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
             container.scrollTo({ left: 0, behavior: "smooth" });
           }
         }, 3000); // هر ۳ ثانیه

        */


        /* ----------------------- Scroll with drag s- box-container -------------------------- */

        function setupDragScroll(boxId) {
    const box = document.getElementById(boxId);
    if (!box) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    box.addEventListener('mousedown', (e) => {
        isDown = true;
        hasMoved = false;
        startX = e.pageX;
        scrollLeft = box.scrollLeft;
        
        // تغییر شکل موس به حالت مشت‌شده (کشیدن)
        box.classList.add('is-dragging');
        e.preventDefault();
    });

    box.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX;
        const walk = x - startX;

        if (Math.abs(walk) > 5) {
            hasMoved = true;
        }

        box.scrollLeft = scrollLeft - walk;
    });

    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            // برگرداندن شکل موس به حالت عادی
            box.classList.remove('is-dragging');
        }
    });

    box.addEventListener('click', (e) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

// فعال‌سازی برای باکس‌ها
setupDragScroll('scroll-drag-Box1');
setupDragScroll('scroll-drag-Box2');


        /* ----------------------- Scroll with drag - item-circle-too-box -------------------------- */

        let SrlCb3 = document.getElementById('dor-item-circle-too-box');

        SrlCb3.onmousedown = e => (drag3 = 1, x3 = e.pageX, l3 = SrlCb3.scrollLeft);
        SrlCb3.onmouseup = SrlCb3.onmouseleave = _ => drag3 = 0;
        SrlCb3.onmousemove = e => drag3 && (SrlCb3.scrollLeft = l3 - (e.pageX - x3));


        /* ----------------------- Scroll with drag - Ads Poster -------------------------- */

        // let SrlApos4 = document.getElementById('ads-container');

        // SrlApos4.onmousedown = e => (drag4 = 1, x4 = e.pageX, l4 = SrlApos4.scrollLeft);
        // SrlApos4.onmouseup = SrlApos4.onmouseleave = _ => drag4 = 0;
        // SrlApos4.onmousemove = e => drag4 && (SrlApos4.scrollLeft = l4 - (e.pageX - x4));


        /* ----------------------- Scroll with drag - Story Item -------------------------- */

        // let SrlStory5 = document.getElementById('story-container');

        // SrlStory5.onmousedown = e => (drag5 = 1, x5 = e.pageX, l5 = SrlStory5.scrollLeft);
        // SrlStory5.onmouseup = SrlStory5.onmouseleave = _ => drag5 = 0;
        // SrlStory5.onmousemove = e => drag5 && (SrlStory5.scrollLeft = l5 - (e.pageX - x5));





// =================== آدرس صفحه ======================
