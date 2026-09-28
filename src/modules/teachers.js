import { supabase } from '../lib/supabase.js';

const fallbackTeachersData = [
    { id: 1, name: 'Drs. H. Ahmad, M.Pd.', position: 'Kepala Sekolah', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400' },
    { id: 2, name: 'Siti Rahma, S.Kom.', position: 'Guru TJKT', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400' },
    { id: 3, name: 'Andi Bachtiar, S.T.', position: 'Guru Teknik Otomotif', photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400' }
];

export async function fetchTeachers() {
    const fetchPromise = (async () => {
        const { data, error } = await supabase
            .from('teachers')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        return (data && data.length > 0) ? data : fallbackTeachersData;
    })();

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(fallbackTeachersData), 500));

    try {
        return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return fallbackTeachersData;
    }
}

export function renderTeachers(teachers, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (teachers.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5 text-muted">Belum ada data guru.</div>';
        return;
    }

    container.innerHTML = teachers.map(teacher => `
        <div class="col-md-4 col-lg-3">
            <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden text-center transition-hover pb-3">
                <div class="bg-primary bg-opacity-10 py-4 mb-3 d-flex justify-content-center">
                    <img src="${teacher.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400'}" class="rounded-circle shadow border border-3 border-white" style="width: 120px; height: 120px; object-fit: cover;" alt="${teacher.name}">
                </div>
                <h5 class="fw-bold text-dark px-2 mb-1">${teacher.name}</h5>
                <p class="text-primary small fw-semibold px-2">${teacher.position}</p>
            </div>
        </div>
    `).join('');
}
