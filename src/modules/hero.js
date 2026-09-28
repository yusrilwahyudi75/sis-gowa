import { fetchNews } from './news.js';

export async function renderHeroCarousel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let slidesHTML = '';

    // 1. Always Add SPMB 2027 Info Slide First
    slidesHTML += `
        <div class="carousel-item active hero-section text-white d-flex align-items-center">
            <div class="hero-bg position-absolute top-0 start-0 w-100 h-100">
                <img src="./src/assets/hero.png" alt="Hero" class="w-100 h-100 object-fit-cover">
                <div class="hero-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            </div>
            <div class="container position-relative z-1 py-5">
                <div class="row">
                    <div class="col-lg-8 animate-fade-in-up">
                        <span class="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-bold"><i class="bi bi-clock-history me-1"></i> SPMB 2026 Ditutup • SPMB 2027 Segera Hadir</span>
                        <h1 class="display-3 fw-bold mb-4">Persiapkan Masa Depanmu di <span class="text-primary-light">SMKN 5 Gowa</span></h1>
                        <p class="lead mb-4 opacity-85">Pendaftaran SPMB T.A 2026/2027 telah resmi ditutup. Pembukaan SPMB T.A 2027/2028 diperkirakan dibuka pada <strong>Mei 2027</strong>.</p>
                        <div class="d-flex gap-3 flex-wrap">
                            <button class="btn btn-primary btn-lg rounded-pill px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#spmbModal"><i class="bi bi-file-earmark-check me-2"></i>Syarat Pendaftaran</button>
                            <a href="https://spmb.sulselprov.go.id/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold"><i class="bi bi-box-arrow-up-right me-2"></i>Portal SPMB Sulsel</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. Add News Slides if available
    try {
        const news = await fetchNews();
        if (news && news.length > 0) {
            news.forEach((item) => {
                slidesHTML += `
                    <div class="carousel-item hero-section text-white d-flex align-items-center">
                        <div class="hero-bg position-absolute top-0 start-0 w-100 h-100">
                            <img src="${item.image || item.image_url || './src/assets/hero.png'}" alt="${item.title}" class="w-100 h-100 object-fit-cover">
                            <div class="hero-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-60"></div>
                        </div>
                        <div class="container position-relative z-1 py-5">
                            <div class="row">
                                <div class="col-lg-8 animate-fade-in-up">
                                    <span class="badge bg-primary px-3 py-2 rounded-pill mb-3">${item.category || 'Berita Terkini'}</span>
                                    <h1 class="display-4 fw-bold mb-4">${item.title}</h1>
                                    <p class="lead mb-5 opacity-85">${item.excerpt || ''}</p>
                                    <div class="d-flex gap-3 flex-wrap">
                                        <a href="#berita" class="btn btn-primary btn-lg rounded-pill px-5">Selengkapnya</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (err) {
        console.warn('News slide render fallback:', err);
    }

    container.innerHTML = slidesHTML;
}
