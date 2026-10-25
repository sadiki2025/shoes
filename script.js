// 1. بيانات الشقق (تم تحويل image إلى images لتستقبل مصفوفة تحتوي على أكثر من صورة)
const apartmentsData = [
    {
        id: 1,
        category: '2beds',
        title: 'شقة عصرية غرفتين وصالة',
        space: '90 م²',
        price: '350,000 ريال',
        images: ['image/NIKE5.jpg', 'image/NIKE5_living.jpg', 'image/NIKE5_kitchen.jpg'] // <-- ضع هنا صور الشقة الأولى
    },
    {
        id: 2,
        category: '3beds',
        title: 'شقة عائلية 3 غرف نوم',
        space: '140 م²',
        price: '500,000 ريال',
        images: ['image/NIKE5.jpg', 'image/NIKE5_bed1.jpg']
    },
    {
        id: 3,
        category: 'luxury',
        title: 'دوبلكس فاخر مع إطلالة',
        space: '250 م²',
        price: '950,000 ريال',
        images: ['https://unsplash.com', 'https://unsplash.com']
    },
    {
        id: 4,
        category: '2beds',
        title: 'شقة غرفتين مريحة وهادئة',
        space: '85 م²',
        price: '320,000 ريال',
        images: ['https://unsplash.com']
    },
    {
        id: 5,
        category: '3beds',
        title: 'شقة 3 غرف واسعة بتصميم مودرن',
        space: '160 م²',
        price: '580,000 ريال',
        images: ['https://unsplash.com']
    },
    {
        id: 6,
        category: 'luxury',
        title: 'بنتهاوس فاخر بتشطيب ملكي',
        space: '300 م²',
        price: '1,200,000 ريال',
        images: ['https://unsplash.com']
    }
];

// تحديد حاوية الشقق في الـ HTML
const container = document.getElementById('apartmentsContainer');

// 2. دالة عرض الشقق في الصفحة (تدعم عرض معرض الصور والأزرار الخاصة به)
function displayApartments(apartments) {
    container.innerHTML = "";
    
    if(apartments.length === 0) {
        container.innerHTML = `<p class="no-results">لا توجد شقق متاحة في هذا القسم حالياً.</p>`;
        return;
    }

    apartments.forEach(apt => {
        // توليد أكواد عناصر الصور بناءً على مصفوفة الصور لكل شقة
        const imagesHtml = apt.images.map((imgUrl, index) => `
            <img src="${imgUrl}" alt="${apt.title} - صورة ${index + 1}" class="apt-img ${index === 0 ? 'active' : ''}" onclick="zoomImage(this.src)">
        `).join('');

        // إذا كانت الشقة تحتوي على أكثر من صورة، يتم إظهار أزرار التنقل (الأسهم)
        const showControls = apt.images.length > 1;
        const nextBtn = showControls ? `<button class="slide-btn next-btn" onclick="moveSlide(this, 1)">&#10094;</button>` : '';
        const prevBtn = showControls ? `<button class="slide-btn prev-btn" onclick="moveSlide(this, -1)">&#10095;</button>` : '';

        const aptCard = `
            <div class="apartment-card" data-category="${apt.category}">
                <div class="img-wrapper">
                    <div class="slider-container">
                        ${imagesHtml}
                    </div>
                    ${nextBtn}
                    ${prevBtn}
                </div>
                <div class="apt-details">
                    <h3 class="apt-title">${apt.title}</h3>
                    <p class="apt-info">📐 المساحة: ${apt.space}</p>
                    <p class="apt-price">💰 السعر: ${apt.price}</p>
                    <button class="details-btn">تفاصيل أكثر</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', aptCard);
    });
}

// دالة جديدة كلياً للتحكم في الأسهم والتنقل بين الصور داخل كل شقة بشكل مستقل
function moveSlide(buttonElement, direction) {
    // الوصول إلى حاوية الصور داخل الكرت المعني فقط
    const imgWrapper = buttonElement.parentElement;
    const slides = imgWrapper.querySelectorAll('.slider-container .apt-img');
    
    // البحث عن الصورة الفعالة حالياً
    let activeIndex = Array.from(slides).findIndex(img => img.classList.contains('active'));
    
    // إخفاء الصورة الحالية
    slides[activeIndex].classList.remove('active');
    
    // حساب مؤشر الصورة التالية
    activeIndex += direction;
    if (activeIndex >= slides.length) activeIndex = 0;
    if (activeIndex < 0) activeIndex = slides.length - 1;
    
    // إظهار الصورة الجديدة
    slides[activeIndex].classList.add('active');
}

// 3. دالة الفلترة (التصفية) وتغيير حالة الأزرار النشطة (Active)
function filterApartments(category, buttonElement) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');

    if (category === 'all') {
        displayApartments(apartmentsData);
    } else {
        const filtered = apartmentsData.filter(apt => apt.category === category);
        displayApartments(filtered);
    }
}

// 4. دالة تكبير الصورة (تفتح الصورة الحالية التي يضغط عليها المستخدم في وضع ملء الشاشة)
function zoomImage(imgSrc) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'zoom-out';

    const largeImg = document.createElement('img');
    largeImg.src = imgSrc;
    largeImg.style.maxWidth = '90%';
    largeImg.style.maxHeight = '90%';
    largeImg.style.borderRadius = '8px';
    largeImg.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
    largeImg.style.transition = 'transform 0.3s ease';

    overlay.appendChild(largeImg);
    document.body.appendChild(overlay);

    overlay.onclick = function() {
        document.body.removeChild(overlay);
    };
}

// تشغيل العرض الأولي عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    displayApartments(apartmentsData);
});
