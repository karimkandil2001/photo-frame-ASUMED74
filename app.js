document.getElementById('image-upload').addEventListener('change', handleImageUpload);

// تحميل الفريم
const frame = new Image();
frame.crossOrigin = "Anonymous";  // إضافة crossOrigin لدعم CORS
frame.src = 'https://i.ibb.co/DPMc7bFL/frame-png.png'; // رابط الفريم

let moveX = 0;  // الحركة الأفقية
let moveY = 0;  // الحركة الرأسية
let scale = 1;  // التكبير (الزوم)
let isDragging = false; // لتحديد إذا كان المستخدم يسحب الصورة
let startX, startY;

// تحريك الصورة عند السحب
const imagePreview = document.getElementById('image-preview');

imagePreview.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    imagePreview.style.cursor = "grabbing";
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    imagePreview.style.cursor = "grab";
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        moveX = e.clientX - startX;
        moveY = e.clientY - startY;
        imagePreview.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
    }
});

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            const canvasWidth = 600;  // عرض الصورة مع الفريم
            const canvasHeight = 600; // ارتفاع الصورة مع الفريم

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const imgWidth = img.width;
            const imgHeight = img.height;
            const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);

            const x = (canvasWidth - imgWidth * scale) / 2;
            const y = (canvasHeight - imgHeight * scale) / 2;

            // رسم الصورة على canvas بحجم مناسب
            ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
            // رسم الفريم فوق الصورة
            ctx.drawImage(frame, 0, 0, canvasWidth, canvasHeight);

            // تحويل الصورة إلى Base64
            const dataURL = canvas.toDataURL('image/png');
            document.getElementById('image-preview').src = dataURL;
            document.getElementById('image-preview').style.display = 'block';
            document.getElementById('download-btn').style.display = 'inline-block';
            document.getElementById('new-image-btn').style.display = 'inline-block'; // إظهار زر إنشاء صورة جديدة
        };
    };
    reader.readAsDataURL(file);
}

// وظيفة زر "إنشاء صورة جديدة"
document.getElementById('new-image-btn').addEventListener('click', function() {
    // إعادة تعيين كل شيء
    document.getElementById('image-upload').value = ''; // مسح الصورة الحالية
    document.getElementById('image-preview').style.display = 'none'; // إخفاء الصورة المعروضة
    document.getElementById('download-btn').style.display = 'none'; // إخفاء زر التحميل
    document.getElementById('new-image-btn').style.display = 'none'; // إخفاء زر "إنشاء صورة جديدة"
});

// التحكم في التكبير والتصغير
document.getElementById('zoom-in').addEventListener('click', () => {
    scale += 0.1;  // زيادة التكبير
    imagePreview.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
});

document.getElementById('zoom-out').addEventListener('click', () => {
    scale -= 0.1;  // تقليل التكبير
    imagePreview.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
});
