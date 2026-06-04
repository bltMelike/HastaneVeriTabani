const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', async () => {
    const hastaID = sessionStorage.getItem('hastaID');
    const randevuBody = document.getElementById('randevu-listesi');
    const tahlilBody = document.getElementById('tahlil-listesi');

    if (!hastaID) {
        alert('Hasta oturumu bulunamadı. Lütfen tekrar giriş yapın.');
        window.location.href = 'hastaGirisiSifre.html';
        return;
    }

    async function fetchJson(url, options = {}) {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
            throw new Error('Sunucu beklenen JSON cevabını döndürmedi.');
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || `Sunucu hatası: ${response.status}`);
        }
        return data;
    }

    async function randevulariYukle() {
        if (!randevuBody) return;

        try {
            const randevular = await fetchJson(`${API_BASE}/api/randevular?hastaID=${encodeURIComponent(hastaID)}`);
            randevuBody.innerHTML = '';

            if (!Array.isArray(randevular) || randevular.length === 0) {
                randevuBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Kayıtlı randevunuz bulunmamaktadır.</td></tr>';
                return;
            }

            randevular.forEach(randevu => {
                const randevuID = randevu.randevuID || randevu.RandevuID;
                const tarih = randevu.randevuTarih ? new Date(randevu.randevuTarih).toLocaleDateString('tr-TR') : '';
                const saat = randevu.randevuSaat || '';
                const doktor = randevu.doktor || randevu.DoktorAdSoyad || 'Belirtilmemiş';
                const poliklinik = randevu.poliklinikAdi || '';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>Dr. ${doktor}</strong><br><small class="text-muted">${poliklinik}</small></td>
                    <td>${tarih}</td>
                    <td>${saat}</td>
                    <td><span class="badge bg-info text-dark">Aktif</span></td>
                    <td></td>
                `;

                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-sm btn-outline-danger';
                button.textContent = 'Sil';
                button.disabled = !randevuID;
                button.addEventListener('click', () => randevuSil(randevuID));
                tr.querySelector('td:last-child').appendChild(button);
                randevuBody.appendChild(tr);
            });
        } catch (err) {
            console.error('Randevu yükleme hatası:', err);
            randevuBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${err.message}</td></tr>`;
        }
    }

    async function randevuSil(randevuID) {
        if (!randevuID) return;
        if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;

        try {
            await fetchJson(`${API_BASE}/api/randevular/${encodeURIComponent(randevuID)}?hastaID=${encodeURIComponent(hastaID)}`, { method: 'DELETE' });
            await randevulariYukle();
        } catch (err) {
            alert(err.message || 'Randevu silinemedi.');
        }
    }

    async function sonuclariYukle() {
        if (!tahlilBody) return;

        try {
            const sonuclar = await fetchJson(`${API_BASE}/api/sonuclar?hastaID=${encodeURIComponent(hastaID)}`);
            tahlilBody.innerHTML = '';

            if (!Array.isArray(sonuclar) || sonuclar.length === 0) {
                tahlilBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Açıklanmış veya bekleyen laboratuvar sonucunuz bulunmuyor.</td></tr>';
                return;
            }

            sonuclar.forEach(tahlil => {
                const durum = tahlil.Durum || tahlil.durum || (tahlil.TahlilSonucu ? 'Sonuçlandı' : 'Bekleniyor');
                const sonuc = tahlil.TahlilSonucu || tahlil.tahlilsonucu || '-';
                const badgeClass = durum === 'Sonuçlandı' ? 'bg-success' : 'bg-warning text-dark';

                tahlilBody.innerHTML += `
                    <tr>
                        <td><span class="badge bg-secondary">${tahlil.tahlilTuru || 'Belirtilmemiş'}</span></td>
                        <td>${tahlil.IstemeNedeni || 'Belirtilmemiş'}</td>
                        <td><span class="badge ${badgeClass}">${durum}</span></td>
                        <td><strong>${sonuc}</strong></td>
                        <td>Dr. ${tahlil.DoktorAdSoyad || 'Belirtilmemiş'}</td>
                    </tr>`;
            });
        } catch (err) {
            console.error('Tahlil yükleme hatası:', err);
            tahlilBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${err.message}</td></tr>`;
        }
    }

    await Promise.all([randevulariYukle(), sonuclariYukle()]);
});


