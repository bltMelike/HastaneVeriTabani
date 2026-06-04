const API_BASE = 'http://localhost:5000';

let globalAktifHastalar = [];
let aktifDoktorID = null;

function doktorOturumunuDogrula() {
    const doktorID = sessionStorage.getItem('doktorID') || sessionStorage.getItem('personelID');
    const personelTuruID = sessionStorage.getItem('personelTuruID');

    if (!doktorID || String(personelTuruID) !== '1') {
        sessionStorage.removeItem('doktorID');
        sessionStorage.removeItem('personelID');
        sessionStorage.removeItem('personelTuruID');
        sessionStorage.removeItem('personelRol');
        alert('Bu sayfaya erişmek için doktor girişi yapmalısınız.');
        window.location.replace('doktorGirisiSifre.html');
        return null;
    }

    return doktorID;
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

function hastaSecenekleriniDoldur(selectElement) {
    selectElement.innerHTML = '<option value="">-- Bir hasta seçiniz --</option>';

    if (!globalAktifHastalar.length) {
        selectElement.innerHTML = '<option value="">Bekleyen aktif hastanız bulunmuyor.</option>';
        return;
    }

    globalAktifHastalar.forEach(hasta => {
        const option = document.createElement('option');
        option.value = hasta.hastaID;
        option.textContent = `${hasta.hastaAd || ''} ${hasta.hastaSoyad || ''}`.trim();
        selectElement.appendChild(option);
    });
}

async function yukleAktifHastalar() {
    const listeDiv = document.getElementById('aktif-hasta-listesi');
    if (!aktifDoktorID) return;

    listeDiv.innerHTML = '<div class="alert alert-info">Hastalar yükleniyor...</div>';

    try {
        const data = await fetchJson(`${API_BASE}/api/aktif-hastalar?doktorId=${encodeURIComponent(aktifDoktorID)}`);
        globalAktifHastalar = Array.isArray(data) ? data : [];

        if (!globalAktifHastalar.length) {
            listeDiv.innerHTML = '<div class="alert alert-info">Bekleyen muayene/randevu kaydı bulunmamaktadır.</div>';
            return;
        }

        let html = `
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Saat</th>
                        <th>Hasta Adı Soyadı</th>
                        <th>Durum</th>
                        <th class="text-end">İşlem</th>
                    </tr>
                </thead>
                <tbody>
        `;

        globalAktifHastalar.forEach(hasta => {
            html += `
                <tr>
                    <td><span class="badge bg-secondary">${hasta.randevuSaat || '-'}</span></td>
                    <td><strong>${hasta.hastaAd || ''} ${hasta.hastaSoyad || ''}</strong></td>
                    <td><span class="badge bg-warning text-dark">Muayene Bekliyor</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-success" onclick="muayeneEt(${hasta.hastaID})">Muayene Et</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        listeDiv.innerHTML = html;
    } catch (err) {
        console.error('Aktif hasta yükleme hatası:', err);
        listeDiv.innerHTML = `<div class="alert alert-danger">${err.message || 'Aktif hastalar alınamadı.'}</div>`;
    }
}

async function tahlilFormunuHazirla() {
    if (!globalAktifHastalar.length) {
        await yukleAktifHastalar();
    }
    hastaSecenekleriniDoldur(document.getElementById('tahlil-hasta-secimi'));
}

async function receteFormunuHazirla() {
    if (!globalAktifHastalar.length) {
        await yukleAktifHastalar();
    }
    hastaSecenekleriniDoldur(document.getElementById('recete-hasta-secimi'));
}

async function tahlilIste() {
    const hastaID = document.getElementById('tahlil-hasta-secimi').value;
    const tahlilTuru = document.getElementById('tahlil-turu').value.trim();
    const neden = document.getElementById('tahlil-neden').value.trim();

    if (!aktifDoktorID) return;
    if (!hastaID || !tahlilTuru) {
        alert('Lütfen tahlil istenecek hastayı ve tahlil türünü doldurun.');
        return;
    }

    try {
        const data = await fetchJson(`${API_BASE}/api/tahlil-iste`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tahlilTuru, neden, hastaID, personelID: aktifDoktorID })
        });

        alert(data.message || 'Tahlil talebi başarıyla gönderildi.');
        document.getElementById('tahlil-isteme-formu').reset();
    } catch (err) {
        console.error('Tahlil isteme hatası:', err);
        alert(err.message || 'Tahlil gönderilemedi.');
    }
}

async function yukleTahlilSonuclari() {
    const tahlilDiv = document.getElementById('tahlil-sonuc-listesi');
    if (!aktifDoktorID) return;

    tahlilDiv.innerHTML = '<div class="alert alert-info">Sonuçlar yükleniyor...</div>';

    try {
        const data = await fetchJson(`${API_BASE}/api/doktor-tahlil-sonuclari?doktorId=${encodeURIComponent(aktifDoktorID)}`);

        if (!Array.isArray(data) || !data.length) {
            tahlilDiv.innerHTML = '<div class="alert alert-info">Henüz laboratuvara gönderdiğiniz tahlil bulunmamaktadır.</div>';
            return;
        }

        let html = `
            <table class="table table-striped align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Hasta Bilgisi</th>
                        <th>Tahlil Adı</th>
                        <th>İsteme Gerekçesi</th>
                        <th>Durum</th>
                        <th>Sonuç</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(tahlil => {
            const durum = tahlil.Durum || (tahlil.TahlilSonucu ? 'Sonuçlandı' : 'Bekleniyor');
            const badgeClass = durum === 'Sonuçlandı' ? 'bg-success' : 'bg-warning text-dark';
            html += `
                <tr>
                    <td><strong>${tahlil.HastaAdSoyad || '-'}</strong><br><small class="text-muted">TC: ${tahlil.hastaTC || '-'}</small></td>
                    <td>${tahlil.tahlilTuru || '-'}</td>
                    <td>${tahlil.IstemeNedeni || '-'}</td>
                    <td><span class="badge ${badgeClass}">${durum}</span></td>
                    <td>${tahlil.TahlilSonucu || '-'}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        tahlilDiv.innerHTML = html;
    } catch (err) {
        console.error('Tahlil sonuçları yükleme hatası:', err);
        tahlilDiv.innerHTML = `<div class="alert alert-danger">${err.message || 'Tahlil sonuçları alınamadı.'}</div>`;
    }
}

async function muayeneEt(hastaId) {
    if (!hastaId) return;
    if (!confirm('Bu hastanın muayenesini tamamlamak istediğinize emin misiniz?')) return;

    try {
        const data = await fetchJson(`${API_BASE}/api/muayene-tamamla`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: hastaId })
        });

        alert(data.message || 'Muayene başarıyla tamamlandı.');
        await yukleAktifHastalar();
    } catch (err) {
        console.error('Muayene tamamlama hatası:', err);
        alert(err.message || 'Muayene tamamlanamadı.');
    }
}

async function receteYaz() {
    const hastaID = document.getElementById('recete-hasta-secimi').value;
    const ilacAdi = document.getElementById('recete-ilac-adi').value.trim();

    if (!aktifDoktorID) return;
    if (!hastaID || !ilacAdi) {
        alert('Lütfen reçete yazılacak hastayı ve ilaç adını doldurun.');
        return;
    }

    try {
        const data = await fetchJson(`${API_BASE}/api/recete-yaz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ilacAdi, hastaID, personelID: aktifDoktorID })
        });

        alert(data.message || 'Reçete başarıyla kaydedildi.');
        document.getElementById('recete-yazma-formu').reset();
    } catch (err) {
        console.error('Reçete yazma hatası:', err);
        alert(err.message || 'Reçete kaydedilemedi.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    aktifDoktorID = doktorOturumunuDogrula();
    if (!aktifDoktorID) return;
    yukleAktifHastalar();
});
