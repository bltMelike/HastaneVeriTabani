document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('aktifHastaID');
    localStorage.removeItem('aktifDoktorID');

    const suAnkiSayfa = window.location.pathname.split('/').pop();
    const girisSayfalari = [
        'hastaGirisiSifre.html',
        'doktorGirisiSifre.html',
        'hemsireGirisiSifre.html',
        'memurGirisiSifre.html',
        'kayit.html'
    ];

    if (!girisSayfalari.includes(suAnkiSayfa)) return;

    const aktifHasta = sessionStorage.getItem('hastaID');
    const aktifDoktor = sessionStorage.getItem('doktorID');
    const aktifMemur = sessionStorage.getItem('aktifMemurID');
    const aktifHemsire = sessionStorage.getItem('aktifHemsireID');

    if (aktifHasta) {
        alert('Sistemde aktif bir hasta oturumu açık. Yeni giriş yapmadan önce çıkış yapmalısınız.');
        window.location.href = 'hastaGirisi.html';
        return;
    }

    if (aktifDoktor) {
        alert('Sistemde aktif bir doktor oturumu açık. Yeni giriş yapmadan önce çıkış yapmalısınız.');
        window.location.href = 'doktorGirisi.html';
        return;
    }

    if (aktifMemur) {
        alert('Sistemde aktif bir memur oturumu açık. Yeni giriş yapmadan önce çıkış yapmalısınız.');
        window.location.href = 'memurGirisi.html';
        return;
    }

    if (aktifHemsire) {
        alert('Sistemde aktif bir hemşire oturumu açık. Yeni giriş yapmadan önce çıkış yapmalısınız.');
        window.location.href = 'hemsireGirisi.html';
    }
});
