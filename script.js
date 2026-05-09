const galleryGrid = document.getElementById('galleryGrid');
const layoutToggle = document.getElementById('layoutToggle');
const themeToggle = document.querySelector('#checkbox');
const lightbox = document.getElementById('lightbox');
const fullImg = document.getElementById('fullImage');
const closeBtn = document.querySelector('.close');

let isGridView = true;
let currentPage = 1;
const itemsPerPage = 12;
let currentImgIndex = 2;
let touchStartX = 0;

// 1. Render Gallery Logic
function renderGallery(page) {
    galleryGrid.innerHTML = '';
    const start = (page - 1) * itemsPerPage + 2; // Starts from 2.jpg
    const end = Math.min(start + itemsPerPage - 1, 240);

    for (let i = start; i <= end; i++) {
        const card = document.createElement('div');
        card.className = 'img-card';
        card.innerHTML = `
            <img src="${i}.jpg" alt="Img ${i}" onclick="openLightbox(${i})">
            <p>Image #${i}</p>
            <button onclick="downloadImg('${i}.jpg')">Download</button>
        `;
        galleryGrid.appendChild(card);
    }
}

// 2. Grid/List Toggle
layoutToggle.addEventListener('click', () => {
    isGridView = !isGridView;
    galleryGrid.className = isGridView ? 'grid-view' : 'list-view';
    layoutToggle.innerText = isGridView ? 'Switch to List View' : 'Switch to Grid View';
});

// 3. Dark/Light Mode
themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
});

// 4. Lightbox (Full Screen) Logic
function openLightbox(index) {
    currentImgIndex = index;
    fullImg.src = `${index}.jpg`;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Stop scrolling background
}

function changeImage(step) {
    currentImgIndex += step;
    if (currentImgIndex < 2) currentImgIndex = 240;
    if (currentImgIndex > 240) currentImgIndex = 2;
    fullImg.src = `${currentImgIndex}.jpg`;
}

closeBtn.onclick = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
};

document.getElementById('lbNext').onclick = () => changeImage(1);
document.getElementById('lbPrev').onclick = () => changeImage(-1);

// 5. Swipe Support
lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
lightbox.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) changeImage(1);  // Swipe Left
    if (touchEndX - touchStartX > 50) changeImage(-1); // Swipe Right
});

// 6. Download Function
function downloadImg(path) {
    const link = document.createElement('a');
    link.href = path;
    link.download = path.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 7. Pagination
document.getElementById('nextBtn').onclick = () => {
    if (currentPage * itemsPerPage < 238) {
        currentPage++;
        renderGallery(currentPage);
        window.scrollTo(0, galleryGrid.offsetTop - 100);
    }
};

document.getElementById('prevBtn').onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderGallery(currentPage);
        window.scrollTo(0, galleryGrid.offsetTop - 100);
    }
};

// 8. Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === "ArrowRight") changeImage(1);
        if (e.key === "ArrowLeft") changeImage(-1);
        if (e.key === "Escape") closeBtn.onclick();
    }
});

// Initial Load
renderGallery(1);