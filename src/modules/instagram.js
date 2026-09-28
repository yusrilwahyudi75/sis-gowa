// Data Resmi Instagram Feed SMKN 5 Gowa (@smkn5_gowa)
export const instagramPosts = [
    {
        id: 'ig-1',
        type: 'instagram',
        title: 'Pelatihan AI-Ready ASEAN',
        caption: 'Menyambut masa depan cerdas! 💡 Jumat, 24 Juli 2026, Komunitas Belajar SMKN 5 Gowa sukses melaksanakan kegiatan pengimbasan dari pelatihan Gerakan AI-Ready ASEAN (AIRA) bersama Narasumber Ibu Ira Firawati, S.Si. #AIReadyASEAN #SMKN5Gowa #KomunitasBelajar',
        image_url: '/assets/instagram/ig1.png',
        date: '24 Juli 2026',
        likes: 34,
        comments: 8,
        url: 'https://www.instagram.com/smkn5_gowa/p/DbNr7g4D1O2/'
    },
    {
        id: 'ig-2',
        type: 'instagram',
        title: 'Rapat Awal Tahun Ajaran 2026/2027',
        caption: 'Menyambut Langkah Baru dengan Sinergi dan Kolaborasi! ✨ Segenap pendidik dan tenaga kependidikan SMK Negeri 5 Gowa melaksanakan Rapat Awal Tahun Ajaran 2026/2027 untuk menghadirkan pendidikan vokasi yang berkualitas. #SMKN5Gowa #RapatAwalTahun #SMKBisaSMKHebat',
        image_url: '/assets/instagram/ig2.png',
        date: '20 Juli 2026',
        likes: 25,
        comments: 6,
        url: 'https://www.instagram.com/smkn5_gowa/p/DbBNqr4D8iR/'
    },
    {
        id: 'ig-3',
        type: 'instagram',
        title: 'Upacara & Pelepasan PKL XII',
        caption: 'UPACARA BENDERA HARI SENIN 20 JULI 2026 SEKALIGUS PELEPASAN PESERTA PRAKTIK KERJA LAPANGAN KELAS XII SMK NEGERI 5 GOWA DAN PENGUMUMAN PRESTASI SISWA 🇮🇩✨ #SMKN5GOWA #SMKNBISASMKHEBAT #vokasikuatmenguatkanindonesia',
        image_url: '/assets/instagram/ig3.png',
        date: '20 Juli 2026',
        likes: 74,
        comments: 14,
        url: 'https://www.instagram.com/smkn5_gowa/reel/DbBF5rFvyBK/'
    },
    {
        id: 'ig-4',
        type: 'instagram',
        title: 'Pelepasan Guru & Tendik Purnabakti',
        caption: '✨ SILATURAHMI & PELEPASAN GURU SERTA TENAGA PENDIDIK PURNABAKTI & MUTASI SMK NEGERI 5 GOWA ✨ Momen penuh haru sekaligus kebahagiaan melepas kepergian Bapak/Ibu guru purnabakti dan mutasi. Terima kasih atas segala dedikasi! ❤️ #SMKN5GOWA #VokasiHebat',
        image_url: '/assets/instagram/ig4.png',
        date: '17 Juli 2026',
        likes: 138,
        comments: 29,
        url: 'https://www.instagram.com/smkn5_gowa/p/Da9I3rjjz7W/'
    },
    {
        id: 'ig-5',
        type: 'instagram',
        title: 'Penutupan MPLS Ramah 2026',
        caption: '✨ Jumat Berkah, MPLS Resmi Berakhir! ✨ Hari terakhir Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah di SMK Negeri 5 Gowa ditutup dengan penuh khidmat. Selamat bergabung di keluarga besar SMKN 5 Gowa! 🚀✨ #SMKN5Gowa #MPLSRamah2026 #SMKHEBAT',
        image_url: '/assets/instagram/ig5.png',
        date: '16 Juli 2026',
        likes: 75,
        comments: 11,
        url: 'https://www.instagram.com/smkn5_gowa/p/Da4lBGkjyqS/'
    }
];

export function renderHomeInstagramFeed(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = instagramPosts.map(post => `
        <div class="col-6 col-md-3">
            <div class="ig-card shadow-sm h-100">
                <div class="ig-badge">
                    <i class="bi bi-instagram"></i> @smkn5_gowa
                </div>
                <div class="ig-img-wrapper">
                    <img src="${post.image_url}" alt="${post.title}" loading="lazy">
                    <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="ig-overlay text-decoration-none text-white">
                        <div>
                            <p class="small fw-semibold mb-2 line-clamp-2">${post.caption}</p>
                            <div class="d-flex align-items-center gap-3 x-small opacity-90">
                                <span><i class="bi bi-heart-fill text-danger me-1"></i> ${post.likes}</span>
                                <span><i class="bi bi-chat-fill me-1"></i> ${post.comments}</span>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="p-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="fw-bold text-dark text-truncate small" style="max-width: 140px;">${post.title}</span>
                        <span class="text-muted x-small">${post.date}</span>
                    </div>
                    <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="text-decoration-none x-small fw-bold text-primary">
                        Buka di IG <i class="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}
