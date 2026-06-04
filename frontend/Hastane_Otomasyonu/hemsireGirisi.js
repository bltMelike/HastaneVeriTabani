const API_BASE = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
    const hemsireID = sessionStorage.getItem('aktifHemsireID');
    const personelTuruID = sessionStorage.getItem('personelTuruID');
    const listeBody = document.getElementById('hemsire-tahlil-listesi');
    const yenileButton = document.getElementById('tahlil-yenile-btn');

    if (!hemsireID || String(personelTuruID) !== '2') {
        sessionStorage.removeItem('aktifHemsireID');
        sessionStorage.removeItem('aktifHemsirePoliklinikID');
        sessionStorage.removeItem('personelTuruID');
        sessionStorage.removeItem('personelRol');
        alert('Hemşire oturumu bulunamadı. Lütfen tekrar giriş yapın.');
        window.location.href = 'hemsireGirisiSifre.html';
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

    async function tahlilleriYukle() {
        listeBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Tahliller yükleniyor...</td></tr>';

        try {
            const tahliller = await fetchJson(`${API_BASE}/api/hemsire/tahliller?hemsireId=${encodeURIComponent(hemsireID)}`);
            listeBody.innerHTML = '';

            if (!Array.isArray(tahliller) || tahliller.length === 0) {
                listeBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Polikliniğinizde bekleyen veya sonuçlanmış tahlil bulunmuyor.</td></tr>';
                return;
            }

            tahliller.forEach(tahlil => {
                const durum = tahlil.Durum || 'Bekleniyor';
                const sonuc = tahlil.TahlilSonucu || '';
                const sonucDisabled = durum === 'Sonuçlandı' ? 'disabled' : '';
                const badgeClass = durum === 'Sonuçlandı' ? 'bg-success' : 'bg-warning text-dark';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${tahlil.HastaAdSoyad || 'Belirtilmemiş'}</strong><br><small class="text-muted">TC: ${tahlil.hastaTC || '-'}</small></td>
                    <td>${tahlil.tahlilTuru || '-'}</td>
                    <td>${tahlil.IstemeNedeni || '-'}</td>
                    <td>Dr. ${tahlil.DoktorAdSoyad || '-'}</td>
                    <td><span class="badge ${badgeClass}">${durum}</span></td>
                    <td><input type="text" class="form-control form-control-sm" value="${sonuc}" placeholder="Sonuç giriniz" ${sonucDisabled}></td>
                    <td></td>
                `;

                const input = tr.querySelector('input');
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-sm btn-primary';
                button.textContent = durum === 'Sonuçlandı' ? 'Kaydedildi' : 'Kaydet';
                button.disabled = durum === 'Sonuçlandı';
                button.addEventListener('click', () => sonucKaydet(tahlil.tahlilID, input.value));
                tr.querySelector('td:last-child').appendChild(button);
                listeBody.appendChild(tr);
            });
        } catch (err) {
            console.error('Hemşire tahlil listesi hatası:', err);
            listeBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">${err.message}</td></tr>`;
        }
    }

    async function sonucKaydet(tahlilID, sonuc) {
        const temizSonuc = String(sonuc || '').trim();
        if (!temizSonuc) {
            alert('Lütfen tahlil sonucunu girin.');
            return;
        }

        try {
            const data = await fetchJson(`${API_BASE}/api/hemsire/tahliller/${encodeURIComponent(tahlilID)}/sonuc`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hemsireID, sonuc: temizSonuc })
            });
            alert(data.message || 'Tahlil sonucu kaydedildi.');
            await tahlilleriYukle();
        } catch (err) {
            console.error('Sonuç kaydetme hatası:', err);
            alert(err.message || 'Sonuç kaydedilemedi.');
        }
    }

    yenileButton?.addEventListener('click', tahlilleriYukle);
    tahlilleriYukle();
});
