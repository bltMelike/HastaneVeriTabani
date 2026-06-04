CREATE TRIGGER trg_CocukPoliklinikYasKontrol
ON Randevu
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Eğer Çocuk Sağlığı (poliklinikID = 4) seçildiyse ve hastanın yaşı 18'den büyükse engelle
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        INNER JOIN Personel p ON i.personelID = p.personelID
        INNER JOIN Hasta h ON i.hastaID = h.hastaID
        WHERE p.poliklinikID = 4 -- Çocuk Sağlığı Polikliniği
          AND DATEDIFF(YEAR, h.hastaDgmTarih, GETDATE()) > 18 -- Yaş 18'den büyükse
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR ('HATA: Çocuk Sağlığı polikliniğinden sadece 18 yaş ve altı hastalar randevu alabilir!', 16, 1);
    END
END;
GO

USE HastaneManagement;
GO

CREATE TRIGGER trg_RandevuSadeceDoktor
ON Randevu
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Eğer randevu verilen personelin türü Doktor (1) değilse işlemi iptal et
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        INNER JOIN Personel p ON i.personelID = p.personelID
        WHERE p.personelTuruID <> 1
    )
    BEGIN
        ROLLBACK TRANSACTION; -- Yapılan ekleme/güncelleme işlemini geri al
        RAISERROR ('HATA: Randevu sadece Doktor rolündeki bir personele tanımlanabilir!', 16, 1);
    END
END;
GO

CREATE TRIGGER trg_HastaRandevuDurumGuncelle
ON Randevu
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Randevu alan hastanın 'randevulumu' durumunu otomatik olarak 'E' (Evet) yap
    UPDATE Hasta
    SET randevulumu = 'E'
    WHERE hastaID IN (SELECT hastaID FROM inserted);
END;
GO

USE HastaneManagement;
GO

-- Hasta tablosundaki hastaTC alanını indeksliyoruz
CREATE UNIQUE INDEX IX_Hasta_TC 
ON Hasta(hastaTC);
GO

CREATE UNIQUE INDEX IX_Hasta_Sifre 
ON Hasta(hastaSifre);
GO

CREATE UNIQUE INDEX IX_Personel_Sicil
ON Personel(personelTC);
GO

CREATE UNIQUE INDEX IX_Personel_Sifre
ON Personel(personelSifre);
GO


--KULLANICI GİRİŞİ KONTROLÜ PERSONEL
CREATE PROCEDURE sp_PersonelLogin
    @TC VARCHAR(11),
    @Sifre VARCHAR(6)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kullanıcı var mı ve şifre doğru mu kontrolü
    IF EXISTS (SELECT 1 FROM Personel WHERE personelTC = @TC AND personelSifre = @Sifre)
    BEGIN
        -- Giriş başarılı: Personel bilgilerini ve rolünü (türünü) dönüyoruz
        SELECT 
            p.personelID,
            p.Ad,
            p.Soyad,
            p.personelTuruID, -- 1: Doktor, 2: Hemşire, 3: Memur
            pt.tur AS RolAdi
        FROM Personel p
        INNER JOIN PersonelTuru pt ON p.personelTuruID = pt.personelTuruID
        WHERE p.personelTC = @TC AND p.personelSifre = @Sifre;
    END
    ELSE
    BEGIN
        -- Giriş başarısızsa hata fırlatıyoruz
        RAISERROR('Hatalı TC Kimlik No veya Şifre!', 16, 1);
    END
END;
GO
--HASTA GİRİŞ KONTROLÜ
CREATE PROCEDURE sp_HastaLoginEkran
    @TC VARCHAR(11),
    @Sifre VARCHAR(6)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Hasta WHERE hastaTC = @TC AND hastaSifre = @Sifre)
    BEGIN
        SELECT hastaID, hastaAd, hastaSoyad FROM Hasta 
        WHERE hastaTC = @TC AND hastaSifre = @Sifre;
    END
    ELSE
    BEGIN
        RAISERROR('Hatalı Hasta TC veya Şifre!', 16, 1);
    END
END;
GO

USE HastaneManagement;
GO


--RANDEVU KONTROLÜ
CREATE PROCEDURE sp_RandevuOlustur
    @RandevuTarih DATETIME,
    @RandevuSaat CHAR(5),
    @DoktorID INT,
    @HastaID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- AYNI SAATTE AYNI DOKTORA ALINMA KONTROLÜ
    IF EXISTS (
        SELECT 1 
        FROM Randevu 
        WHERE personelID = @DoktorID 
          AND randevuTarih = @RandevuTarih 
          AND randevuSaat = @RandevuSaat
    )
    BEGIN
        RAISERROR('HATA: Bu doktorun seçilen gün ve saatte zaten başka bir randevusu bulunmaktadır!', 16, 1);
        RETURN; -- İşlemi durdur ve aşağıya geç
    END

    -- HASTA AYNI SAATE BİRDEN FAZLA RANDEVU ALIYOR MU KONTROL
    IF EXISTS (
        SELECT 1 
        FROM Randevu 
        WHERE hastaID = @HastaID 
          AND randevuTarih = @RandevuTarih 
          AND randevuSaat = @RandevuSaat
    )
    BEGIN
        RAISERROR('HATA: Bu hastanın aynı gün ve saatte zaten başka bir poliklinikte randevusu bulunmaktadır!', 16, 1);
        RETURN; -- İşlemi durdur ve aşağıya geç
    END

    -- Eğer yukarıdaki iki kontrolden de başarıyla geçtiyse randevuyu oluştur
    INSERT INTO Randevu (randevuTarih, randevuSaat, personelID, hastaID)
    VALUES (@RandevuTarih, @RandevuSaat, @DoktorID, @HastaID);

    PRINT 'Randevu başarıyla oluşturuldu.';
END;
GO

---- VİEWLER
--- randevu gösterimi
CREATE VIEW vw_RandevuGosterim
AS
SELECT 
    r.randevuID,
    r.randevuTarih,
    r.randevuSaat,
    -- Hasta Tablosundan Bilgiler
    h.hastaTC,
    (h.hastaAd + ' ' + h.hastaSoyad) AS HastaAdSoyad,
    h.hastaTlfn AS HastaTelefon,
    -- Personel (Doktor) Tablosundan Bilgiler
    (p.Ad + ' ' + p.Soyad) AS DoktorAdSoyad,
    -- Poliklinik Tablosundan Bilgiler
    pol.poliklinikAdi
FROM Randevu r
INNER JOIN Hasta h ON r.hastaID = h.hastaID
INNER JOIN Personel p ON r.personelID = p.personelID
INNER JOIN Poliklinik pol ON p.poliklinikID = pol.poliklinikID;
GO

--Doktor için tahlil sonuçlarını listeleme
CREATE VIEW vw_TahlilListesi
AS
SELECT 
    t.tahlilID,
    t.tahlilTuru,
    t.Neden AS IstemeNedeni,
    t.Sonuc AS TahlilSonucu,
    -- Hasta Bilgisi
    (h.hastaAd + ' ' + h.hastaSoyad) AS HastaAdSoyad,
    h.hastaTC,
    -- İsteyen Doktor Bilgisi
    (p.Ad + ' ' + p.Soyad) AS DoktorAdSoyad
FROM Tahliller t
INNER JOIN Hasta h ON t.hastaID = h.hastaID
INNER JOIN Personel p ON t.personelID = p.personelID;
GO
--DOKTOR SADECE TAHLİL NEDENİNİ GİRSİN
CREATE PROCEDURE sp_TahlilIste
    @TahlilTuru VARCHAR(10),
    @Neden VARCHAR(100),
    @HastaID INT,
    @DoktorID INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Tahliller (tahlilTuru, Neden, Sonuc, hastaID, personelID)
    VALUES (@TahlilTuru, @Neden, NULL, @HastaID, @DoktorID);
END;
GO

--HEMŞİREYSE SADECE  SONUCUNU GİRSİN
CREATE PROCEDURE sp_TahlilSonucGir
    @TahlilID INT,
    @Sonuc VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- İlgili tahlil kaydını bulup sonucunu güncelliyoruz
    UPDATE Tahliller
    SET Sonuc = @Sonuc
    WHERE tahlilID = @TahlilID;
END;
GO
---Veri tabanını bağlarken eksik olduğunu farkettiğimiz için randevugörüntüle viewinii güncelliyoruz
--hastaIDyi göstrmeyi unuttuk
ALTER VIEW vw_RandevuGosterim AS
SELECT 
    r.randevuID,
    r.hastaID,
    r.randevuTarih,
    r.randevuSaat,
    -- Hasta Tablosundan Bilgiler
    h.hastaTC,    
    (h.hastaAd + ' ' + h.hastaSoyad) AS HastaAdSoyad,
    h.hastaTlfn AS HastaTelefon,
    -- Personel (Doktor) Tablosundan Bilgiler    
    (p.Ad + ' ' + p.Soyad) AS DoktorAdSoyad,
    -- Poliklinik Tablosundan Bilgiler
    pol.poliklinikAdi
FROM Randevu r
INNER JOIN Hasta h ON r.hastaID = h.hastaID
INNER JOIN Personel p ON r.personelID = p.personelID
INNER JOIN Poliklinik pol ON p.poliklinikID = pol.poliklinikID;
GO
--öncesinde hastaIDyi eklemediğimiz için onu ekliyoruz
ALTER VIEW vw_TahlilListesi AS
SELECT 
    t.tahlilID,
    t.hastaID,
    t.tahlilTuru,
    t.Neden AS IstemeNedeni,
    t.Sonuc AS TahlilSonucu,
    -- Hasta Bilgisi    
    (h.hastaAd + ' ' + h.hastaSoyad) AS HastaAdSoyad,
    h.hastaTC,
    -- İsteyen Doktor Bilgisi    
    (p.Ad + ' ' + p.Soyad) AS DoktorAdSoyad
FROM Tahliller t
INNER JOIN Hasta h ON t.hastaID = h.hastaID
INNER JOIN Personel p ON t.personelID = p.personelID;
GO

