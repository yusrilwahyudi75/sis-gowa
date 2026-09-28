import { supabase } from '../lib/supabase.js';

const fallbackNewsData = [
    {
        id: 1,
        title: 'Pelatihan Berbasis Industri untuk Jurusan TJKT',
        excerpt: 'SMKN 5 Gowa bekerja sama dengan Mikrotik Indonesia dalam menyelenggarakan sertifikasi MTCNA...',
        category: 'Kegiatan',
        date: '2 Mei 2026',
        image: 'https://images.unsplash.com/photo-1523050853064-8902804b8b6a?q=80&w=800'
    },
    {
        id: 2,
        title: 'Juara 1 LKS Tingkat Provinsi Bidang Otomotif',
        excerpt: 'Siswa SMKN 5 Gowa kembali menorehkan prestasi membanggakan di ajang Lomba Kompetensi Siswa...',
        category: 'Prestasi',
        date: '28 April 2026',
        image: 'https://images.unsplash.com/photo-1517245315840-8c29a888c381?q=80&w=800'
    },
    {
        id: 3,
        title: 'Kunjungan Industri ke Kawasan Manufaktur',
        excerpt: 'Sebanyak 100 siswa jurusan Pemesinan melakukan kunjungan industri untuk melihat proses produksi...',
        category: 'Kunjungan',
        date: '25 April 2026',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800'
    }
];

export async function fetchNews() {
    const fetchPromise = (async () => {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;
        if (!data || data.length === 0) throw new Error('No news found');
        return data;
    })();

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(fallbackNewsData), 500));

    try {
        return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
        console.warn('Using fallback news data:', error.message);
        return fallbackNewsData;
    }
}

export function renderNews(news, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = news.map(item => {
        const generatedExcerpt = item.excerpt || (item.content ? (item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '')) : 'Tidak ada ringkasan.');
        const imageUrl = item.image_url || item.image || 'https://images.unsplash.com/photo-1523050853064-8902804b8b6a?q=80&w=800';
        return `
        <div class="col-lg-4 mb-4">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-hover">
                <div class="position-relative">
                    <img src="${imageUrl}" class="card-img-top object-fit-cover" alt="${item.title}" style="height: 200px;">
                    <span class="badge bg-primary position-absolute top-0 end-0 m-3 rounded-pill">${item.category}</span>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                    <h5 class="fw-bold mb-3">${item.title}</h5>
                    <p class="text-muted small mb-4">${generatedExcerpt}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                        <small class="text-muted"><i class="bi bi-calendar3 me-1"></i> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : (item.date || '-')}</small>
                        <a href="/berita.html" class="text-primary text-decoration-none fw-semibold small">Baca Selengkapnya</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
}
