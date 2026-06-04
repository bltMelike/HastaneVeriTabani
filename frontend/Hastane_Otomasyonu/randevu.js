const API_BASE = 'http://localhost:5000';
const calismaSaatleri = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('JSON yerine farklı cevap geldi:', text.slice(0, 300));
        throw new Error('Sunucu JSON yerine HTML döndürdü. API route adresini ve server.js çalışmasını kontrol edin.');
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || `Sunucu hatası: ${response.status}`);
    }

    return data;
}

async function doktorlariVeritabanindanCek(poliklinikId) {
    const doktorSelect = document.getElementById('doktor');

    if (!poliklinikId) {
        doktorSelect.innerHTML = '<option value="" disabled selected>Önce poliklinik seçiniz</option>';
        doktorSelect.disabled = true;
        return;
    }

    try {
        const doktorlar = await fetchJson(`${API_BASE}/api/poliklinik-doktorlari?poliklinikId=${encodeURIComponent(poliklinikId)}`);
        doktorSelect.innerHTML = '';

        if (!Array.isArray(doktorlar) || doktorlar.length === 0) {
            doktorSelect.innerHTML = '<option value="" disabled selected>Bu poliklinikte aktif doktor bulunmamaktadır.</option>';
            doktorSelect.disabled = true;
            return;
        }

        doktorSelect.innerHTML = '<option value="" disabled selected>Doktor seçiniz</option>';
        doktorlar.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.personelID;
            option.textContent = `Dr. ${doc.Ad || ''} ${doc.Soyad || ''}`.trim();
            doktorSelect.appendChild(option);
        });
        doktorSelect.disabled = false;
    } catch (err) {
        console.error('Doktor yükleme hatası:', err);
        doktorSelect.innerHTML = `<option value="" disabled selected>${err.message}</option>`;
        doktorSelect.disabled = true;
    }
}

async function saatleriVeDurumlariListele(doktorId, tarih) {
    const saatKutusu = document.getElementById('saatButonlariKutusu');
    const gizliSaatInput = document.getElementById('randevuSaati');

    saatKutusu.innerHTML = '<span class="text-muted small">Saatler kontrol ediliyor...</span>';
    gizliSaatInput.value = '';

    try {
        const doluSaatler = await fetchJson(`${API_BASE}/api/dolu-saatler?doktorId=${encodeURIComponent(doktorId)}&tarih=${encodeURIComponent(tarih)}`);
        saatKutusu.innerHTML = '';

        calismaSaatleri.forEach(saat => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn m-1 saat-secim-btn';
            btn.textContent = saat;

            if (Array.isArray(doluSaatler) && doluSaatler.includes(saat)) {
                btn.classList.add('btn-danger');
                btn.disabled = true;
                btn.title = 'Bu saat dolu';
            } else {
                btn.classList.add('btn-outline-success');
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.saat-secim-btn').forEach(button => {
                        if (!button.disabled) {
                            button.classList.remove('btn-success');
                            button.classList.add('btn-outline-success');
                        }
                    });
                    btn.classList.remove('btn-outline-success');
                    btn.classList.add('btn-success');
                    gizliSaatInput.value = saat;
                });
            }

            saatKutusu.appendChild(btn);
        });
    } catch (err) {
        console.error('Saat yükleme hatası:', err);
        saatKutusu.innerHTML = `<span class="text-danger small">${err.message}</span>`;
    }
}

async function veritabaninaRandevuKaydet() {
    const doktorId = document.getElementById('doktor').value;
    const randevuTarih = document.getElementById('randevuTarihi').value;
    const randevuSaat = document.getElementById('randevuSaati').value;
    const hastaId = sessionStorage.getItem('hastaID');

    if (!hastaId) {
        alert('Hasta oturumu bulunamadı. Lütfen tekrar giriş yapın.');
        window.location.href = 'hastaGirisiSifre.html';
        return;
    }

    if (!doktorId || !randevuTarih || !randevuSaat) {
        alert('Lütfen tüm seçimleri eksiksiz yapın.');
        return;
    }

    try {
        const data = await fetchJson(`${API_BASE}/api/randevu-olustur`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ randevuTarih, randevuSaat, doktorId, hastaId })
        });

        alert(data.message || 'Randevunuz başarıyla oluşturuldu.');
        document.getElementById('randevuFormu').reset();
        document.getElementById('doktor').disabled = true;
        document.getElementById('randevuTarihi').disabled = true;
        document.getElementById('saatButonlariKutusu').innerHTML = '<span class="text-muted small">Önce tarih seçiniz...</span>';
        document.getElementById('randevuSaati').value = '';
    } catch (err) {
        console.error('Randevu kayıt hatası:', err);
        alert(err.message || 'Randevu kaydedilirken hata oluştu.');
    }
}

