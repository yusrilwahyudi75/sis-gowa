export const announcements = [
    {
        id: 1,
        title: 'Pengambilan Ijazah Tahun Ajaran 2024/2025',
        category: 'Akademik',
        date: '10 Mei 2026',
        excerpt: 'Bagi seluruh siswa kelas XII yang telah dinyatakan lulus, ijazah dapat diambil mulai tanggal...',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800'
    },
    {
        id: 2,
        title: 'Jadwal Rapat Komite Sekolah Semester Ganjil',
        category: 'Informasi',
        date: '15 Mei 2026',
        excerpt: 'Diberitahukan kepada seluruh orang tua/wali siswa untuk menghadiri rapat komite yang akan dilaksanakan pada...',
        image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=800'
    },
    {
        id: 3,
        title: 'Pelaksanaan Ujian Tengah Semester (UTS)',
        category: 'Akademik',
        date: '20 Mei 2026',
        excerpt: 'Ujian Tengah Semester (UTS) genap akan dilaksanakan mulai tanggal 25 Mei 2026. Diharapkan seluruh siswa...',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800'
    }
];

export function renderAnnouncements(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = announcements.map(item => `
        <div class="col-lg-4 mb-4">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-hover">
                <img src="${item.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${item.title}">
                <div class="card-body p-4 d-flex flex-column">
                    <span class="badge bg-danger bg-opacity-10 text-danger mb-3 align-self-start">${item.category}</span>
                    <h5 class="fw-bold mb-3">${item.title}</h5>
                    <p class="text-muted small mb-4 flex-grow-1">${item.excerpt}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <small class="text-muted"><i class="bi bi-calendar3 me-2"></i>${item.date}</small>
                        <a href="/pengumuman.html" class="text-primary text-decoration-none fw-semibold small">Selengkapnya</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
