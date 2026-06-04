const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend', 'Hastane_Otomasyonu')));

const dbConfig = {
    user: 'sa',
    password: '123456',
    server: '127.0.0.1',
    database: 'HastaneManagement',
    port: 1433,
    options: {
        instanceName: 'SQLEXPRESS',
        encrypt: false,
        trustServerCertificate: true
    }
};

function parsePositiveInt(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function sendServerError(res, message, err) {
    console.error(message, err);
    return res.status(500).json({ success: false, message });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'Hastane_Otomasyonu', 'anasayfa.html'));
});

app.post('/hasta-giris', async (req, res) => {
    const { tc, sifre } = req.body;

    if (!tc || !sifre) {
        return res.status(400).json({ success: false, message: 'TC ve şifre zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('tc', sql.VarChar(11), tc)
            .input('sifre', sql.VarChar(50), sifre)
            .query(`
                SELECT hastaID, hastaAd, hastaSoyad, hastaTC
                FROM Hasta
                WHERE hastaTC = @tc AND hastaSifre = @sifre
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'TC veya şifre yanlış.' });
        }

        const hasta = result.recordset[0];
        res.json({ success: true, message: 'Hasta girişi başarılı.', hasta, hastaID: hasta.hastaID, role: 'patient' });
    } catch (err) {
        sendServerError(res, 'Hasta girişi sırasında sunucu hatası oluştu.', err);
    }
});

async function doktorGirisHandler(req, res) {
    const { tc, sifre } = req.body;

    if (!tc || !sifre) {
        return res.status(400).json({ success: false, message: 'TC ve şifre zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('tc', sql.VarChar(11), tc)
            .input('sifre', sql.VarChar(50), sifre)
            .query(`
                SELECT personelID, Ad, Soyad, personelTC, personelTuruID, poliklinikID
                FROM Personel
                WHERE personelTC = @tc AND personelSifre = @sifre AND personelTuruID = 1
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'TC veya şifre yanlış.' });
        }

        const personel = result.recordset[0];
        res.json({
            success: true,
            message: 'Doktor girişi başarılı.',
            role: 'doctor',
            personel,
            personelID: personel.personelID,
            doktorID: personel.personelID,
            Ad: personel.Ad,
            Soyad: personel.Soyad,
            personelTuruID: personel.personelTuruID,
            poliklinikID: personel.poliklinikID
        });
    } catch (err) {
        sendServerError(res, 'Doktor girişi sırasında sunucu hatası oluştu.', err);
    }
}

app.post('/doktor-giris', doktorGirisHandler);
app.post('/api/doktor-giris', doktorGirisHandler);

app.post('/hemsire-giris', async (req, res) => {
    const { tc, sifre } = req.body;

    if (!tc || !sifre) {
        return res.status(400).json({ success: false, message: 'TC ve şifre zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('tc', sql.VarChar(11), tc)
            .input('sifre', sql.VarChar(50), sifre)
            .query(`
                SELECT personelID, Ad, Soyad, personelTC, personelTuruID, poliklinikID
                FROM Personel
                WHERE personelTC = @tc AND personelSifre = @sifre AND personelTuruID = 2
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'TC veya şifre yanlış.' });
        }

        const personel = result.recordset[0];
        res.json({
            success: true,
            message: 'Hemşire girişi başarılı.',
            personel,
            personelID: personel.personelID,
            personelTuruID: personel.personelTuruID,
            poliklinikID: personel.poliklinikID,
            role: 'nurse'
        });
    } catch (err) {
        sendServerError(res, 'Hemşire girişi sırasında sunucu hatası oluştu.', err);
    }
});

app.post('/memur-giris', async (req, res) => {
    const { tc, sifre } = req.body;

    if (!tc || !sifre) {
        return res.status(400).json({ success: false, message: 'TC ve şifre zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('tc', sql.VarChar(11), tc)
            .input('sifre', sql.VarChar(50), sifre)
            .query(`
                SELECT personelID, Ad, Soyad, personelTC, personelTuruID, poliklinikID
                FROM Personel
                WHERE personelTC = @tc AND personelSifre = @sifre AND personelTuruID = 3
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'TC veya şifre yanlış.' });
        }

        const personel = result.recordset[0];
        res.json({
            success: true,
            message: 'Memur girişi başarılı.',
            personel,
            personelID: personel.personelID,
            personelTuruID: personel.personelTuruID,
            role: 'officer'
        });
    } catch (err) {
        sendServerError(res, 'Memur girişi sırasında sunucu hatası oluştu.', err);
    }
});

app.post('/api/kayit', async (req, res) => {
    const {
        hastaAd, hastaSoyad, hastaDgmTarih, hastaCinsiyet,
        hastaTlfn, hastaEposta, hastaAdres, hastaAdresUlke,
        hastaAdresil, hastaAdresilce, hastaTC
    } = req.body;

    if (!hastaAd || !hastaSoyad || !hastaTC || hastaTC.length !== 11) {
        return res.status(400).json({ success: false, message: 'Ad, soyad ve 11 haneli TC zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('hastaAd', sql.VarChar(50), hastaAd)
            .input('hastaSoyad', sql.VarChar(50), hastaSoyad)
            .input('hastaDgmTarih', sql.Date, hastaDgmTarih)
            .input('hastaCinsiyet', sql.Char(1), hastaCinsiyet)
            .input('hastaTlfn', sql.VarChar(20), hastaTlfn)
            .input('hastaEposta', sql.VarChar(100), hastaEposta)
            .input('hastaAdres', sql.VarChar(sql.MAX), hastaAdres)
            .input('hastaAdresUlke', sql.VarChar(50), hastaAdresUlke)
            .input('hastaAdresil', sql.VarChar(50), hastaAdresil)
            .input('hastaAdresilce', sql.VarChar(50), hastaAdresilce)
            .input('hastaTC', sql.VarChar(11), hastaTC)
            .input('randevulumu', sql.Char(1), 'H')
            .input('hastaSifre', sql.VarChar(20), hastaTC.slice(-6))
            .query(`
                INSERT INTO Hasta (
                    hastaAd, hastaSoyad, hastaDgmTarih, hastaCinsiyet, hastaTlfn,
                    hastaEposta, hastaAdres, hastaAdresUlke, hastaAdresil,
                    hastaAdresilce, hastaTC, randevulumu, hastaSifre
                ) VALUES (
                    @hastaAd, @hastaSoyad, @hastaDgmTarih, @hastaCinsiyet, @hastaTlfn,
                    @hastaEposta, @hastaAdres, @hastaAdresUlke, @hastaAdresil,
                    @hastaAdresilce, @hastaTC, @randevulumu, @hastaSifre
                )
            `);

        res.json({ success: true, message: 'Hasta başarıyla kayıt edildi.' });
    } catch (err) {
        sendServerError(res, 'Hasta kaydı sırasında veritabanı hatası oluştu.', err);
    }
});

app.post('/api/memur/hasta-kayit', async (req, res) => {
    const {
        hastaAd, hastaSoyad, hastaDgmTarih, hastaCinsiyet,
        hastaTlfn, hastaEposta, hastaAdres, hastaAdresUlke,
        hastaAdresil, hastaAdresilce, hastaTC
    } = req.body;

    if (!hastaAd || !hastaSoyad || !hastaTC || hastaTC.length !== 11) {
        return res.status(400).json({ success: false, message: 'Ad, soyad ve 11 haneli TC zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('hastaAd', sql.VarChar(50), hastaAd)
            .input('hastaSoyad', sql.VarChar(50), hastaSoyad)
            .input('hastaDgmTarih', sql.Date, hastaDgmTarih)
            .input('hastaCinsiyet', sql.Char(1), hastaCinsiyet)
            .input('hastaTlfn', sql.VarChar(20), hastaTlfn)
            .input('hastaEposta', sql.VarChar(100), hastaEposta)
            .input('hastaAdres', sql.VarChar(sql.MAX), hastaAdres)
            .input('hastaAdresUlke', sql.VarChar(50), hastaAdresUlke)
            .input('hastaAdresil', sql.VarChar(50), hastaAdresil)
            .input('hastaAdresilce', sql.VarChar(50), hastaAdresilce)
            .input('hastaTC', sql.VarChar(11), hastaTC)
            .input('randevulumu', sql.Char(1), 'H')
            .input('hastaSifre', sql.VarChar(20), hastaTC.slice(-6))
            .query(`
                INSERT INTO Hasta (
                    hastaAd, hastaSoyad, hastaDgmTarih, hastaCinsiyet, hastaTlfn,
                    hastaEposta, hastaAdres, hastaAdresUlke, hastaAdresil,
                    hastaAdresilce, hastaTC, randevulumu, hastaSifre
                ) VALUES (
                    @hastaAd, @hastaSoyad, @hastaDgmTarih, @hastaCinsiyet, @hastaTlfn,
                    @hastaEposta, @hastaAdres, @hastaAdresUlke, @hastaAdresil,
                    @hastaAdresilce, @hastaTC, @randevulumu, @hastaSifre
                )
            `);

        res.json({ success: true, message: 'Randevusuz hasta başarıyla kaydedildi.' });
    } catch (err) {
        sendServerError(res, 'Memur hasta kaydı sırasında veritabanı hatası oluştu.', err);
    }
});

app.get('/api/randevular', async (req, res) => {
    const hastaID = parsePositiveInt(req.query.hastaID);

    if (!hastaID) {
        return res.status(400).json({ success: false, message: 'Geçerli hastaID parametresi gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('hastaID', sql.Int, hastaID)
            .query(`
                SELECT *, DoktorAdSoyad AS doktor
                FROM vw_RandevuGosterim
                WHERE hastaID = @hastaID
                ORDER BY randevuTarih DESC
            `);

        res.json(result.recordset);
    } catch (err) {
        sendServerError(res, 'Randevular alınamadı.', err);
    }
});

app.delete('/api/randevular/:randevuID', async (req, res) => {
    const randevuID = parsePositiveInt(req.params.randevuID);
    const hastaID = parsePositiveInt(req.query.hastaID || req.body.hastaID);

    if (!randevuID || !hastaID) {
        return res.status(400).json({ success: false, message: 'Geçerli randevuID ve hastaID gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('randevuID', sql.Int, randevuID)
            .input('hastaID', sql.Int, hastaID)
            .query('DELETE FROM Randevu WHERE randevuID = @randevuID AND hastaID = @hastaID');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: 'Randevu bulunamadı veya bu hastaya ait değil.' });
        }

        res.json({ success: true, message: 'Randevu silindi.' });
    } catch (err) {
        sendServerError(res, 'Randevu silinirken veritabanı hatası oluştu.', err);
    }
});

app.get('/api/sonuclar', async (req, res) => {
    const hastaID = parsePositiveInt(req.query.hastaID);

    if (!hastaID) {
        return res.status(400).json({ success: false, message: 'Geçerli hastaID parametresi gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('hastaID', sql.Int, hastaID)
            .query(`
                SELECT *
                FROM vw_TahlilListesi
                WHERE hastaID = @hastaID
                ORDER BY tahlilID DESC
            `);

        res.json(result.recordset);
    } catch (err) {
        sendServerError(res, 'Tahlil sonuçları alınamadı.', err);
    }
});

app.get('/api/poliklinik-doktorlari', async (req, res) => {
    const poliklinikID = parsePositiveInt(req.query.poliklinikId);

    if (!poliklinikID) {
        return res.status(400).json({ success: false, message: 'Geçerli poliklinik ID gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('poliklinikID', sql.Int, poliklinikID)
            .query(`
                SELECT personelID, Ad, Soyad
                FROM Personel
                WHERE poliklinikID = @poliklinikID AND personelTuruID = 1
                ORDER BY Ad, Soyad
            `);

        res.json(result.recordset);
    } catch (err) {
        sendServerError(res, 'Doktorlar listesi alınamadı.', err);
    }
});

app.get('/api/dolu-saatler', async (req, res) => {
    const doktorID = parsePositiveInt(req.query.doktorId);
    const { tarih } = req.query;

    if (!doktorID || !tarih) {
        return res.status(400).json({ success: false, message: 'Geçerli doktor ID ve tarih gereklidir.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('doktorID', sql.Int, doktorID)
            .input('tarih', sql.Date, tarih)
            .query(`
                SELECT randevuSaat
                FROM Randevu
                WHERE personelID = @doktorID AND CAST(randevuTarih AS DATE) = @tarih
            `);

        res.json(result.recordset.map(row => String(row.randevuSaat).trim()));
    } catch (err) {
        sendServerError(res, 'Dolu saatler alınamadı.', err);
    }
});

app.post('/api/randevu-olustur', async (req, res) => {
    const { randevuTarih, randevuSaat, doktorId, hastaId } = req.body;
    const doktorID = parsePositiveInt(doktorId);
    const hastaID = parsePositiveInt(hastaId);

    if (!randevuTarih || !randevuSaat || !doktorID || !hastaID) {
        return res.status(400).json({ success: false, message: 'Lütfen tüm alanları eksiksiz doldurun.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('RandevuTarih', sql.DateTime, randevuTarih)
            .input('RandevuSaat', sql.Char(5), randevuSaat)
            .input('DoktorID', sql.Int, doktorID)
            .input('HastaID', sql.Int, hastaID)
            .execute('sp_RandevuOlustur');

        res.json({ success: true, message: 'Randevunuz başarıyla oluşturuldu.' });
    } catch (err) {
        console.error('Randevu oluşturma hatası:', err);
        res.status(500).json({ success: false, message: err.message || 'Randevu oluşturulurken veritabanı hatası oluştu.' });
    }
});

app.get('/api/aktif-hastalar', async (req, res) => {
    const doktorID = parsePositiveInt(req.query.doktorId);

    if (!doktorID) {
        return res.status(400).json({ success: false, message: 'Geçerli doktor ID gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('doktorID', sql.Int, doktorID)
            .query(`
                SELECT DISTINCT
                    R.randevuID,
                    H.hastaID,
                    H.hastaAd,
                    H.hastaSoyad,
                    R.durum,
                    R.randevuSaat
                FROM Randevu R
                INNER JOIN Hasta H ON R.hastaID = H.hastaID
                WHERE R.personelID = @doktorID
                  AND ISNULL(R.durum, 'Aktif') = 'Aktif'
                ORDER BY R.randevuSaat
            `);

        res.json(result.recordset);
    } catch (err) {
        sendServerError(res, 'Aktif hastalar alınamadı.', err);
    }
});

app.post('/api/muayene-tamamla', async (req, res) => {
    const hastaID = parsePositiveInt(req.body.id);

    if (!hastaID) {
        return res.status(400).json({ success: false, message: 'Geçerli hasta ID gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('hastaID', sql.Int, hastaID)
            .query(`
                UPDATE Randevu
                SET durum = 'Tamamlandı'
                WHERE hastaID = @hastaID
                  AND ISNULL(durum, 'Aktif') = 'Aktif'
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: 'Aktif randevu bulunamadı.' });
        }

        res.json({ success: true, message: 'Muayene durumu güncellendi.' });
    } catch (err) {
        sendServerError(res, 'Muayene güncellenemedi.', err);
    }
});

app.post('/api/tahlil-iste', async (req, res) => {
    const { tahlilTuru, neden, hastaID, personelID } = req.body;
    const parsedHastaID = parsePositiveInt(hastaID);
    const parsedPersonelID = parsePositiveInt(personelID);

    if (!tahlilTuru || !parsedHastaID || !parsedPersonelID) {
        return res.status(400).json({ success: false, message: 'Tahlil türü, hasta ve doktor bilgisi zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('tahlilTuru', sql.VarChar(50), tahlilTuru)
            .input('neden', sql.VarChar(100), neden || null)
            .input('hastaID', sql.Int, parsedHastaID)
            .input('personelID', sql.Int, parsedPersonelID)
            .query(`
                INSERT INTO Tahliller (tahlilTuru, Neden, Sonuc, Durum, hastaID, personelID)
                VALUES (@tahlilTuru, @neden, NULL, 'Bekleniyor', @hastaID, @personelID)
            `);

        res.json({ success: true, message: 'Tahlil isteği laboratuvara gönderildi.' });
    } catch (err) {
        sendServerError(res, 'Tahlil isteği kaydedilemedi.', err);
    }
});

app.get('/api/doktor-tahlil-sonuclari', async (req, res) => {
    const doktorID = parsePositiveInt(req.query.doktorId);

    if (!doktorID) {
        return res.status(400).json({ success: false, message: 'Geçerli doktor ID gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('doktorID', sql.Int, doktorID)
            .query(`
                SELECT tahlilID, tahlilTuru, IstemeNedeni, TahlilSonucu, Durum, HastaAdSoyad, hastaTC
                FROM vw_TahlilListesi
                WHERE isteyenPersonelID = @doktorID
                ORDER BY tahlilID DESC
            `);

        res.json(result.recordset);
    } catch (err) {
        sendServerError(res, 'Doktor tahlil sonuçları alınamadı.', err);
    }
});

app.get('/api/hemsire/tahliller', async (req, res) => {
    const hemsireID = parsePositiveInt(req.query.hemsireId);

    if (!hemsireID) {
        return res.status(400).json({ success: false, message: 'Geçerli hemşire ID gerekli.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const nurseResult = await pool.request()
            .input('hemsireID', sql.Int, hemsireID)
            .query('SELECT poliklinikID FROM Personel WHERE personelID = @hemsireID AND personelTuruID = 2');

        if (nurseResult.recordset.length === 0) {
            return res.status(403).json({ success: false, message: 'Hemşire oturumu doğrulanamadı.' });
        }

        const poliklinikID = nurseResult.recordset[0].poliklinikID;
        const result = await pool.request()
            .input('poliklinikID', sql.Int, poliklinikID)
            .query(`
                SELECT tahlilID, hastaID, HastaAdSoyad, hastaTC, tahlilTuru, IstemeNedeni,
                       TahlilSonucu, Durum, DoktorAdSoyad, poliklinikID, poliklinikAdi
                FROM vw_TahlilListesi
                WHERE poliklinikID = @poliklinikID
                ORDER BY CASE WHEN Durum = 'Bekleniyor' THEN 0 ELSE 1 END, tahlilID DESC
            `);

        res.json(result.recordset);
    } catch (err) {
        sendServerError(res, 'Hemşire tahlil listesi alınamadı.', err);
    }
});

app.put('/api/hemsire/tahliller/:tahlilID/sonuc', async (req, res) => {
    const tahlilID = parsePositiveInt(req.params.tahlilID);
    const hemsireID = parsePositiveInt(req.body.hemsireID);
    const sonuc = typeof req.body.sonuc === 'string' ? req.body.sonuc.trim() : '';

    if (!tahlilID || !hemsireID || !sonuc) {
        return res.status(400).json({ success: false, message: 'Tahlil, hemşire ve sonuç bilgisi zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('tahlilID', sql.Int, tahlilID)
            .input('hemsireID', sql.Int, hemsireID)
            .input('sonuc', sql.VarChar(100), sonuc)
            .query(`
                UPDATE T
                SET T.Sonuc = @sonuc,
                    T.Durum = 'Sonuçlandı'
                FROM Tahliller T
                INNER JOIN Personel Doktor ON T.personelID = Doktor.personelID
                INNER JOIN Personel Hemsire ON Hemsire.personelID = @hemsireID
                WHERE T.tahlilID = @tahlilID
                  AND Hemsire.personelTuruID = 2
                  AND Doktor.poliklinikID = Hemsire.poliklinikID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: 'Tahlil bulunamadı veya hemşirenin polikliniğine ait değil.' });
        }

        res.json({ success: true, message: 'Tahlil sonucu kaydedildi.' });
    } catch (err) {
        sendServerError(res, 'Tahlil sonucu kaydedilemedi.', err);
    }
});

app.post('/api/recete-yaz', async (req, res) => {
    const { ilacAdi, hastaID, personelID } = req.body;
    const parsedHastaID = parsePositiveInt(hastaID);
    const parsedPersonelID = parsePositiveInt(personelID);

    if (!ilacAdi || !parsedHastaID || !parsedPersonelID) {
        return res.status(400).json({ success: false, message: 'Hasta, doktor ve ilaç bilgisi zorunludur.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('ilacAdi', sql.VarChar(50), ilacAdi)
            .input('hastaID', sql.Int, parsedHastaID)
            .input('personelID', sql.Int, parsedPersonelID)
            .query('INSERT INTO Recete (hastaID, ilacAdi, personelID) VALUES (@hastaID, @ilacAdi, @personelID)');

        res.json({ success: true, message: 'Reçete başarıyla kaydedildi.' });
    } catch (err) {
        sendServerError(res, 'Reçete kaydedilemedi.', err);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde aktif.`);
    try {
        await sql.connect(dbConfig);
        console.log('SQL Server bağlantısı başarılı.');
    } catch (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    }
});


