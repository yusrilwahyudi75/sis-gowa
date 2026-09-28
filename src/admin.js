import { Modal } from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import { supabase } from './lib/supabase.js';

const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');

// Tables and Content
const newsTableBody = document.getElementById('news-table-body');
const teachersTableBody = document.getElementById('teachers-table-body');
const galleryTableBody = document.getElementById('gallery-table-body');
const contentNews = document.getElementById('content-news');
const contentTeachers = document.getElementById('content-teachers');
const contentGallery = document.getElementById('content-gallery');
const contentStudents = document.getElementById('content-students');
const contentGuestbook = document.getElementById('content-guestbook');
const guestbookTableBody = document.getElementById('guestbook-table-body');

// Tabs
const tabNews = document.getElementById('tab-news');
const tabTeachers = document.getElementById('tab-teachers');
const tabGallery = document.getElementById('tab-gallery');
const tabStudents = document.getElementById('tab-students');
const tabGuestbook = document.getElementById('tab-guestbook');

// Forms
const addNewsForm = document.getElementById('add-news-form');
const addTeacherForm = document.getElementById('add-teacher-form');
const addGalleryForm = document.getElementById('add-gallery-form');

// State
let currentUser = null;

// Check Session on Load
async function checkUser() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
            showDashboard(session.user);
            return;
        }
    } catch (e) {
        console.warn('Session check warning:', e);
    }
    showAuth();
}

function showAuth() {
    if (authSection) authSection.classList.remove('d-none');
    if (dashboardSection) dashboardSection.classList.add('d-none');
}

function showDashboard(user) {
    currentUser = user;
    if (authSection) authSection.classList.add('d-none');
    if (dashboardSection) dashboardSection.classList.remove('d-none');
    if (userEmailSpan) userEmailSpan.textContent = user.email;
    loadNews();
}

// Tab Switching
function resetTabs() {
    [tabNews, tabTeachers, tabGallery, tabStudents, tabGuestbook].forEach(tab => {
        if (tab) {
            tab.classList.remove('active');
            tab.classList.add('text-dark');
        }
    });
    [contentNews, contentTeachers, contentGallery, contentStudents, contentGuestbook].forEach(content => {
        if (content) content.classList.add('d-none');
    });
}

if (tabNews) {
    tabNews.addEventListener('click', (e) => {
        e.preventDefault();
        resetTabs();
        tabNews.classList.add('active');
        tabNews.classList.remove('text-dark');
        if (contentNews) contentNews.classList.remove('d-none');
        loadNews();
    });
}

if (tabTeachers) {
    tabTeachers.addEventListener('click', (e) => {
        e.preventDefault();
        resetTabs();
        tabTeachers.classList.add('active');
        tabTeachers.classList.remove('text-dark');
        if (contentTeachers) contentTeachers.classList.remove('d-none');
        loadTeachers();
    });
}

if (tabGallery) {
    tabGallery.addEventListener('click', (e) => {
        e.preventDefault();
        resetTabs();
        tabGallery.classList.add('active');
        tabGallery.classList.remove('text-dark');
        if (contentGallery) contentGallery.classList.remove('d-none');
        loadGallery();
    });
}

if (tabStudents) {
    tabStudents.addEventListener('click', (e) => {
        e.preventDefault();
        resetTabs();
        tabStudents.classList.add('active');
        tabStudents.classList.remove('text-dark');
        if (contentStudents) contentStudents.classList.remove('d-none');
    });
}

if (tabGuestbook) {
    tabGuestbook.addEventListener('click', (e) => {
        e.preventDefault();
        resetTabs();
        tabGuestbook.classList.add('active');
        tabGuestbook.classList.remove('text-dark');
        if (contentGuestbook) contentGuestbook.classList.remove('d-none');
        loadGuestbook();
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) errorDiv.classList.add('d-none');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                if (errorDiv) {
                    errorDiv.textContent = 'Gagal Masuk: ' + error.message;
                    errorDiv.classList.remove('d-none');
                }
            } else {
                showDashboard(data.user);
            }
        } catch (err) {
            if (errorDiv) {
                errorDiv.textContent = 'Gagal terhubung ke database. Cek koneksi Anda.';
                errorDiv.classList.remove('d-none');
            }
        }
    });
}

const handleLogout = async (e) => {
    if (e) e.preventDefault();
    showCustomConfirm('Keluar Admin', 'Apakah Anda yakin ingin keluar dari panel admin?', async () => {
        try {
            localStorage.removeItem('sis_gowa_admin_session');
        } catch (err) {}
        try {
            await supabase.auth.signOut();
        } catch (err) {}
        location.reload();
    });
};

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

const sidebarLogoutBtn = document.getElementById('btn-sidebar-logout');
if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', handleLogout);
}

// NEWS CRUD
async function loadNews() {
    if (!newsTableBody) return;
    newsTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Memuat data...</td></tr>';
    
    let dbData = [];
    try {
        const fetchPromise = (async () => {
            const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        })();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([]), 1500));
        dbData = await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err) {
        console.warn('Supabase news fetch failed, loading local:', err.message);
    }

    // Read LocalStorage news
    let localData = [];
    try {
        localData = JSON.parse(localStorage.getItem('sis_gowa_local_news') || '[]');
    } catch (e) {}

    // Combine & Sort by created_at descending
    const combinedNews = [...localData, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (combinedNews.length === 0) {
        newsTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Belum ada berita.</td></tr>';
        return;
    }

    newsTableBody.innerHTML = combinedNews.map((item, index) => `
        <tr>
            <td class="ps-4" style="width: 50%;">
                <div class="fw-bold text-dark">${item.title}</div>
                <div class="text-muted x-small">${item.excerpt || (item.content ? item.content.substring(0, 50).replace(/<[^>]*>/g, '') + '...' : '')}</div>
            </td>
            <td style="width: 15%;"><span class="badge bg-primary bg-opacity-10 text-primary">${item.category}</span></td>
            <td class="text-muted small" style="width: 20%;">${new Date(item.created_at).toLocaleDateString('id-ID')}</td>
            <td class="text-center pe-4" style="width: 15%;">
                <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3 btn-delete-news" data-id="${item.id}" data-index="${index}">
                    <i class="bi bi-trash me-1"></i>Hapus
                </button>
            </td>
        </tr>
    `).join('');

    // Store globally for listener access
    window._newsEntries = combinedNews;

    // Attach event listeners
    newsTableBody.querySelectorAll('.btn-delete-news').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'));
            const entry = window._newsEntries[idx];
            window.deleteNews(entry);
        });
    });
}

if (addNewsForm) {
    addNewsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('news-title').value;
        const category = document.getElementById('news-category').value;
        
        // Handle image: check if a file was uploaded or if it is a text link
        const imageFile = document.getElementById('news-image-file').files[0];
        let image_url = document.getElementById('news-image-url').value || 'https://images.unsplash.com/photo-1523050853064-8902804b8b6a?q=80&w=800';

        if (imageFile) {
            // Upload file to Supabase Storage if file is provided
            try {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('news_images')
                    .upload(fileName, imageFile);
                
                if (uploadError) throw uploadError;
                
                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('news_images')
                    .getPublicUrl(fileName);
                
                image_url = publicUrl;
            } catch (err) {
                console.warn('Gagal upload gambar, menggunakan url default:', err.message);
            }
        }

        // Get content from Quill Rich Text Editor (HTML format)
        const content = quill ? quill.root.innerHTML : '';
        
        // Verify if author_id is a valid UUID, otherwise pass null or omit it
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const authorId = (currentUser && currentUser.id && uuidRegex.test(currentUser.id)) ? currentUser.id : null;

        // Excerpt is generated automatically on render, so we send null or empty
        const insertData = { 
            title, 
            category, 
            image_url, 
            excerpt: '', 
            content
        };
        if (authorId) {
            insertData.author_id = authorId;
        }

        const { error } = await supabase.from('news').insert([insertData]);
        if (error) {
            alert('Gagal menyimpan ke Database: ' + error.message);
        } else {
            addNewsForm.reset();
            if (quill) quill.setContents([]); // Clear Quill editor
            const modalInstance = Modal.getInstance(document.getElementById('addNewsModal'));
            if (modalInstance) modalInstance.hide();
            loadNews();
        }
    });
}

window.deleteNews = async (entry) => {
    if (!entry) return;
    showCustomConfirm('Hapus Berita', 'Apakah Anda yakin ingin menghapus berita ini secara permanen?', async () => {
        const isLocal = String(entry.id).startsWith('local-');
        if (isLocal) {
            try {
                let localNews = JSON.parse(localStorage.getItem('sis_gowa_local_news') || '[]');
                localNews = localNews.filter(item => String(item.id) !== String(entry.id));
                localStorage.setItem('sis_gowa_local_news', JSON.stringify(localNews));
            } catch (e) {}
        } else {
            try { await supabase.from('news').delete().eq('id', entry.id); } catch (e) {}
        }
        loadNews();
    });
};

// TEACHERS CRUD
async function loadTeachers() {
    if (!teachersTableBody) return;
    teachersTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-4">Memuat data...</td></tr>';
    
    try {
        const fetchPromise = (async () => {
            const { data, error } = await supabase.from('teachers').select('*').order('name', { ascending: true });
            if (error) throw error;
            return data || [];
        })();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([]), 1500));
        const data = await Promise.race([fetchPromise, timeoutPromise]);

        teachersTableBody.innerHTML = (data.length === 0) ? '<tr><td colspan="3" class="text-center py-4 text-muted">Belum ada data guru.</td></tr>' : data.map((teacher, index) => `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <img src="${teacher.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400'}" class="rounded-circle me-3" width="40" height="40" style="object-fit: cover;">
                        <div class="fw-bold text-dark">${teacher.name}</div>
                    </div>
                </td>
                <td>${teacher.position}</td>
                <td class="text-center pe-4">
                    <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3 btn-delete-teacher" data-id="${teacher.id}" data-index="${index}">
                        <i class="bi bi-trash me-1"></i>Hapus
                    </button>
                </td>
            </tr>
        `).join('');

        // Store globally for listener access
        window._teacherEntries = data;

        // Attach event listeners
        teachersTableBody.querySelectorAll('.btn-delete-teacher').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                window.deleteTeacher(id);
            });
        });
    } catch (err) {
        teachersTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-muted">Belum ada data guru.</td></tr>`;
    }
}

if (addTeacherForm) {
    addTeacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('teacher-name').value;
        const position = document.getElementById('teacher-position').value;
        const photo_url = document.getElementById('teacher-photo').value || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400';
        const { error } = await supabase.from('teachers').insert([{ name, position, photo_url }]);
        if (error) alert('Gagal: ' + error.message);
        else {
            addTeacherForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addTeacherModal')).hide();
            loadTeachers();
        }
    });
}

window.deleteTeacher = async (id) => {
    showCustomConfirm('Hapus Data Guru', 'Apakah Anda yakin ingin menghapus data guru ini?', async () => {
        try { await supabase.from('teachers').delete().eq('id', id); } catch (e) {}
        loadTeachers();
    });
};

// GALLERY CRUD
async function loadGallery() {
    if (!galleryTableBody) return;
    galleryTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Memuat data...</td></tr>';
    
    try {
        const fetchPromise = (async () => {
            const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        })();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([]), 1500));
        const data = await Promise.race([fetchPromise, timeoutPromise]);

        galleryTableBody.innerHTML = (data.length === 0) ? '<tr><td colspan="4" class="text-center py-4 text-muted">Belum ada foto galeri.</td></tr>' : data.map((item, index) => `
            <tr>
                <td class="ps-4">
                    <img src="${item.image_url}" class="rounded-3" width="60" height="40" style="object-fit: cover;">
                </td>
                <td><div class="fw-bold text-dark">${item.title || 'Tanpa Judul'}</div></td>
                <td><span class="badge bg-primary-light bg-opacity-10 text-primary">${item.category}</span></td>
                <td class="text-center pe-4">
                    <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3 btn-delete-gallery" data-id="${item.id}" data-index="${index}">
                        <i class="bi bi-trash me-1"></i>Hapus
                    </button>
                </td>
            </tr>
        `).join('');

        // Store globally for listener access
        window._galleryEntries = data;

        // Attach event listeners
        galleryTableBody.querySelectorAll('.btn-delete-gallery').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                window.deleteGallery(id);
            });
        });
    } catch (err) {
        galleryTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">Belum ada foto galeri.</td></tr>`;
    }
}

if (addGalleryForm) {
    addGalleryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('gallery-title').value;
        const category = document.getElementById('gallery-category').value;
        const image_url = document.getElementById('gallery-image').value;
        const { error } = await supabase.from('gallery').insert([{ title, category, image_url }]);
        if (error) alert('Gagal: ' + error.message);
        else {
            addGalleryForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addGalleryModal')).hide();
            loadGallery();
        }
    });
}

window.deleteGallery = async (id) => {
    showCustomConfirm('Hapus Foto Galeri', 'Apakah Anda yakin ingin menghapus foto ini dari galeri?', async () => {
        try { await supabase.from('gallery').delete().eq('id', id); } catch (e) {}
        loadGallery();
    });
};

// GUESTBOOK CRUD (Combines Database + Local Storage Fallback)
let hasGuestbookListeners = false;

async function loadGuestbook() {
    if (!guestbookTableBody) return;
    guestbookTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Memuat data...</td></tr>';
    
    let dbData = [];
    try {
        const fetchPromise = (async () => {
            const { data, error } = await supabase.from('buku_tamu').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        })();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
        const result = await Promise.race([fetchPromise, timeoutPromise]);
        if (result) dbData = result;
    } catch (err) {
        console.warn('Supabase guestbook fetch warning:', err.message);
    }

    // Read LocalStorage Guestbook Submissions
    let localData = [];
    try {
        localData = JSON.parse(localStorage.getItem('sis_gowa_buku_tamu') || '[]');
    } catch (e) {}

    // Combine & deduplicate by ID or signature
    const combinedMap = new Map();
    [...localData, ...dbData].forEach(item => {
        if (item && item.fullname) {
            const key = item.id || `${item.fullname}-${item.visit_date}-${item.visit_time}`;
            if (!combinedMap.has(key)) combinedMap.set(key, item);
        }
    });

    let allGuestEntries = Array.from(combinedMap.values());

    // Sort by created_at or fallback date logic (newest first)
    allGuestEntries.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
    });

    // Date Range Filters
    const startDateInput = document.getElementById('filter-start-date');
    const endDateInput = document.getElementById('filter-end-date');
    const startDateVal = startDateInput ? startDateInput.value : '';
    const endDateVal = endDateInput ? endDateInput.value : '';

    if (startDateVal || endDateVal) {
        allGuestEntries = allGuestEntries.filter(entry => {
            if (!entry.created_at) return true; // Keep entries without timestamp just in case
            const entryDate = new Date(entry.created_at);
            
            // Set time boundaries
            if (startDateVal) {
                const start = new Date(startDateVal);
                start.setHours(0, 0, 0, 0);
                if (entryDate < start) return false;
            }
            if (endDateVal) {
                const end = new Date(endDateVal);
                end.setHours(23, 59, 59, 999);
                if (entryDate > end) return false;
            }
            return true;
        });
    }

    if (allGuestEntries.length === 0) {
        guestbookTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Tidak ada data kunjungan tamu dalam rentang tanggal ini.</td></tr>';
        return;
    }

    // Store entries globally for modal access
    window._guestEntries = allGuestEntries;

    guestbookTableBody.innerHTML = allGuestEntries.map((item, index) => `
        <tr>
            <td class="ps-4">
                <div class="fw-bold small">${item.visit_date || 'Terbaru'}</div>
                <div class="text-muted x-small">${item.visit_time || ''}</div>
            </td>
            <td>
                <div class="fw-bold small">${item.fullname || '-'}</div>
                <div class="text-muted x-small"><i class="bi bi-telephone-fill me-1"></i>${item.phone || '-'}</div>
            </td>
            <td class="small">${item.institution || '-'}</td>
            <td class="small text-muted">${item.purpose ? item.purpose.substring(0, 45) + (item.purpose.length > 45 ? '…' : '') : '-'}</td>
            <td class="text-center pe-3">
                <div class="d-flex gap-2 justify-content-center flex-wrap">
                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 btn-view-guest" data-index="${index}">
                        <i class="bi bi-eye me-1"></i>Lihat
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3 btn-delete-guest" data-id="${item.id}" data-index="${index}">
                        <i class="bi bi-trash me-1"></i>Hapus
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Attach event listeners (avoid inline onclick — prevents HTML injection issues)
    guestbookTableBody.querySelectorAll('.btn-view-guest').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index'));
            openGuestDetailModal(window._guestEntries[idx]);
        });
    });

    guestbookTableBody.querySelectorAll('.btn-delete-guest').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idx = parseInt(btn.getAttribute('data-index'));
            const entry = window._guestEntries[idx];
            showCustomConfirm('Hapus Buku Tamu', `Apakah Anda yakin ingin menghapus data kunjungan dari "${entry?.fullname || 'Tamu'}"?`, async () => {
                await doDeleteGuestbook(entry);
            });
        });
    });

    // Setup filter/export event listeners once
    if (!hasGuestbookListeners) {
        hasGuestbookListeners = true;
        if (startDateInput) startDateInput.addEventListener('change', loadGuestbook);
        if (endDateInput) endDateInput.addEventListener('change', loadGuestbook);

        const exportBtn = document.getElementById('btn-export-guestbook');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportGuestbookToCSV(window._guestEntries);
            });
        }
    }
}

// Function to export guestbook to CSV
function exportGuestbookToCSV(entries) {
    if (!entries || entries.length === 0) {
        alert('Tidak ada data kunjungan tamu untuk didownload.');
        return;
    }

    // CSV Headers
    const headers = ['Tanggal Kunjungan', 'Jam Kunjungan', 'Nama Lengkap', 'Nomor Telepon', 'Instansi', 'Alamat', 'Menemui', 'Maksud Kedatangan', 'Kesan & Pesan'];
    
    // Convert entries to CSV rows
    const rows = entries.map(item => [
        item.visit_date || '',
        item.visit_time || '',
        item.fullname || '',
        item.phone || '',
        item.institution || '',
        item.address || '',
        item.meet_who || '',
        item.purpose || '',
        item.impression || ''
    ]);

    // Construct CSV content (using semicolon separator for Excel/system compatibility in ID locale)
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(val => {
            // Escape double quotes
            const cleanVal = String(val).replace(/"/g, '""');
            return `"${cleanVal}"`;
        }).join(','))
    ].join('\n');

    // Create Download Trigger
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateStr = new Date().toISOString().slice(0,10);
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-buku-tamu-smkn5gowa-${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function doDeleteGuestbook(entry) {
    if (!entry) return;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isSupabaseId = entry.id && uuidRegex.test(String(entry.id));

    // 1. Delete from Supabase only if it has a real UUID
    if (isSupabaseId) {
        try {
            const { error } = await supabase.from('buku_tamu').delete().eq('id', entry.id);
            if (error) console.warn('Supabase delete error:', error.message);
        } catch (e) {
            console.warn('Supabase delete exception:', e);
        }
    } else {
        // Not a UUID — try matching by fullname + date + time in Supabase
        try {
            await supabase.from('buku_tamu')
                .delete()
                .eq('fullname', entry.fullname)
                .eq('visit_date', entry.visit_date)
                .eq('visit_time', entry.visit_time);
        } catch (e) {}
    }

    // 2. Always clean up localStorage by signature key
    try {
        let localData = JSON.parse(localStorage.getItem('sis_gowa_buku_tamu') || '[]');
        const sigKey = `${entry.fullname}||${entry.visit_date}||${entry.visit_time}`;
        localData = localData.filter(item => {
            const itemKey = `${item.fullname}||${item.visit_date}||${item.visit_time}`;
            return itemKey !== sigKey;
        });
        localStorage.setItem('sis_gowa_buku_tamu', JSON.stringify(localData));
    } catch (e) {}

    // 3. Close detail modal if open
    try {
        const existingModal = Modal.getInstance(document.getElementById('guestbookDetailModal'));
        if (existingModal) existingModal.hide();
    } catch (e) {}

    // 4. Reload table
    loadGuestbook();
}

function openGuestDetailModal(item) {
    if (!item) return;

    document.getElementById('detail-fullname').textContent = item.fullname || '-';
    document.getElementById('detail-phone').textContent = item.phone ? '📞 ' + item.phone : '-';
    document.getElementById('detail-date').textContent = item.visit_date || '-';
    document.getElementById('detail-time').textContent = item.visit_time || '-';
    document.getElementById('detail-institution').textContent = item.institution || '-';
    document.getElementById('detail-address').textContent = item.address || '-';
    document.getElementById('detail-meet-who').textContent = item.meet_who || '-';
    document.getElementById('detail-purpose').textContent = item.purpose || '-';

    const impressionWrapper = document.getElementById('detail-impression-wrapper');
    if (item.impression) {
        document.getElementById('detail-impression').textContent = item.impression;
        impressionWrapper.classList.remove('d-none');
    } else {
        impressionWrapper.classList.add('d-none');
    }

    // Wire delete button inside modal — pass full entry object
    const deleteBtn = document.getElementById('detail-delete-btn');
    if (deleteBtn) {
        deleteBtn.onclick = async () => {
            showCustomConfirm('Hapus Buku Tamu', `Apakah Anda yakin ingin menghapus data kunjungan dari "${item.fullname || 'Tamu'}"?`, async () => {
                await doDeleteGuestbook(item);
            });
        };
    }

    // Destroy previous instance first to avoid duplicate
    const existingModal = Modal.getInstance(document.getElementById('guestbookDetailModal'));
    if (existingModal) existingModal.dispose();
    new Modal(document.getElementById('guestbookDetailModal')).show();
}

// Custom Confirmation Modal Helper
function showCustomConfirm(title, body, onConfirm) {
    const modalEl = document.getElementById('customConfirmModal');
    if (!modalEl) {
        // Fallback to native if modal structure is missing
        if (confirm(body)) onConfirm();
        return;
    }
    
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-body').textContent = body;
    
    const cancelBtn = document.getElementById('confirm-modal-cancel');
    const submitBtn = document.getElementById('confirm-modal-submit');
    
    // Clear old event listeners by cloning
    const newCancel = cancelBtn.cloneNode(true);
    const newSubmit = submitBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
    submitBtn.parentNode.replaceChild(newSubmit, submitBtn);
    
    newCancel.addEventListener('click', () => {
        modalEl.classList.add('d-none');
    });
    
    newSubmit.addEventListener('click', async () => {
        modalEl.classList.add('d-none');
        await onConfirm();
    });
    
    modalEl.classList.remove('d-none');
}

// Declare global variable for Quill editor
let quill = null;

// Add News Modal Category & Image Tab Switch Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quill Editor
    const quillContainer = document.getElementById('quill-editor');
    if (quillContainer) {
        quill = new Quill('#quill-editor', {
            theme: 'snow',
            placeholder: 'Tulis isi berita di sini...',
            modules: {
                toolbar: [
                    [{ 'font': [] }, { 'size': [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'clean']
                ]
            }
        });
    }

    // 1. Add Category Toggle & Save
    const btnAddCategoryToggle = document.getElementById('btn-add-category-toggle');
    const newCategoryWrapper = document.getElementById('new-category-wrapper');
    const btnSaveNewCategory = document.getElementById('btn-save-new-category');
    const newCategoryInput = document.getElementById('new-category-input');
    const newsCategorySelect = document.getElementById('news-category');

    if (btnAddCategoryToggle && newCategoryWrapper) {
        btnAddCategoryToggle.addEventListener('click', () => {
            newCategoryWrapper.classList.toggle('d-none');
            if (newCategoryInput) newCategoryInput.value = '';
        });
    }

    if (btnSaveNewCategory && newCategoryInput && newsCategorySelect) {
        btnSaveNewCategory.addEventListener('click', () => {
            const val = newCategoryInput.value.trim();
            if (val) {
                // Check if already exists
                let exists = false;
                for (let i = 0; i < newsCategorySelect.options.length; i++) {
                    if (newsCategorySelect.options[i].value.toLowerCase() === val.toLowerCase()) {
                        exists = true;
                        newsCategorySelect.selectedIndex = i;
                        break;
                    }
                }
                if (!exists) {
                    const newOpt = document.createElement('option');
                    newOpt.value = val;
                    newOpt.textContent = val;
                    newsCategorySelect.appendChild(newOpt);
                    newsCategorySelect.value = val;
                }
                newCategoryWrapper.classList.add('d-none');
                newCategoryInput.value = '';
            }
        });
    }

    // 2. Image Tab Switching
    const tabImageUrl = document.getElementById('tab-image-url');
    const tabImageFile = document.getElementById('tab-image-file');
    const wrapperImageUrl = document.getElementById('wrapper-image-url');
    const wrapperImageFile = document.getElementById('wrapper-image-file');
    const newsImageUrlInput = document.getElementById('news-image-url');
    const newsImageFileInput = document.getElementById('news-image-file');

    if (tabImageUrl && tabImageFile && wrapperImageUrl && wrapperImageFile) {
        tabImageUrl.addEventListener('click', (e) => {
            e.preventDefault();
            tabImageUrl.classList.add('active');
            tabImageFile.classList.remove('active');
            wrapperImageUrl.classList.remove('d-none');
            wrapperImageFile.classList.add('d-none');
            if (newsImageFileInput) newsImageFileInput.value = ''; // clear file
        });

        tabImageFile.addEventListener('click', (e) => {
            e.preventDefault();
            tabImageFile.classList.add('active');
            tabImageUrl.classList.remove('active');
            wrapperImageFile.classList.remove('d-none');
            wrapperImageUrl.classList.add('d-none');
            if (newsImageUrlInput) newsImageUrlInput.value = ''; // clear url input
        });
    }
});

// Initial Check
checkUser();
