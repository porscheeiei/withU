
    const API_URL = "https://script.google.com/macros/s/AKfycbzo3GGk0RBYAX_q4kYmYcONV2a639J-4TXoggQHGtRjtTaK7DdPz5KcrMwXK6wtSinPnA/exec"; 
    const API_KEY = "WITHU_SECRET_2026"; 
    
    let currentTable = "", cart = [], fullMenu = [], toppingsData = [], toppingsData2 = [], currentS = {}, currentSpicy = {}, itemOpt = {}, itemExpanded = {}, itemQty = {}, currentF = "ทั้งหมด", currentSubF = "ทั้งหมด", currentSearch = "", sInterval, autoCloseTimer;
    let currentBannerIndex = 0, bannerSliderInterval = null, touchStartX = 0, touchEndX = 0;

    let currentLang = localStorage.getItem('withu_lang') || 'th';
    const customerLangPack = {
        th: {
            call_staff: "เรียกพนักงาน", welcome: "ยินดีต้อนรับครับ", scan_prompt: "โปรดสแกนคิวอาร์โค้ดของโต๊ะที่ท่านนั่ง เพื่อเข้าสู่เมนู",
            scan_sub: "กรุณาสแกน QR Code ที่ตั้งอยู่บริเวณโต๊ะ ระบบจะพาท่านเข้าสู่หน้าจอการสั่งอาหารโดยอัตโนมัติ", search_menu: "ค้นหาเมนูที่คุณชื่นชอบ...",
            cart_title: "ตะกร้าของคุณ", items: "รายการ", total: "ยอดรวม", order_summary: "ตรวจสอบรายการอาหารก่อนยืนยัน", remove: "นำออก",
            note_prompt: "ระบุหมายเหตุ (ถ้ามี)", note_placeholder: "เพิ่มหมายเหตุ (เช่น ไม่ใส่ผัก, แยกน้ำแข็ง...)", net_total: "ยอดรวมสุทธิ",
            confirm_order: "ยืนยันออเดอร์ (Confirm)", order: "Order", syncing: "กำลังซิงค์ข้อมูล...", step_1: "รับออเดอร์", step_2: "กำลังปรุง",
            step_3: "กำลังเสิร์ฟ", step_4: "ชำระเงิน", order_more: "สั่งสินค้าเพิ่มเติม", home: "หน้าแรก", call_bill: "ต้องการเช็คบิล",
            call_confirm_title: "ต้องการเช็คบิล?", call_confirm_sub: "เมื่อยืนยัน ระบบจะเรียกพนักงานมาเก็บเงินที่โต๊ะทันที",
            call_confirm_btn: "ยืนยันการเช็คบิล", back: "ย้อนกลับ", calling: "กำลังแจ้งพนักงาน...", wait_bill: "กรุณารอสักครู่ พนักงานกำลังนำบิลไปให้ท่านที่โต๊ะค่ะ",
            queue_0: "ออเดอร์ของท่านกำลังดำเนินการเป็นคิวต่อไป", queue_n: "มีออเดอร์ก่อนหน้าท่านอีก {n} คิว", queue_prep: "ออเดอร์ของท่านอยู่ในขั้นตอนการเตรียม",
            sold_out: "Out of Stock", add_to_cart: "เพิ่มลงตะกร้า", sweetness: "ระดับความหวาน (Sweetness)", spiciness: "ระดับความเผ็ด (Spiciness)",
            frappe: "เพิ่มปั่น (Frappe)", extra: "พิเศษ (Extra/Upsize)", topping_drink: "เพิ่มท็อปปิ้ง (Add-ons)", topping_food: "เพิ่มท็อปปิ้ง (Toppings)",
            all: "ทั้งหมด", view_all: "ดูทั้งหมด", drink_desc: "เครื่องดื่มสูตรพรีเมียม รังสรรค์พิเศษ", food_desc: "ปรุงสดใหม่ด้วยวัตถุดิบคัดสรร",
            call_modal_title: "เรียกพนักงาน", call_modal_sub: "พนักงานของเราจะรีบไปดูแลที่โต๊ะของท่านค่ะ", call_modal_btn: "ยืนยันการเรียก",
            call_modal_cancel: "ยกเลิก", calling_staff: "Calling Staff...", call_ack: "รับทราบค่ะ", call_coming: "พนักงานกำลังไปดูแลที่โต๊ะ",
            all_cat: "ทั้งหมด", empty_cart: "ตะกร้าว่างเปล่า", table: "โต๊ะ", price_sign: "฿"
        },
        en: {
            call_staff: "Call Staff", welcome: "Welcome", scan_prompt: "Please scan the QR code on your table to access the menu",
            scan_sub: "Scan the QR code located on your table to automatically enter the ordering screen.", search_menu: "Search for your favorite menu...",
            cart_title: "Your Cart", items: "items", total: "Total", order_summary: "Review items before confirming", remove: "Remove",
            note_prompt: "Add a note (Optional)", note_placeholder: "e.g., No veggies, ice on the side...", net_total: "Net Total",
            confirm_order: "Confirm Order", order: "Order", syncing: "Syncing data...", step_1: "Order Placed", step_2: "Cooking",
            step_3: "Serving", step_4: "Payment", order_more: "Order More", home: "Home", call_bill: "Request Bill",
            call_confirm_title: "Request Bill?", call_confirm_sub: "Staff will come to your table for payment.",
            call_confirm_btn: "Confirm Request", back: "Back", calling: "Notifying staff...", wait_bill: "Please wait, staff will bring the bill to your table.",
            queue_0: "Your order is up next.", queue_n: "{n} orders ahead of you.", queue_prep: "Your order is being prepared.",
            sold_out: "Out of Stock", add_to_cart: "Add to Cart", sweetness: "Sweetness Level", spiciness: "Spiciness Level",
            frappe: "Frappe (+฿10)", extra: "Extra/Upsize (+฿10)", topping_drink: "Add-ons", topping_food: "Toppings",
            all: "All", view_all: "View All", drink_desc: "Premium crafted beverage", food_desc: "Freshly cooked with premium ingredients",
            call_modal_title: "Call Staff", call_modal_sub: "Our staff will attend to you shortly.", call_modal_btn: "Confirm Call",
            call_modal_cancel: "Cancel", calling_staff: "Calling Staff...", call_ack: "Acknowledged", call_coming: "Staff is on the way",
            all_cat: "All", empty_cart: "Cart is empty", table: "Table", price_sign: "฿"
        }
    };

    function toggleLanguage() {
        currentLang = currentLang === 'en' ? 'th' : 'en';
        localStorage.setItem('withu_lang', currentLang);
        applyLanguagePack();
        if (fullMenu.length > 0) renderMenu(currentF);
    }

    function translate(key) {
        return (customerLangPack[currentLang] && customerLangPack[currentLang][key]) ? customerLangPack[currentLang][key] : key;
    }

    function applyLanguagePack() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (customerLangPack[currentLang] && customerLangPack[currentLang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = customerLangPack[currentLang][key];
                } else {
                    el.innerText = customerLangPack[currentLang][key];
                }
            }
        });
    }

    const menuDictionary = {
        "เครื่องดื่ม": "Beverages", "ขนมปัง": "Toast", "เมนูเส้น": "Noodles", "เมนูข้าว": "Rice Dishes", "ของทานเล่น": "Appetizers", "เมนูยำ": "Spicy Salads", "หมาล่าทอด": "Fried Mala", "อื่นๆ": "Others",
        "น้ำเปล่า/น้ำอัดลม": "Water/Sodas", "กาแฟ": "Coffee", "ชา": "Tea", "นม": "Milk", "มัทฉะ": "Matcha", "โกโก้": "Cocoa", "สมูทตี้": "Smoothies", "โซดา": "Soda", "หน้าเดียว": "Single Topping", "ทูโทน": "Two-Tone", "เมนูต้ม": "Boiled/Soup", "เมนูผัด": "Stir-fried", "เมนูแห้ง": "Dry", "ไก่กรอบ": "Crispy Chicken", "ข้าว+ยำ": "Rice & Salad", "กระเพรา": "Basil Stir-fry", "ไข่เจียว": "Omelet", "ทั่วไป": "General",
        "น้ำเปล่า": "Water", "โค้กกระป๋อง": "Canned Coke", "อเมริกาโน่": "Americano", "อเมริกาโน่ส้ม": "Orange Americano", "อเมริกาโน่สตรอว์เบอร์รี่": "Strawberry Americano", "เอสเพรชโซ": "Espresso", "คาปูชิโน่": "Cappuccino", "คาราเมลมัคคิอาโต้": "Caramel Macchiato", "ลาเต้": "Latte", "มอคค่า": "Mocha", "ชาไทย": "Thai Tea", "ชาเขียว": "Green Tea", "ชาเงาะเบสชาไทย": "Rambutan Thai Tea", "ชาเงาะเบสเขียว": "Rambutan Green Tea", "ชาดำเย็น": "Iced Black Tea", "ชาโกโก้": "Cocoa Tea", "ชามะนาว": "Lemon Tea", "ชานมไต้หวัน": "Taiwanese Milk Tea", "ชาพีช": "Peach Tea", "ชาลิ้นจี่": "Lychee Tea", "ชาเขียวใส": "Clear Green Tea", "ชาไทยลาเต้": "Thai Tea Latte", "ชาเขียวลาเต้": "Green Tea Latte", "นมสด": "Fresh Milk", "นมสดคาราเมล": "Caramel Fresh Milk", "นมสดมิ้นท์": "Mint Fresh Milk", "มิ้นท์ลาเต้": "Mint Latte", "นมชมพู": "Pink Milk", "นมสดสตรอว์เบอร์รี": "Strawberry Fresh Milk", "เพียวมัทฉะ": "Pure Matcha", "มัทฉะลาเต้": "Matcha Latte", "มัทฉะโกโก้": "Matcha Cocoa", "มัทฉะชาไทย": "Matcha Thai Tea", "มัทฉะเอสเพรสโซ": "Matcha Espresso", "มัทฉะสตรอว์เบอร์รี": "Strawberry Matcha", "โกโก้": "Cocoa", "ดาร์กโกโก้": "Dark Cocoa", "โกโก้ลาเต้": "Cocoa Latte", "โกโก้สตรอว์เบอร์รี": "Strawberry Cocoa", "โกโก้มิ้นท์": "Mint Cocoa", "โกโก้คาราเมล": "Caramel Cocoa", "โกโก้นมชมพู": "Pink Milk Cocoa", "โกโก้ชาไทย": "Thai Tea Cocoa", "สตรอว์เบอร์รีสมูทตี้": "Strawberry Smoothie", "สตรอว์เบอร์รีนมสดสมูทตี้": "Strawberry Milk Smoothie", "แตงโมสมูทตี้": "Watermelon Smoothie", "มะม่วงสมูทตี้": "Mango Smoothie", "แดงโซดา": "Red Syrup Soda", "แดงโซดามะนาว": "Red Syrup Lemon Soda", "ลิ้นจี่โซดา": "Lychee Soda", "สตรอว์เบอร์รีโซดา": "Strawberry Soda", "บลูฮาวายโซดา": "Blue Hawaii Soda", "บ๊วยโซดา": "Plum Soda", "บ๊วยเปรี้ยวโซดา": "Sour Plum Soda", "พีชโซดา": "Peach Soda", "มิ้นท์โซดา": "Mint Soda", "ขนมปังหน้าเนยนม": "Butter & Condensed Milk Toast", "ขนมปังหน้าเนยนมคาราเมล": "Butter, Milk & Caramel Toast", "ขนมปังหน้าสังขยา": "Pandan Custard Toast", "ขนมปังหน้าช็อกโกแลต": "Chocolate Toast", "ขนมปังหน้าสตอเบอร์รี่": "Strawberry Toast", "ขนมปังช็อค + เนยนม": "Choc & Butter Milk Toast", "ขนมปังช็อค + สตอเบอร์รี่": "Choc & Strawberry Toast", "ขนมปังช็อค + สังขยา": "Choc & Custard Toast", "ขนมปังเนยนม + สังขยา": "Butter Milk & Custard Toast", "ขนมปังเนยนม + สตอเบอร์รี่": "Butter Milk & Strawberry Toast", "มาม่าต้มยำไก่สับ": "Tom Yum Noodles w/ Minced Chicken", "มาม่าต้มยำทะเล": "Tom Yum Noodles w/ Seafood", "มาม่าต้มยำหน้ารวม": "Tom Yum Noodles Mixed", "มาม่าผัดไข่": "Stir-fried Noodles w/ Egg", "มาม่าผัดกระเพราไก่สับ": "Basil Noodles w/ Minced Chicken", "มาม่าไก่กรอบเกาหลี": "Korean Crispy Chicken Noodles", "มาม่าผัดกระเพราไก่กรอบ": "Basil Noodles w/ Crispy Chicken", "ข้าวแกงกะหรี่ไก่กรอบ": "Crispy Chicken Curry Rice", "ข้าวหน้าไก่กรอบ": "Crispy Chicken Rice", "ข้าวหน้าไก่กรอบเทอริยากิ": "Teriyaki Crispy Chicken Rice", "ข้าวหน้าไก่กรอบซอสเผ็ดเกาหลี": "Spicy Korean Crispy Chicken Rice", "ข้าวหน้าไก่กรอบปาปิก้า": "Paprika Crispy Chicken Rice", "ข้าวหน้าไก่กรอบวิ้งค์แซ่บ": "Spicy Zab Crispy Chicken Rice", "ข้าวหน้าไก่กรอบผงชีส": "Cheese Powder Crispy Chicken Rice", "ข้าวยำไก่แซ่บ": "Spicy Chicken Salad w/ Rice", "ข้าวผัดกระเพราไก่": "Basil Minced Chicken on Rice", "ข้าวผัดกระเพราไก่กรอบ": "Basil Crispy Chicken on Rice", "ข้าวผัดกระเพราหมึก": "Basil Squid on Rice", "ข้าวผัดกระเพรากุ้ง": "Basil Shrimp on Rice", "ข้าวผัดกระเพราเนื้อ": "Basil Beef on Rice", "ข้าวผัดกระเพราทะเล": "Basil Seafood on Rice", "ข้าวไข่เจียวไก่สับ": "Minced Chicken Omelet on Rice", "เฟรนฟราย": "French Fries", "ไส้กรอกแดง": "Red Sausage", "ชีสบอล": "Cheese Balls", "นักเก็ต": "Nuggets", "ไก่ป๊อป": "Chicken Pop", "หอมทอด": "Onion Rings", "เอ็นไก่ทอด": "Fried Chicken Tendons", "ปลาทิพย์": "Fried Fish Sticks", "กะโปะ(สินค้าจากนราธิวาส)": "Fish Crackers", "ปูอัดทอดกรอบ": "Crispy Crab Sticks", "ไก่ทอด": "Fried Chicken", "ยำไก่แซ่บ": "Spicy Chicken Salad", "ยำมาม่า": "Spicy Noodle Salad", "ยำวุ้นเส้น": "Spicy Glass Noodle Salad", "ยำเล็บมือนาง": "Spicy Chicken Feet Salad", "ยำเส้นเล็กไก่ยอ": "Spicy Small Noodle Salad w/ Chicken Roll", "ยำเส้นเล็กกุ้งสด": "Spicy Small Noodle Salad w/ Fresh Shrimp", "ยำไก่ยอ": "Spicy Chicken Roll Salad", "ยำไข่ดาว": "Spicy Fried Egg Salad", "ยำข้าวโพด": "Spicy Corn Salad", "ยำเส้นแก้ว": "Spicy Glass Noodle Salad", "ยำรวมมิตร": "Mixed Spicy Salad", "เนื้อย่าง": "Grilled Beef", "ไส้กรอกอีสาน": "Isan Sausage", "ไก่พันเห็ด": "Mushroom Wrapped w/ Chicken",
        "บุกบราวน์ชูการ์               ": "Brown Sugar Jelly", "บุกบราวน์ชูการ์": "Brown Sugar Jelly", "ครีมชีส": "Cream Cheese", "ช็อคขูด": "Grated Chocolate", "เฉ๊าก๋วย": "Grass Jelly", "ไซรัปสตอ": "Strawberry Syrup", "ไซรัปคาราเมล": "Caramel Syrup", "ไข่ดาว              ": "Fried Egg", "ไข่ดาว": "Fried Egg", "ไข่เจียว": "Omelet", "ไก่กรอบ": "Crispy Chicken",
        "ไม่เผ็ด": "Not Spicy", "เผ็ดน้อย": "Mild", "เผ็ดปานกลาง": "Medium", "เผ็ดมาก": "Very Spicy",
        "หวาน": "Sweet", "ปั่น": "Frappe", "พิเศษ": "Extra", "เผ็ด": "Spicy",
        "ปกติ": "Normal", "หมด": "Sold Out"
    };

    function tMenu(text) {
        if (!text) return "";
        if (currentLang === 'en') {
            let t = text.toString().trim();
            if (menuDictionary[t]) return menuDictionary[t];
            // Multi-item translations (e.g., "หวาน 100%, ปั่น")
            let parts = t.split(',').map(p => {
                p = p.trim();
                if (p.startsWith("หวาน ")) return "Sweet " + p.replace("หวาน ", "");
                if (menuDictionary[p]) return menuDictionary[p];
                return p;
            });
            if (parts.join(', ') !== t) return parts.join(', ');
        }
        return text;
    }

    window.onload = async () => {
        applyLanguagePack();
        const urlParams = new URLSearchParams(window.location.search);
        const urlTable = urlParams.get('table');
        
        // ถ้ามี table ใน URL ให้เริ่มระบบและบันทึกลงเครื่อง
        if (urlTable) { 
            currentTable = urlTable; 
            localStorage.setItem('withu_table', currentTable); 
            startApp(); 
            if (localStorage.getItem('withu_order_active') === 'true') showStatus(); 
        }
        // ถ้าไม่มีใน URL แต่มีบิลค้างอยู่ (ลูกค้าอาจเผลอกดรีเฟรชตอนอยู่หน้าคิว) ให้เปิดหน้า Status ต่อได้
        else if (localStorage.getItem('withu_table') && localStorage.getItem('withu_order_active') === 'true') { 
            currentTable = localStorage.getItem('withu_table'); 
            startApp(); 
            showStatus(); 
        } 
        // นอกนั้น (เข้าเว็บเฉยๆ, ไม่มีบิลค้าง) บังคับสแกน QR
        else {
            localStorage.removeItem('withu_table');
            document.getElementById("table-overlay").style.display = "flex";
        }
    }

    function startApp() { document.getElementById("display-table").innerText = "T" + currentTable; document.getElementById("table-overlay").style.display = "none"; document.getElementById("menu-view").style.display = "block"; document.getElementById("app-header").style.display = "flex"; loadMenu(); }


    const FIREBASE_BASE = 'https://withu-da97c-default-rtdb.asia-southeast1.firebasedatabase.app';

    async function mergeCustomMenu(gasMenu, pageType) {
        try {
            const res = await fetch(FIREBASE_BASE + '/customMenu.json');
            const customData = await res.json();
            if (!customData) return gasMenu;
            let merged = gasMenu.map(r => {
                const ov = Object.values(customData).find(c => c.name === r[0]);
                if (ov) {
                    if (pageType === 'dine' && ov.showIn === 'delivery') return null;
                    if (pageType === 'delivery' && ov.showIn === 'dine') return null;
                    let u = [...r];
                    if (ov.price !== undefined) u[1] = ov.price;
                    if (ov.status) u[5] = ov.status;
                    if (ov.image) u[4] = ov.image;
                    if (ov.badge !== undefined) u[7] = ov.badge;
                    if (ov.options) u[8] = ov.options;
                    return u;
                }
                return r;
            }).filter(r => r !== null);
            Object.values(customData).forEach(c => {
                if (c.isCustom) {
                    if (pageType === 'dine' && c.showIn === 'delivery') return;
                    if (pageType === 'delivery' && c.showIn === 'dine') return;
                    if (!merged.find(r => r[0] === c.name)) {
                        merged.push([c.name, c.price, c.category, c.subcategory||'', c.image||'', c.status||'\u0e1b\u0e01\u0e15\u0e34', '', c.badge||'', c.options||{}]);
                    }
                }
            });
            return merged;
        } catch(e) { console.warn('mergeCustomMenu error:', e); return gasMenu; }
    }

    async function loadMenu() { 
        const cachedMenu = localStorage.getItem('withu_cached_menu');
        if(cachedMenu) { 
            const d = JSON.parse(cachedMenu); 
            fullMenu = d.menu; 
            toppingsData = d.toppings || []; 
            toppingsData2 = d.toppings2 || []; 
            fullMenu = await mergeCustomMenu(fullMenu, 'dine');
            renderMenu("\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14"); 
            if(d.banners) renderBanners(d.banners); 
        }
        fetch(API_URL + "?action=getMenu").then(r=>r.json()).then(async d=>{
            if(d.menu) { 
                localStorage.setItem('withu_cached_menu', JSON.stringify(d)); 
                fullMenu = d.menu; 
                toppingsData = d.toppings || []; 
                toppingsData2 = d.toppings2 || []; 
                fullMenu = await mergeCustomMenu(fullMenu, 'dine');
                renderMenu(currentF); 
                renderBanners(d.banners); 
            }
        });
        window.addEventListener('storage', function(e) {
            if (e.key === 'withu_menu_updated') { localStorage.removeItem('withu_cached_menu'); loadMenu(); }
        });
    }
    async function renderBanners(fallbackBannersArray) {
        const track = document.getElementById("banner-track");
        const dotsContainer = document.getElementById("banner-dots");
        if (!track || !dotsContainer) return;
        
        let targetBanners = fallbackBannersArray;
        try {
            const res = await fetch('https://withu-da97c-default-rtdb.asia-southeast1.firebasedatabase.app/banners.json');
            const data = await res.json();
            if (data && Array.isArray(data) && data.length > 0) {
                targetBanners = data;
            }
        } catch(e) { console.warn('Firebase banners failed', e); }

        let defaultBanners = [ "https://img1.pic.in.th/images/eiei-3.md.png", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1920&auto=format&fit=crop" ];
        if (!targetBanners || targetBanners.length === 0) targetBanners = defaultBanners;
        
        track.innerHTML = targetBanners.map(url => `<div class="banner-slide"><img src="${url}" loading="lazy" alt="Banner"></div>`).join('');
        dotsContainer.innerHTML = targetBanners.map((_, i) => `<div class="banner-dot ${i===0?'active':''}" onclick="moveToBanner(${i})"></div>`).join('');
        currentBannerIndex = 0; updateBannerPosition();
        if (bannerSliderInterval) clearInterval(bannerSliderInterval);
        if (targetBanners.length > 1) { bannerSliderInterval = setInterval(autoSlideBanners, 4000); setupBannerTouchEvents(); }
    }

    function autoSlideBanners() { const slides = document.querySelectorAll(".banner-slide"); if (slides.length === 0) return; currentBannerIndex = (currentBannerIndex + 1) % slides.length; updateBannerPosition(); }
    function moveToBanner(index) { currentBannerIndex = index; updateBannerPosition(); if (bannerSliderInterval) { clearInterval(bannerSliderInterval); bannerSliderInterval = setInterval(autoSlideBanners, 4000); } }
    function updateBannerPosition() {
        const track = document.getElementById("banner-track"); const dots = document.querySelectorAll(".banner-dot");
        if (!track) return; track.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
        dots.forEach((dot, idx) => dot.classList.toggle("active", idx === currentBannerIndex));
    }

    function setupBannerTouchEvents() {
        const container = document.getElementById("banner-carousel-block"); if (!container) return;
        container.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        container.addEventListener("touchend", e => { touchEndX = e.changedTouches[0].screenX; handleBannerSwipe(); }, {passive: true});
    }

    function handleBannerSwipe() {
        const slides = document.querySelectorAll(".banner-slide"); if (slides.length <= 1) return;
        if (touchStartX - touchEndX > 50) { currentBannerIndex = (currentBannerIndex + 1) % slides.length; updateBannerPosition(); } 
        else if (touchEndX - touchStartX > 50) { currentBannerIndex = (currentBannerIndex - 1 + slides.length) % slides.length; updateBannerPosition(); }
    }

    function renderMenu(f) {
        currentF = f; currentSubF = "ทั้งหมด";
        const n = document.getElementById('category-nav'); const sn = document.getElementById('sub-category-nav');
        const bannerBlock = document.getElementById('banner-carousel-block');
        if (bannerBlock) bannerBlock.style.display = (f === "ทั้งหมด" && currentSearch === "") ? "block" : "none";

        let cats = [...new Set(fullMenu.map(r => r[2] || "อื่นๆ"))];
        n.innerHTML = `<div onclick="renderMenu('ทั้งหมด')" class="nav-pill ${f==='ทั้งหมด'?'active':''}">${translate('all_cat')}</div>` + cats.map(c => `<div onclick="renderMenu('${c}')" class="nav-pill ${f===c?'active':''}">${tMenu(c)}</div>`).join('');
        let subCats = [...new Set(fullMenu.filter(r => r[2] === f && r[3] && r[3] !== "").map(r => r[3]))];
        if (subCats.length > 0) { sn.style.display = 'flex'; sn.innerHTML = `<div onclick="filterSub('ทั้งหมด')" class="sub-pill ${currentSubF==='ทั้งหมด'?'active':''}">${translate('view_all')}</div>` + subCats.map(sc => `<div onclick="filterSub('${sc}')" class="sub-pill ${currentSubF===sc?'active':''}">${tMenu(sc)}</div>`).join(''); } else { sn.style.display = 'none'; }
        updateDisplay();
    }

    function filterSub(sc) { currentSubF = sc; document.querySelectorAll('.sub-pill').forEach(p => p.classList.toggle('active', p.innerText === sc || (sc === "ทั้งหมด" && p.innerText === "ดูทั้งหมด"))); updateDisplay(); }

    function updateDisplay() {
        const m = document.getElementById('main-content');
        const filtered = fullMenu.filter(r => (currentF === "ทั้งหมด" || r[2] === currentF) && (currentSubF === "ทั้งหมด" || r[3] === currentSubF) && r[0].toLowerCase().includes(currentSearch));
        
        m.innerHTML = filtered.map((r) => {
            const idx = fullMenu.findIndex(item => item[0] === r[0]);
            
            let isAvail = (r[5] !== "หมด");
            let cat = r[2] || "";
            // Default category-based options
            let isD = (cat === "เครื่องดื่ม" || cat === "สมูทตี้");
            let isFoodWithTopping = (cat === "เมนูเส้น" || cat === "เมนูข้าว"); 
            let isYum = (cat === "เมนูยำ" || cat === "ยำ");
            
            let showFrappe = (cat === "เครื่องดื่ม");
            let hasSpicy = isFoodWithTopping || isYum;
            let hasSpecial = isFoodWithTopping || isYum || (cat === "ของทานเล่น"); // Snacks usually have "+พิเศษ"
            
            // Per-item option overrides from Firebase (r[8])
            const _iopts = r[8] && typeof r[8] === 'object' ? r[8] : null;
            if (_iopts) {
                if (_iopts.sweetness !== undefined) isD = _iopts.sweetness;
                if (_iopts.frappe !== undefined) showFrappe = _iopts.frappe;
                if (_iopts.spiciness !== undefined) hasSpicy = _iopts.spiciness;
                if (_iopts.special !== undefined) hasSpecial = _iopts.special;
                if (_iopts.topping !== undefined && !_iopts.topping) isFoodWithTopping = false;
            }
            
            let showTopping = false;
            let toppingLabel = "";
            
            if (isD) { showTopping = true; toppingLabel = translate('topping_drink'); } 
            else if (isFoodWithTopping) { showTopping = true; toppingLabel = translate('topping_food'); } 
            else { showTopping = false; }
            
            let isExp = itemExpanded[idx] || false;
            
            if(!itemQty[idx]) itemQty[idx] = 1; 
            if(isD && !currentS[idx]) currentS[idx] = "100%"; 
            if(hasSpicy && !currentSpicy[idx]) currentSpicy[idx] = "เผ็ดปานกลาง"; 
            if(!itemOpt[idx]) itemOpt[idx] = { toppings: [], smoothie: false, special: false }; 
            
            let badgeText = r[7] ? r[7].toString().trim() : "";
            let badgeHtml = badgeText ? `<span class="lux-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> ${badgeText}</span>` : "";

            let currentToppingsList = isD ? toppingsData : toppingsData2;

            return `
            <div class="menu-item ${isAvail ? '' : 'sold-out'}">
                <div class="menu-card-core">
                    <div class="menu-img-wrap">
                        <img src="${r[4]||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'}" class="menu-img" loading="lazy" decoding="async">
                    </div>
                    <div class="menu-info">
                        ${badgeHtml}
                        <h3>${tMenu(r[0])}</h3>
                        <div class="menu-desc">${isD ? translate('drink_desc') : translate('food_desc')}</div>
                        <div class="price">฿${r[1]}</div>
                    </div>
                </div>

                ${isAvail && isD ? `
                <div class="option-section">
                    <div class="opt-label">${translate('sweetness')}</div>
                    <div class="segmented-control">
                        ${['0%','25%','50%','75%','100%'].map(l=>`<div class="seg-btn ${currentS[idx]===l?'active':''}" onclick="setS(${idx},'${l}')">${l}</div>`).join('')}
                    </div>
                </div>
                
                ${showFrappe ? `
                <div class="smoothie-btn ${itemOpt[idx].smoothie?'active':''}" onclick="tS(${idx})">
                    <span>${translate('frappe')}</span><span class="price-add">+฿10</span>
                </div>` : ''}
                ` : ''}
                
                ${isAvail && hasSpicy ? `
                <div class="option-section">
                    <div class="opt-label">${translate('spiciness')}</div>
                    <div class="segmented-control">
                        ${['ไม่เผ็ด','เผ็ดน้อย','เผ็ดปานกลาง','เผ็ดมาก'].map(l=>`<div class="seg-btn ${currentSpicy[idx]===l?'active':''}" onclick="setSpicy(${idx},'${l}')" style="font-size:12px; padding:10px 2px; white-space:nowrap;">${tMenu(l)}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${isAvail && hasSpecial ? `
                <div class="special-btn ${itemOpt[idx].special?'active':''}" onclick="tSpecial(${idx})">
                    <span>${translate('extra')}</span><span class="price-add">+฿${r[0] === 'เฟรนฟราย' ? 20 : 10}</span>
                </div>
                ` : ''}

                ${isAvail && showTopping ? `
                <div class="acc-toggle" onclick="toggleAcc(${idx})">
                    <span>${toppingLabel}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform: ${isExp ? 'rotate(180deg)' : 'none'}; transition: 0.3s;"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div style="display:${isExp?'block':'none'}">
                    <div class="topping-grid">
                        ${currentToppingsList.map(t => {
                            const isActive = itemOpt[idx].toppings.includes(t[0]);
                            return `
                            <div class="top-chip ${isActive ? 'active':''} ${t[2]==='หมด'?'sold-out':''}" onclick="tT(${idx},'${t[0]}')">
                                <div class="top-chip-name">
                                    ${isActive ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                                    ${tMenu(t[0])}
                                </div>
                                <span class="top-chip-price">+${t[1]}</span>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="action-row">
                    ${isAvail ? `
                    <div class="lux-qty">
                        <button class="lux-btn" onclick="updateQty(${idx},-1)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                        
                        <span class="lux-num" id="qty-lbl-${idx}" onclick="editQty(${idx})">${itemQty[idx]}</span>
                        <input type="number" class="lux-num-input" id="qty-inp-${idx}" style="display:none;" value="${itemQty[idx]}" onblur="saveQty(${idx})" onkeypress="if(event.key==='Enter') saveQty(${idx})">
                        
                        <button class="lux-btn" onclick="updateQty(${idx},1)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                    </div>` : ''}
                    <button class="add-cart-btn" onclick="addC('${r[0]}',${r[1]},${idx},${isD},${hasSpicy})">
                        ${isAvail ? translate('add_to_cart') : translate('sold_out')}
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    function editQty(idx) {
        document.getElementById(`qty-lbl-${idx}`).style.display = 'none';
        let inp = document.getElementById(`qty-inp-${idx}`);
        inp.style.display = 'inline-block';
        inp.value = itemQty[idx];
        inp.focus();
        inp.select();
    }
    
    function saveQty(idx) {
        let inp = document.getElementById(`qty-inp-${idx}`);
        let val = parseInt(inp.value);
        if (isNaN(val) || val < 1) val = 1;
        itemQty[idx] = val;
        inp.style.display = 'none';
        document.getElementById(`qty-lbl-${idx}`).style.display = 'inline-block';
        updateDisplay();
    }

    function updateQty(idx, val) { itemQty[idx] = Math.max(1, itemQty[idx] + val); updateDisplay(); }
    function toggleAcc(idx) { itemExpanded[idx] = !itemExpanded[idx]; updateDisplay(); }
    function setS(i, l) { currentS[i] = l; updateDisplay(); }
    function setSpicy(i, l) { currentSpicy[i] = l; updateDisplay(); }
    function tSpecial(i) { itemOpt[i].special = !itemOpt[i].special; updateDisplay(); }
    
    function tS(i) { itemOpt[i].smoothie = !itemOpt[i].smoothie; updateDisplay(); }
    function tT(i, n) { let t = itemOpt[i].toppings; itemOpt[i].toppings = t.includes(n) ? t.filter(x => x !== n) : [...t, n]; updateDisplay(); }
    
    function handleSearch() { 
        currentSearch = document.getElementById('menu-search').value.toLowerCase(); 
        document.getElementById('clear-search').style.display = currentSearch.length > 0 ? 'flex' : 'none';
        renderMenu(currentF); 
    }
    
    function clearSearch() {
        document.getElementById('menu-search').value = '';
        handleSearch();
    }

    function addC(n, p, idx, isD, isFood) {
        let basePrice = parseFloat(p), extras = 0, det = [], qty = itemQty[idx];
        
        let mObj = fullMenu[idx];
        let cat = mObj[2] || "";
        let isFoodWithTopping = (cat === "เมนูเส้น" || cat === "เมนูข้าว"); 
        
        if(isD) { 
            det.push("หวาน " + currentS[idx]); 
            if(itemOpt[idx].smoothie) { extras += 10; det.push("ปั่น"); } 
        }
        
        if(isFood) {
            det.push(currentSpicy[idx]);
            if(itemOpt[idx].special) { extras += (n === "เฟรนฟราย" ? 20 : 10); det.push("พิเศษ"); }
        }

        let currentToppingsList = isD ? toppingsData : (isFoodWithTopping ? toppingsData2 : []);
        
        itemOpt[idx].toppings.forEach(tn => { 
            let tObj = currentToppingsList.find(x => x[0] === tn); 
            if(tObj) { extras += parseFloat(tObj[1]); det.push(tn); } 
        }); 

        cart.push({name: n, price: basePrice + extras, qty: qty, total: (basePrice + extras) * qty, sweetness: det.join(", ")||'-'}); 
        
        itemQty[idx] = 1; 
        itemOpt[idx] = { toppings: [], smoothie: false, special: false }; 
        currentS[idx] = "100%"; 
        currentSpicy[idx] = "เผ็ดปานกลาง"; 
        itemExpanded[idx] = false;
        
        updateUI();
    }

    function updateUI() { document.getElementById('cart-bar').style.display = cart.length > 0 ? 'flex' : 'none'; let total = cart.reduce((s,i)=>s+i.total,0); document.getElementById('cart-sum-val').innerText = total.toLocaleString(); document.getElementById('cart-count').innerText = cart.length; }
    
    function openReceipt() {
        let h = `<div class="chk-header"><h2 class="chk-title">Order Summary</h2><p style="color:var(--secondary); font-size:14px; margin-top:4px; font-family:var(--font-body);">${translate('order_summary')}</p></div>`;
        cart.forEach((i,idx) => {
            let mObj = fullMenu.find(x => x[0] === i.name);
            let imgUrl = mObj && mObj[4] ? mObj[4] : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
            
            h += `
            <div class="chk-item">
                <img src="${imgUrl}" class="chk-img">
                <div class="chk-details">
                    <div class="chk-name-row">
                        <div class="chk-name"><span class="chk-qty">${i.qty}x</span> ${tMenu(i.name)}</div>
                        <div class="chk-price">฿${i.total.toLocaleString()}</div>
                    </div>
                    <div class="chk-options">${tMenu(i.sweetness)}</div>
                    <div class="chk-remove" onclick="rem(${idx})">${translate('remove')}</div>
                </div>
            </div>`;
        });
        
        let savedPhone = localStorage.getItem('withu_dinein_phone') || '';
        h += `<div style="margin: 24px 0 10px 0;">
                <label class="opt-label" style="font-size:12px; margin-bottom:8px; display:block;">${translate('note_prompt')}</label>
                <textarea id="global-note" class="cart-note" rows="2" placeholder="${translate('note_placeholder')}" style="margin:0; margin-bottom:12px;"></textarea>
                
                <label class="opt-label" style="font-size:12px; margin-bottom:8px; display:block; color:var(--primary);">🎁 สมาชิกระบบสะสมแต้ม</label>
                <input type="tel" id="reward-phone" class="cart-note" placeholder="เบอร์โทรศัพท์สะสมแต้ม (ถ้ามี)" style="margin:0; padding:12px;" oninput="savePhoneLocally(this.value)" value="${savedPhone}">
              </div>`;
              
        let total = cart.reduce((s,i)=>s+i.total,0);
        let earnPoints = Math.floor(total / 50);

        h += `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16,185,129,0.3); padding: 12px 16px; border-radius: 12px; margin: 16px 0; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="font-size: 20px;">🎁</div>
                    <div>
                        <div style="font-size: 13px; font-weight: 700; color: #059669;">WITHU REWARDS</div>
                        <div style="font-size: 11px; color: #047857; opacity: 0.8;">ทุก 50 บาท รับ 1 แต้ม</div>
                    </div>
                </div>
                <div style="font-size: 16px; font-weight: 800; color: #10b981;">+${earnPoints} แต้ม</div>
            </div>
            
            <div class="chk-summary">
                <span class="summary-label">${translate('net_total')}</span>
                <span class="summary-total">${translate('price_sign')}${total.toLocaleString()}</span>
            </div>
            <button class="add-cart-btn" style="margin-top:24px; height: 64px; width: 100%;" onclick="sub()">${translate('confirm_order')}</button>`;
        document.getElementById('modal-body').innerHTML = h; document.getElementById('modal').style.display = 'flex';
    }
    
    function rem(i) { cart.splice(i, 1); updateUI(); cart.length > 0 ? openReceipt() : document.getElementById('modal').style.display = 'none'; }

    function savePhoneLocally(val) {
        let clean = val.replace(/\D/g, '');
        if(clean.length >= 9) localStorage.setItem('withu_dinein_phone', clean);
    }

    async function sub() { 
        let globalNote = document.getElementById('global-note').value.trim();
        const rewardPhone = document.getElementById('reward-phone') ? document.getElementById('reward-phone').value.replace(/\D/g, '') : '';
        
        if (rewardPhone) {
            globalNote = globalNote ? globalNote + ` | โทร: ${rewardPhone}` : `โทร: ${rewardPhone}`;
        }

        if(cart.length > 0) {
            cart.forEach(item => { 
                let details = item.sweetness && item.sweetness !== '-' ? item.sweetness : '';
                if (globalNote) details += (details ? ', ' : '') + globalNote;
                item.note = details; 
            }); 
        }
        
        const payload = { action: 'submitOrder', apiKey: API_KEY, table: currentTable, cart: cart };

        localStorage.setItem('withu_order_active', 'true');
        document.getElementById('modal-body').innerHTML = `<div style="text-align:center; padding:60px 0;"><div style="position:relative; display:inline-block; margin-bottom: 30px;"><svg class="walking-cat" style="width: 80px; height: 80px; z-index:2; position:relative; margin-bottom:-10px;" viewBox="0 0 100 100"><path d="M 20 50 Q 20 20 50 20 Q 80 20 80 50 L 80 80 Q 80 90 70 90 L 30 90 Q 20 90 20 80 Z" fill="var(--primary)" /><path d="M 20 40 L 20 10 L 45 25" fill="var(--primary)" /><path d="M 80 40 L 80 10 L 55 25" fill="var(--primary)" /><circle cx="35" cy="50" r="6" fill="#fff" /><circle cx="65" cy="50" r="6" fill="#fff" /><circle cx="35" cy="50" r="2" fill="#000" /><circle cx="65" cy="50" r="2" fill="#000" /><circle cx="22" cy="55" r="5" fill="rgba(255,105,180,0.6)" /><circle cx="78" cy="55" r="5" fill="rgba(255,105,180,0.6)" /><path d="M 45 58 Q 50 63 55 58" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg><div class="cat-shadow" style="width: 50px; height: 10px; background: #000; border-radius: 50%; margin: 0 auto; position: absolute; bottom: -15px; left: 50%; margin-left: -25px;"></div></div><style>@keyframes hopCat { 0% { transform: translateY(0) scale(1.1, 0.9); } 30% { transform: translateY(-20px) scale(0.95, 1.05); } 50% { transform: translateY(-25px) scale(1, 1); } 70% { transform: translateY(-20px) scale(0.95, 1.05); } 100% { transform: translateY(0) scale(1.1, 0.9); } } @keyframes shadowHop { 0% { transform: scaleX(1.1); opacity: 0.2; } 50% { transform: scaleX(0.4); opacity: 0.05; } 100% { transform: scaleX(1.1); opacity: 0.2; } } .walking-cat { animation: hopCat 0.5s infinite alternate ease-in-out; transform-origin: bottom center; display: inline-block; } .cat-shadow { animation: shadowHop 0.5s infinite alternate ease-in-out; }</style><h2 style="font-family:var(--font-head); font-weight:800; font-size: 22px;">รอสักครู่งับ</h2></div>`;
        
        try {
            await fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
            document.getElementById('modal-body').innerHTML = `<div style="text-align:center; padding:60px 0;"><div style="position:relative; display:inline-block; margin-bottom: 30px;"><svg class="walking-cat" style="width: 80px; height: 80px; z-index:2; position:relative; margin-bottom:-10px;" viewBox="0 0 100 100"><path d="M 20 50 Q 20 20 50 20 Q 80 20 80 50 L 80 80 Q 80 90 70 90 L 30 90 Q 20 90 20 80 Z" fill="var(--primary)" /><path d="M 20 40 L 20 10 L 45 25" fill="var(--primary)" /><path d="M 80 40 L 80 10 L 55 25" fill="var(--primary)" /><circle cx="35" cy="50" r="6" fill="#fff" /><circle cx="65" cy="50" r="6" fill="#fff" /><circle cx="35" cy="50" r="2" fill="#000" /><circle cx="65" cy="50" r="2" fill="#000" /><circle cx="22" cy="55" r="5" fill="rgba(255,105,180,0.6)" /><circle cx="78" cy="55" r="5" fill="rgba(255,105,180,0.6)" /><path d="M 45 58 Q 50 63 55 58" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg><div class="cat-shadow" style="width: 50px; height: 10px; background: #000; border-radius: 50%; margin: 0 auto; position: absolute; bottom: -15px; left: 50%; margin-left: -25px;"></div></div><style>@keyframes hopCat { 0% { transform: translateY(0) scale(1.1, 0.9); } 30% { transform: translateY(-20px) scale(0.95, 1.05); } 50% { transform: translateY(-25px) scale(1, 1); } 70% { transform: translateY(-20px) scale(0.95, 1.05); } 100% { transform: translateY(0) scale(1.1, 0.9); } } @keyframes shadowHop { 0% { transform: scaleX(1.1); opacity: 0.2; } 50% { transform: scaleX(0.4); opacity: 0.05; } 100% { transform: scaleX(1.1); opacity: 0.2; } } .walking-cat { animation: hopCat 0.5s infinite alternate ease-in-out; transform-origin: bottom center; display: inline-block; } .cat-shadow { animation: shadowHop 0.5s infinite alternate ease-in-out; }</style><h2 style="font-family:var(--font-head); font-weight:800; font-size: 24px; color:var(--primary);">ส่งเสร็จแล้วงับ</h2><p style="color:var(--secondary); font-size:15px; margin-top:8px;">${translate('del_wait')}</p></div>`;
            cart = []; updateUI(); setTimeout(() => { showStatus(); }, 2000);
        } catch (e) {
            console.error(e); alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"); openReceipt();
        }
    }

    function openCall() { document.getElementById('call-modal').style.display = 'flex'; }
    
    async function confirmCall() {
        const body = document.getElementById('modal-body');
        body.innerHTML = `<div style="text-align:center; padding:60px 0;"><div class="pulse-loader"></div><h2 style="font-family:var(--font-head); font-weight:800; font-size: 22px;">${translate('calling_staff')}</h2></div>`;
        document.getElementById('modal').style.display = 'flex'; document.getElementById('call-modal').style.display = 'none';

        try {
            await fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ action: 'callStaff', apiKey: API_KEY, table: currentTable, reason: 'ทั่วไป' }) });
            body.innerHTML = `<div style="text-align:center; padding:60px 0;"><div style="font-size:72px; margin-bottom:16px;">✨</div><h2 style="font-family:var(--font-head); font-weight:800; font-size: 24px; color:var(--primary);">${translate('call_ack')}</h2><p style="color:var(--secondary); font-size:15px; margin-top:8px;">${translate('call_coming')}</p></div>`;
            setTimeout(() => { document.getElementById('modal').style.display='none'; }, 2000);
        } catch (e) { document.getElementById('modal').style.display='none'; }
    }

    function orderMore() {
        document.getElementById('status-view').style.display = 'none';
        document.getElementById('menu-view').style.display = 'block';
        if (sInterval) {
            clearInterval(sInterval);
            sInterval = null;
        }
    }

    // ⭐️ แจ้งแอดมินเมื่อขอเช็คบิล ⭐️
    function clearSession() { document.getElementById('modal-body').innerHTML = `<div style="text-align:center; padding:24px 8px;"><div style="font-size:64px; margin-bottom:24px;">👋</div><h2 style="font-family:var(--font-head); font-weight:800; font-size:24px; color:var(--primary);">${translate('call_confirm_title')}</h2><p style="color:var(--secondary); margin-bottom:40px; font-size:15px;">${translate('call_confirm_sub')}</p><button class="add-cart-btn" style="width:100%;" onclick="executeClearSession()">${translate('call_confirm_btn')}</button><button onclick="document.getElementById('modal').style.display='none'" style="margin-top:16px; background:none; border:none; color:var(--secondary); font-family:var(--font-head); font-weight:700; cursor:pointer; width:100%; padding:12px;">${translate('back')}</button></div>`; document.getElementById('modal').style.display = 'flex'; }
    
    async function executeClearSession() { 
        // สั่งให้ขึ้น Loading
        const body = document.getElementById('modal-body');
        body.innerHTML = `<div style="text-align:center; padding:60px 0;"><div class="pulse-loader"></div><h2 style="font-family:var(--font-head); font-weight:800; font-size: 22px;">${translate('calling')}</h2></div>`;
        
        try {
            // ยิงแจ้งเตือนเช็คบิล (ใช้ action callStaff แต่ใส่เหตุผลเป็น pay)
            await fetch(API_URL, { 
                method: 'POST', 
                mode: 'no-cors', 
                body: JSON.stringify({ 
                    action: 'callStaff', 
                    apiKey: API_KEY, 
                    table: currentTable, 
                    reason: 'pay' 
                }) 
            });
            
            body.innerHTML = `<div style="text-align:center; padding:60px 0;"><div style="font-size:72px; margin-bottom:16px;">💰</div><h2 style="font-family:var(--font-head); font-weight:800; font-size: 24px; color:var(--primary);">${translate('call_ack')}</h2><p style="color:var(--secondary); font-size:15px; margin-top:8px;">${translate('wait_bill')}</p></div>`;
            
            // รอให้ลูกค้าดูข้อความ 3 วิ แล้วค่อยลบ Session และกลับหน้าแรก
            setTimeout(() => {
                localStorage.removeItem('withu_table'); 
                localStorage.removeItem('withu_order_active'); 
                window.location.href = window.location.pathname; 
            }, 3000);
            
        } catch (e) { 
            console.error("Payment Request Error:", e);
            alert("เกิดข้อผิดพลาดในการแจ้งพนักงาน กรุณาลองใหม่อีกครั้ง");
            document.getElementById('modal').style.display='none';
        }
    }
    
    function showStatus() { document.getElementById('modal').style.display='none'; document.getElementById('menu-view').style.display='none'; document.getElementById('status-view').style.display='block'; document.getElementById('status-table-no').innerText = currentTable; chk(); if(!sInterval) sInterval = setInterval(chk, 15000); }
    
    async function chk() {
        try {
            const r = await fetch(API_URL + "?action=getAdminData&ts=" + Date.now()); const d = await r.json(); 
            const myOrders = d.orders.filter(o => o.table.toString() == currentTable.toString());

            if (myOrders.length === 0) { 
                upS(4); document.getElementById('queue-info').innerText = "Thank you for dining with us.";
                if(!autoCloseTimer) {
                    let sec = 30; autoCloseTimer = setInterval(() => {
                        sec--; document.getElementById('auto-close-msg').innerText = `ระบบจะปิดอัตโนมัติใน 00:${sec<10?'0':''}${sec}`;
                        if(sec <= 0) {
                            localStorage.removeItem('withu_table'); 
                            localStorage.removeItem('withu_order_active'); 
                            window.location.href = window.location.pathname;
                        }
                    }, 1000);
                } return; 
            }

            const activeOrders = d.orders.filter(o => o.status !== "สำเร็จ" && o.status !== "completed");
            const allTablesInQueue = [...new Set(activeOrders.map(o => o.table.toString()))];
            const myRank = allTablesInQueue.indexOf(currentTable.toString());
            const qEl = document.getElementById('queue-info');
            
            if (myRank === 0) { qEl.innerText = translate('queue_0'); }
            else if (myRank > 0) { qEl.innerText = translate('queue_n').replace('{n}', myRank); }
            else { qEl.innerText = translate('queue_prep'); }

            let minVal = 4, totalSum = 0; 
            const p = {"active":1, "รับออเดอร์":1, "กำลังทำ":2, "รอเสิร์ฟ":3, "completed":4, "สำเร็จ":4};
            
            myOrders.forEach(o => { 
                let statusVal = p[o.status] || 1; if (statusVal < minVal) minVal = statusVal; 
                totalSum += parseFloat(String(o.total).replace(/,/g,'')) || 0; 
            });
            
            upS(minVal); 
            document.getElementById('stat-sum').innerText = totalSum.toLocaleString();
            document.getElementById('stat-list').innerHTML = myOrders.map(o => {
                let displayStatus = o.status === 'active' ? 'รับออเดอร์' : (o.status === 'completed' ? 'สำเร็จ' : o.status);
                let statusColor = displayStatus === 'สำเร็จ' ? 'var(--success)' : 'var(--gold)';
                return `<div style="display:flex;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--border); text-align:left; align-items:center;">
                    <span style="font-family:var(--font-head); font-weight:700; font-size:15px; color:var(--primary);">${o.qty}x ${tMenu(o.menu)}</span>
                    <b style="color:${statusColor}; font-size:13px; font-weight:700; background:var(--gray-light); padding:6px 12px; border-radius:12px;">${tMenu(displayStatus)}</b>
                </div>`;
            }).join('');
        } catch(e) { console.error("Status check failed", e); }
    }
    
    function upS(s) { for(let i=1;i<=4;i++) { const el = document.getElementById('st-'+i); if(el) el.classList.toggle('active', i<=s); } }


window.initCatPopup = async function() {
    if(sessionStorage.getItem('withu_popup_shown')) return;
    try {
        const res = await fetch('https://withu-da97c-default-rtdb.asia-southeast1.firebasedatabase.app/popupAd.json');
        const data = await res.json();
        if(data && data.enabled) {
            
            // Title
            const titleEl = document.getElementById('cat-popup-title');
            if(data.title) { titleEl.innerHTML = data.title; titleEl.style.display = 'block'; }
            else { titleEl.style.display = 'none'; }
            
            // Description
            const textEl = document.getElementById('cat-popup-text');
            if(data.text) { 
                textEl.innerHTML = data.text.replace(/\n/g, '<br>');
                textEl.style.display = 'block'; 
            } else { textEl.style.display = 'none'; }
            
            // Coupon
            const couponBox = document.getElementById('cat-popup-coupon-box');
            const couponText = document.getElementById('cat-popup-coupon-text');
            if(data.coupon) {
                couponText.innerText = data.coupon;
                couponBox.style.display = 'block';
            } else {
                couponBox.style.display = 'none';
            }
            
            // Button
            const btnEl = document.getElementById('cat-popup-btn');
            if(data.btnText) { btnEl.innerText = data.btnText; }
            else { btnEl.innerText = 'สั่งอาหารเลย'; }
            
            // Button Color mapping based on current theme if needed, but the requested color is a nice pastel pink #f4c4c4. 
            // In a real app we might use var(--primary). I'll use var(--primary) for consistency with the app, but keeping the style as requested.
            // Wait, let's use var(--primary) because it fits the app best, but the user showed a peach button. I'll stick to var(--primary) for a unified app look.
            btnEl.style.background = 'var(--primary)';
            btnEl.style.boxShadow = '0 4px 15px var(--primary-glow)';
            
            // Image toggle logic
            const imgBox = document.getElementById('cat-popup-img-box');
            const contentBox = document.getElementById('cat-popup-content-box');
            const popupWrapper = document.getElementById('cat-popup-wrapper');
            
            if (data.showImage === false) {
                imgBox.style.display = 'none';
                contentBox.style.flex = '1 1 100%';
                popupWrapper.style.maxWidth = '450px';
            } else {
                imgBox.style.display = 'block';
                contentBox.style.flex = '1 1 50%';
                popupWrapper.style.maxWidth = '800px';
                if(data.image) document.getElementById('cat-popup-img').src = data.image;
            }
            
            document.getElementById('cat-popup-overlay').style.display = 'flex';
        }
    } catch(e) { console.error('Popup error', e); }
};

window.copyCoupon = function() {
    const text = document.getElementById('cat-popup-coupon-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = document.getElementById('copy-tooltip');
        tooltip.style.opacity = '1';
        setTimeout(() => { tooltip.style.opacity = '0'; }, 2000);
    });
};

window.closeCatPopup = function() {
    const el = document.getElementById('cat-popup-overlay');
    el.style.opacity = '0';
    el.style.transition = '0.3s';
    setTimeout(() => { el.style.display = 'none'; }, 300);
    sessionStorage.setItem('withu_popup_shown', 'true');
};

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.initCatPopup, 1200);
});

