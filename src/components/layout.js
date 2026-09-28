class SiteHeader extends HTMLElement {
    connectedCallback() {
        const currentPath = window.location.pathname;
        
        this.innerHTML = `
        <!-- Top Bar -->
        <div class="top-bar py-2 text-white">
            <div class="container d-flex justify-content-between align-items-center">
                <div class="top-bar-links d-none d-md-block">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#spmbModal"
                        class="me-3 text-decoration-none text-white small fw-bold"><i class="bi bi-info-circle me-1"></i>Info SPMB 2027</a>
                    <a href="#" class="me-3 text-decoration-none text-white small">Download</a>
                    <a href="/buku-tamu.html" target="_blank" class="me-3 text-decoration-none text-white small ${currentPath === '/buku-tamu.html' ? 'fw-bold' : ''}">Buku Tamu</a>
                </div>
                <div class="top-bar-social">
                    <a href="#" class="text-white ms-3" title="Facebook"><i class="bi bi-facebook"></i></a>
                    <a href="https://www.instagram.com/smkn5_gowa/" target="_blank" rel="noopener noreferrer" class="text-white ms-3" title="Instagram @smkn5_gowa"><i class="bi bi-instagram"></i></a>
                    <a href="#" class="text-white ms-3" title="YouTube"><i class="bi bi-youtube"></i></a>
                </div>
            </div>
        </div>

        <!-- Main Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light sticky-top bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center" href="/">
                    <img src="/assets/logo.png" alt="Logo" width="45" class="me-2">
                    <span class="fw-bold">SMKN 5 Gowa</span>
                </a>
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto fw-medium">
                        <li class="nav-item">
                            <a class="nav-link ${currentPath === '/' || currentPath === '/index.html' ? 'active' : ''}" href="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Profil</a>
                            <ul class="dropdown-menu border-0 shadow-sm">
                                <li><a class="dropdown-item" href="/visi-misi.html">Visi & Misi</a></li>
                                <li><a class="dropdown-item" href="/struktur.html">Struktur Organisasi</a></li>
                                <li><a class="dropdown-item" href="/guru.html">Guru & Tenaga Kependidikan</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Program Keahlian</a>
                            <ul class="dropdown-menu border-0 shadow-sm">
                                <li><a class="dropdown-item" href="/to.html">Teknik Otomotif (TO)</a></li>
                                <li><a class="dropdown-item" href="/titl.html">Teknik Instalasi Tenaga Listrik (TITL)</a></li>
                                <li><a class="dropdown-item" href="/tpm.html">Teknik Pemesinan (TPM)</a></li>
                                <li><a class="dropdown-item" href="/tjkt.html">Teknik Jaringan Komputer & Telekomunikasi (TJKT)</a></li>
                                <li><a class="dropdown-item" href="/dkv.html">Desain Komunikasi Visual (DKV)</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Informasi</a>
                            <ul class="dropdown-menu border-0 shadow-sm">
                                <li><a class="dropdown-item" href="/berita.html">Berita</a></li>
                                <li><a class="dropdown-item" href="/program-sekolah.html">Program Sekolah</a></li>
                                <li><a class="dropdown-item" href="/ekskul.html">Ekstrakurikuler</a></li>
                                <li><a class="dropdown-item" href="/pengumuman.html">Pengumuman</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Layanan</a>
                            <ul class="dropdown-menu border-0 shadow-sm">
                                <li><a class="dropdown-item" href="https://eraport.smkn5gowa.sch.id" target="_blank">e-Raport</a></li>
                                <li><a class="dropdown-item" href="https://simpegdik.sulselprov.go.id/site/login" target="_blank">Simpegdik</a></li>
                                <li><a class="dropdown-item" href="https://sim.pijarsekolah.id/smkn5gowa/login" target="_blank">LMS Pijar</a></li>
                                <li><a class="dropdown-item" href="#">Ruang GTK</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPath === '/galeri.html' ? 'active' : ''}" href="/galeri.html">Galeri</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPath === '/kontak.html' ? 'active' : ''}" href="/kontak.html">Kontak</a>
                        </li>
                    </ul>
                    <div class="ms-lg-3 mt-3 mt-lg-0">
                        <a href="/admin.html" class="btn btn-primary rounded-pill px-4">Login Admin</a>
                    </div>
                </div>
            </div>
        </nav>
        `;
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="bg-dark text-white py-5 mt-auto">
            <div class="container">
                <div class="row g-5">
                    <div class="col-lg-4">
                        <div class="d-flex align-items-center mb-4">
                            <img src="/assets/logo.png" alt="Logo" width="45" class="me-2">
                            <h4 class="fw-bold mb-0">SMKN 5 Gowa</h4>
                        </div>
                        <p class="small opacity-75 mb-4">Sekolah Menengah Kejuruan Negeri 5 Gowa berkomitmen untuk menghasilkan lulusan yang kompeten, berkarakter, dan siap bersaing di era industri 4.0.</p>
                        <div class="d-flex gap-3">
                            <a href="#" class="btn btn-outline-light btn-sm rounded-circle" style="width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"><i class="bi bi-facebook"></i></a>
                            <a href="https://www.instagram.com/smkn5_gowa/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light btn-sm rounded-circle" style="width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;" title="Instagram @smkn5_gowa"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="btn btn-outline-light btn-sm rounded-circle" style="width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"><i class="bi bi-youtube"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <h5 class="fw-bold mb-4">Tautan Cepat</h5>
                        <ul class="list-unstyled small opacity-75">
                            <li class="mb-2"><a href="/visi-misi.html" class="text-white text-decoration-none">Profil Sekolah</a></li>
                            <li class="mb-2"><a href="/to.html" class="text-white text-decoration-none">Program Keahlian</a></li>
                            <li class="mb-2"><a href="/berita.html" class="text-white text-decoration-none">Berita</a></li>
                            <li class="mb-2"><a href="/galeri.html" class="text-white text-decoration-none">Galeri</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-3">
                        <h5 class="fw-bold mb-4">Layanan</h5>
                        <ul class="list-unstyled small opacity-75">
                            <li class="mb-2"><a href="https://eraport.smkn5gowa.sch.id" target="_blank" class="text-white text-decoration-none">e-Raport</a></li>
                            <li class="mb-2"><a href="https://simpegdik.sulselprov.go.id/site/login" target="_blank" class="text-white text-decoration-none">Simpegdik</a></li>
                            <li class="mb-2"><a href="https://sim.pijarsekolah.id/smkn5gowa/login" target="_blank" class="text-white text-decoration-none">LMS Pijar</a></li>
                            <li class="mb-2"><a href="https://spmb.sulselprov.go.id/" target="_blank" class="text-white text-decoration-none">SPMB Online</a></li>
                            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Ruang GTK</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-3">
                        <h5 class="fw-bold mb-4">Kontak</h5>
                        <ul class="list-unstyled small opacity-75">
                            <li class="mb-3 d-flex"><i class="bi bi-geo-alt-fill me-2 text-primary"></i> Jl. Pendidikan No.3, Panaikang, Kec. Pattallassang, Kabupaten Gowa, Sulawesi Selatan 90562</li>
                            <li class="mb-3 d-flex"><i class="bi bi-telephone-fill me-2 text-primary"></i> (0411) 123456</li>
                            <li class="mb-3 d-flex"><i class="bi bi-envelope-fill me-2 text-primary"></i> info@smkn5gowa.sch.id</li>
                        </ul>
                    </div>
                </div>
                <hr class="my-5 opacity-25">
                <div class="text-center small opacity-50">
                    <p class="mb-0">&copy; 2026 SMKN 5 Gowa. All Rights Reserved. Built with <i class="bi bi-heart-fill text-danger"></i> for Education.</p>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);

class PageHeader extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Judul Halaman';
        const subtitle = this.getAttribute('subtitle') || 'Deskripsi halaman';
        
        this.innerHTML = `
        <div class="page-header-wrapper overflow-hidden position-relative">
            <!-- Decorative Shapes -->
            <div class="shape-1 position-absolute rounded-circle"></div>
            <div class="shape-2 position-absolute rounded-circle"></div>
            
            <div class="container position-relative z-1 text-center py-3">
                <div class="glass-card d-inline-block px-4 py-3 rounded-4 shadow-lg border border-white border-opacity-25 page-header-content mx-auto" style="max-width: 800px;">
                    <h1 class="display-6 fw-bold mb-2 text-white" style="text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${title}</h1>
                    <p class="text-white opacity-90 mb-0 px-2 fw-light">${subtitle}</p>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('page-header', PageHeader);
