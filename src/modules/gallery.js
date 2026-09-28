import { supabase } from '../lib/supabase.js';
import { instagramPosts } from './instagram.js';

const fallbackGalleryData = [
    { id: 1, title: 'Fasilitas Bengkel & Lab', category: 'Fasilitas', image_url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=800', type: 'school', created_at: '2026-07-01' },
    { id: 2, title: 'Praktik Industri TJKT', category: 'Praktik', image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800', type: 'school', created_at: '2026-06-25' },
    { id: 3, title: 'Gedung Utama Sekolah', category: 'Fasilitas', image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800', type: 'school', created_at: '2026-06-20' },
    { id: 4, title: 'Kegiatan Ekstrakurikuler', category: 'Kegiatan', image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800', type: 'school', created_at: '2026-06-15' },
    { id: 5, title: 'Suasana Belajar Kelas', category: 'Kegiatan', image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800', type: 'school', created_at: '2026-06-10' },
    { id: 6, title: 'Pameran Karya Siswa DKV', category: 'Prestasi', image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800', type: 'school', created_at: '2026-06-05' }
];

export async function fetchGallery() {
    const fetchPromise = (async () => {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) throw new Error('No gallery images found');
        return data;
    })();

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(fallbackGalleryData), 1000));

    try {
        return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
        console.warn('Using fallback gallery data:', error.message);
        return fallbackGalleryData;
    }
}

// Unified homepage gallery rendering with filter tabs (Sorted by Latest Post Date)
export function setupHomeUnifiedGallery(schoolGallery) {
    const container = document.getElementById('home-unified-gallery');
    const filterTabsContainer = document.getElementById('home-gallery-filter-tabs');
    const countBadge = document.getElementById('home-gallery-count-badge');

    if (!container) return;

    const formattedSchoolItems = (schoolGallery || []).map(item => ({
        id: `school-${item.id}`,
        type: 'school',
        title: item.title || 'Dokumentasi Sekolah',
        category: item.category || 'Galeri',
        image_url: item.image_url,
        date: 'Terbaru',
        timestamp: 1,
        url: null
    }));

    const formattedIgItems = instagramPosts.map((item, index) => ({
        id: item.id,
        type: 'instagram',
        title: item.title,
        caption: item.caption,
        category: 'Instagram',
        image_url: item.image_url,
        date: item.date,
        timestamp: 100 - index, // Higher timestamp for newer IG posts
        likes: item.likes,
        comments: item.comments,
        url: item.url
    }));

    // Newest IG posts first, then school gallery
    const allItems = [...formattedIgItems, ...formattedSchoolItems].slice(0, 6);

    function renderFilteredItems(filterType) {
        let itemsToDisplay = [];
        if (filterType === 'all') {
            itemsToDisplay = allItems;
        } else if (filterType === 'school') {
            itemsToDisplay = formattedSchoolItems.slice(0, 6);
        } else if (filterType === 'instagram') {
            itemsToDisplay = formattedIgItems.slice(0, 6);
        }

        if (countBadge) {
            countBadge.textContent = `Menampilkan ${itemsToDisplay.length} foto & update terbaru`;
        }

        if (itemsToDisplay.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5 text-muted">Belum ada foto dalam kategori ini.</div>`;
            return;
        }

        container.innerHTML = itemsToDisplay.map(item => {
            if (item.type === 'instagram') {
                return `
                <div class="col-6 col-md-4 col-lg-4">
                    <div class="ig-card shadow-sm h-100">
                        <div class="ig-badge">
                            <i class="bi bi-instagram"></i> @smkn5_gowa
                        </div>
                        <div class="ig-img-wrapper">
                            <img src="${item.image_url}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800';">
                            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="ig-overlay text-decoration-none text-white">
                                <div>
                                    <p class="small fw-semibold mb-2">${item.caption}</p>
                                    <div class="d-flex align-items-center gap-3 x-small opacity-90">
                                        <span><i class="bi bi-heart-fill text-danger me-1"></i> ${item.likes}</span>
                                        <span><i class="bi bi-chat-fill me-1"></i> ${item.comments}</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="p-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="fw-bold text-dark text-truncate small">${item.title}</span>
                                <span class="text-muted x-small">${item.date}</span>
                            </div>
                            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="text-decoration-none x-small fw-bold text-primary">
                                Lihat di IG <i class="bi bi-box-arrow-up-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
                `;
            } else {
                return `
                <div class="col-6 col-md-4 col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-hover">
                        <div class="position-relative" style="height: 280px;">
                            <img src="${item.image_url}" class="w-100 h-100 object-fit-cover" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800';">
                            <span class="badge bg-primary position-absolute top-0 start-0 m-3 rounded-pill px-3 py-2 small">${item.category}</span>
                        </div>
                        <div class="card-body p-3">
                            <h6 class="fw-bold mb-0 text-dark small text-truncate">${item.title}</h6>
                        </div>
                    </div>
                </div>
                `;
            }
        }).join('');
    }

    if (filterTabsContainer) {
        const buttons = filterTabsContainer.querySelectorAll('.filter-tab-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.classList.remove('active', 'active-ig');
                });
                const filter = btn.getAttribute('data-filter');
                if (filter === 'instagram') {
                    btn.classList.add('active-ig');
                } else {
                    btn.classList.add('active');
                }
                renderFilteredItems(filter);
            });
        });
    }

    renderFilteredItems('all');
}

// Full gallery page rendering (Sorted by Latest Post Date: Newest IG Posts First!)
export function setupGalleryPage(schoolGallery) {
    const container = document.getElementById('gallery-container');
    const filterTabsContainer = document.getElementById('gallery-filter-tabs');
    const countBadge = document.getElementById('gallery-count-badge');

    if (!container) return;

    const formattedSchoolItems = (schoolGallery || []).map(item => ({
        id: `school-${item.id}`,
        type: 'school',
        title: item.title || 'Dokumentasi Sekolah',
        category: item.category || 'Galeri',
        image_url: item.image_url,
        date: 'Terbaru',
        url: null
    }));

    const formattedIgItems = instagramPosts.map(item => ({
        id: item.id,
        type: 'instagram',
        title: item.title,
        caption: item.caption,
        category: 'Instagram',
        image_url: item.image_url,
        date: item.date,
        likes: item.likes,
        comments: item.comments,
        url: item.url
    }));

    // Newest IG Posts First, followed by school gallery items
    const allItems = [...formattedIgItems, ...formattedSchoolItems];

    function renderFilteredItems(filterType) {
        let itemsToDisplay = [];
        if (filterType === 'all') {
            itemsToDisplay = allItems;
        } else if (filterType === 'school') {
            itemsToDisplay = formattedSchoolItems;
        } else if (filterType === 'instagram') {
            itemsToDisplay = formattedIgItems;
        }

        if (countBadge) {
            countBadge.textContent = `Menampilkan ${itemsToDisplay.length} foto / dokumentasi`;
        }

        if (itemsToDisplay.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5 text-muted">Belum ada foto dalam kategori ini.</div>`;
            return;
        }

        container.innerHTML = itemsToDisplay.map(item => {
            if (item.type === 'instagram') {
                return `
                <div class="col-md-4 col-sm-6">
                    <div class="ig-card shadow-sm h-100">
                        <div class="ig-badge">
                            <i class="bi bi-instagram"></i> @smkn5_gowa
                        </div>
                        <div class="ig-img-wrapper">
                            <img src="${item.image_url}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800';">
                            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="ig-overlay text-decoration-none text-white">
                                <div>
                                    <p class="small fw-semibold mb-2">${item.caption}</p>
                                    <div class="d-flex align-items-center gap-3 x-small opacity-90">
                                        <span><i class="bi bi-heart-fill text-danger me-1"></i> ${item.likes}</span>
                                        <span><i class="bi bi-chat-fill me-1"></i> ${item.comments}</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="p-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="fw-bold text-dark text-truncate small">${item.title}</span>
                                <span class="text-muted x-small">${item.date}</span>
                            </div>
                            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="text-decoration-none x-small fw-bold text-primary">
                                Lihat di Instagram <i class="bi bi-box-arrow-up-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
                `;
            } else {
                return `
                <div class="col-md-4 col-sm-6">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-hover">
                        <div class="position-relative" style="height: 250px;">
                            <img src="${item.image_url}" class="w-100 h-100 object-fit-cover" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800';">
                            <span class="badge bg-primary position-absolute top-0 start-0 m-3 rounded-pill px-3 py-2 small">${item.category}</span>
                        </div>
                        <div class="card-body p-3">
                            <h6 class="fw-bold mb-0 text-dark">${item.title}</h6>
                        </div>
                    </div>
                </div>
                `;
            }
        }).join('');
    }

    if (filterTabsContainer) {
        const buttons = filterTabsContainer.querySelectorAll('.filter-tab-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.classList.remove('active', 'active-ig');
                });
                const filter = btn.getAttribute('data-filter');
                if (filter === 'instagram') {
                    btn.classList.add('active-ig');
                } else {
                    btn.classList.add('active');
                }
                renderFilteredItems(filter);
            });
        });
    }

    renderFilteredItems('all');
}
