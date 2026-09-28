export const departments = [
    {
        id: 'to',
        name: 'Teknik Otomotif (TO)',
        short: 'TO',
        icon: 'bi-truck-flatbed',
        image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=800',
        desc: 'Mempelajari perawatan dan perbaikan kendaraan bermotor dengan teknologi terbaru.'
    },
    {
        id: 'titl',
        name: 'Teknik Instalasi Tenaga Listrik (TITL)',
        short: 'TITL',
        icon: 'bi-lightning-charge',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=800',
        desc: 'Menguasai sistem kelistrikan bangunan, industri, hingga instalasi motor listrik.'
    },
    {
        id: 'tpm',
        name: 'Teknik Pemesinan (TPM)',
        short: 'TPM',
        icon: 'bi-gear-wide-connected',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800',
        desc: 'Keahlian dalam pengoperasian mesin produksi manual maupun CNC (Computer Numerical Control).'
    },
    {
        id: 'tjkt',
        name: 'Teknik Jaringan Komputer & Telekomunikasi (TJKT)',
        short: 'TJKT',
        icon: 'bi-router',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800',
        desc: 'Spesialisasi dalam infrastruktur jaringan, server, dan teknologi telekomunikasi modern.'
    },
    {
        id: 'dkv',
        name: 'Desain Komunikasi Visual (DKV)',
        short: 'DKV',
        icon: 'bi-palette',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800',
        desc: 'Kreativitas digital dalam desain grafis, ilustrasi, fotografi, hingga videografi.'
    }
];

export function renderDepartments(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = departments.map(dept => `
        <div class="col-lg">
            <div class="dept-card-portrait mb-4">
                <img src="${dept.image}" class="dept-img" alt="${dept.name}">
                <div class="dept-overlay">
                    <i class="bi ${dept.icon} dept-icon"></i>
                    <h3 class="dept-title text-uppercase">${dept.short}</h3>
                    <div class="fw-bold small mb-2">${dept.name}</div>
                    <div class="dept-info">
                        <p class="small opacity-90">${dept.desc}</p>
                        <a href="/${dept.id}.html" class="btn btn-primary btn-sm rounded-pill px-3">Selengkapnya</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
