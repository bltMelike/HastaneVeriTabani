function eskiLocalStorageOturumlariniTemizle() {
    localStorage.removeItem('hastaID');
    localStorage.removeItem('aktifHastaID');
    localStorage.removeItem('doktorID');
    localStorage.removeItem('aktifDoktorID');
    localStorage.removeItem('personelID');
    localStorage.removeItem('aktifHemsireID');
    localStorage.removeItem('aktifMemurID');
}

function tumOturumlariTemizle() {
    sessionStorage.clear();
    eskiLocalStorageOturumlariniTemizle();
}

function cikisYap(mesaj = 'Oturum güvenli bir şekilde kapatıldı.') {
    tumOturumlariTemizle();
    alert(mesaj);
    window.location.href = 'anasayfa.html';
}

// Oturum bilgileri sadece sessionStorage içinde tutulur.
// Sekme veya tarayıcı kapandığında sessionStorage tarayıcı tarafından otomatik temizlenir.
eskiLocalStorageOturumlariniTemizle();

window.tumOturumlariTemizle = tumOturumlariTemizle;
window.cikisYap = cikisYap;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnCikisYap')?.addEventListener('click', () => cikisYap());
});
