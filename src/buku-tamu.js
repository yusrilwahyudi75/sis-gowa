import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import './components/layout.js';
import { supabase } from './lib/supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-fill Tanggal & Jam
    const visitDateInput = document.getElementById('visit_date');
    const visitTimeInput = document.getElementById('visit_time');
    
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (visitDateInput) visitDateInput.value = now.toLocaleDateString('id-ID', dateOptions);
    
    // Update time every minute
    const updateTime = () => {
        const currentTime = new Date();
        if (visitTimeInput) visitTimeInput.value = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 60000);

    // 2. Captcha Logic
    const captchaQuestionEl = document.getElementById('captcha-question');
    const captchaAnswerInput = document.getElementById('captcha-answer');
    const captchaErrorEl = document.getElementById('captcha-error');
    
    let expectedAnswer = 0;

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        expectedAnswer = num1 + num2;
        if (captchaQuestionEl) captchaQuestionEl.textContent = `${num1} + ${num2} = ?`;
        if (captchaAnswerInput) captchaAnswerInput.value = '';
        if (captchaErrorEl) captchaErrorEl.classList.add('d-none');
    };

    generateCaptcha();

    // 3. Form Submission
    const form = document.getElementById('guestbook-form');
    const submitBtn = document.getElementById('submit-btn');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const formError = document.getElementById('form-error');

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.add('d-none');
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide previous messages
            if (formError) formError.classList.add('d-none');
            if (captchaErrorEl) captchaErrorEl.classList.add('d-none');

            // Validate Captcha
            const userAnswer = parseInt(captchaAnswerInput.value);
            if (userAnswer !== expectedAnswer) {
                if (captchaErrorEl) captchaErrorEl.classList.remove('d-none');
                generateCaptcha(); // Regenerate on fail
                return;
            }

            // Disable button to prevent double submit
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Mengirim...';
            submitBtn.disabled = true;

            // Gather Data
            const formData = {
                id: Date.now(),
                created_at: new Date().toISOString(),
                visit_date: visitDateInput ? visitDateInput.value : new Date().toLocaleDateString('id-ID'),
                visit_time: visitTimeInput ? visitTimeInput.value : new Date().toLocaleTimeString('id-ID'),
                fullname: document.getElementById('fullname').value,
                phone: document.getElementById('phone').value,
                institution: document.getElementById('institution').value,
                address: document.getElementById('address').value,
                meet_who: document.getElementById('meet_who').value,
                purpose: document.getElementById('purpose').value,
                impression: document.getElementById('impression').value || null
            };

            // LocalStorage Save Utility (Offline & Lock Fallback)
            const saveToLocalStorage = (data) => {
                try {
                    const localEntries = JSON.parse(localStorage.getItem('sis_gowa_buku_tamu') || '[]');
                    localEntries.unshift(data);
                    localStorage.setItem('sis_gowa_buku_tamu', JSON.stringify(localEntries));
                } catch (err) {
                    console.warn('LocalStorage save warning:', err);
                }
            };

            try {
                // Attempt Supabase Insert with 2s Timeout Fallback
                const supabasePromise = (async () => {
                    const { error } = await supabase
                        .from('buku_tamu')
                        .insert([{
                            visit_date: formData.visit_date,
                            visit_time: formData.visit_time,
                            fullname: formData.fullname,
                            phone: formData.phone,
                            institution: formData.institution,
                            address: formData.address,
                            meet_who: formData.meet_who,
                            purpose: formData.purpose,
                            impression: formData.impression
                        }]);
                    if (error) throw error;
                    return true;
                })();

                const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(false), 1500));
                
                const dbSuccess = await Promise.race([supabasePromise, timeoutPromise]);
                
                // Always save locally as fallback/cache
                saveToLocalStorage(formData);

                // Show Success Modal
                if (successModal) successModal.classList.remove('d-none');
                form.reset();
                updateTime();
                if (visitDateInput) visitDateInput.value = now.toLocaleDateString('id-ID', dateOptions);
                generateCaptcha();

            } catch (error) {
                console.warn('Supabase insert warning, using local fallback:', error.message);
                // Save to local storage on error so user submission is never lost
                saveToLocalStorage(formData);
                
                if (successModal) successModal.classList.remove('d-none');
                form.reset();
                updateTime();
                if (visitDateInput) visitDateInput.value = now.toLocaleDateString('id-ID', dateOptions);
                generateCaptcha();
            } finally {
                // Re-enable button
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});
