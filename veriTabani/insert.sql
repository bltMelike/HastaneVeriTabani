INSERT INTO  Poliklinik VALUES ('Kulak Burun Boğaz');
INSERT INTO  Poliklinik VALUES ('İç Hastalıkları (Dahiliye)');
INSERT INTO  Poliklinik VALUES ('Kadın Hastalıkları ve Doğum');
INSERT INTO  Poliklinik VALUES ('Çocuk Sağlığı');
INSERT INTO  Poliklinik VALUES ('Genel Cerrahi');
INSERT INTO  Poliklinik VALUES ('Kardiyoloji');
INSERT INTO  Poliklinik VALUES ('Ortapedi');
INSERT INTO  Poliklinik VALUES ('Göz Sağlığı');
INSERT INTO  Poliklinik VALUES ('Psikiyatri');
INSERT INTO  Poliklinik VALUES ('Nöroloji');




INSERT INTO Personel (Ad,Soyad, personelTuruID, personelTC,personelSifre, personeltlfn, poliklinikID, maas, uzmanlikAlani) 
VALUES
-- Kulak Burun Boğaz (poliklinikID: 1)
('Ali', 'Yıldırım', 1, '10234567890','DKTR01', '5051112233', 1, 85000.00, 'KBB Uzmanı'),
('Elif', 'Karaca', 1, '11234567891','DKTR02', '5051112234', 1, 87000.00, 'KBB Uzmanı'),
('Mehmet', 'Arslan', 1, '12234567892','DKTR03', '5051112235', 1, 89000.00, 'KBB Uzmanı'),

-- İç Hastalıkları (Dahiliye) (poliklinikID: 2)
('Ayşe', 'Demir', 1, '13234567893','DKTR04' ,'5051112236', 2, 82000.00, 'Dahiliye Uzmanı'),
('Murat', 'Koç', 1, '14234567894','DKTR05', '5051112237', 2, 84000.00, 'Dahiliye Uzmanı'),
('Zeynep', 'Aydın', 1, '15234567895','DKTR06', '5051112238', 2, 86000.00, 'Dahiliye Uzmanı'),

-- Kadın Hastalıkları ve Doğum (poliklinikID: 3)
('Selin', 'Kaya', 1, '16234567896','DKTR07', '5051112239', 3, 95000.00, 'Perinatoloji'),
('Derya', 'Polat', 1, '17234567897','DKTR08', '5051112240', 3, 93000.00, 'Jinekoloji'),
('Fatma', 'Özkan', 1,'18234567898','DKTR09', '5051112241', 3, 94000.00, 'Tüp Bebek Uzmanı'),

-- Çocuk Sağlığı (poliklinikID: 4)
('Can', 'Yılmaz', 1, '19234567899','DKTR10', '5051112242', 4, 81000.00, 'Pediatri Uzmanı'),
('Esra', 'Güneş', 1, '20234567890','DKTR11', '5051112243', 4, 83000.00, 'Pediatri Uzmanı'),
('Hakan', 'Çelik', 1, '21234567891','DKTR12', '5051112244', 4, 82500.00, 'Çocuk Kardiyolojisi'),

-- Genel Cerrahi (poliklinikID: 5)
('Ömer Faruk', 'Şahin', 1, '22234567892','DKTR13', '5051112245', 5, 98000.00, 'Gastroenteroloji Cerrahisi'),
('Burcu', 'Yalçın', 1, '23234567893','DKTR14', '5051112246', 5, 96000.00, 'Meme Cerrahisi'),
('Serkan', 'Demir', 1, '24234567894','DKTR15', '5051112247', 5, 97000.00, 'Endokrin Cerrahisi'),

-- Kardiyoloji (poliklinikID: 6)
('İsmail', 'Kurt', 1, '25234567895','DKTR16', '5051112248', 6, 105000.00, 'Girişimsel Kardiyoloji'),
('Pelin', 'Arslan', 1, '26234567896','DKTR17', '5051112249', 6, 102000.00, 'Ekokardiyografi'),
('Volkan', 'Yavuz', 1, '27234567897','DKTR18', '5051112250', 6, 104000.00, 'Kalp Pili Uzmanı'),

-- Ortopedi (poliklinikID: 7)
('Emre', 'Aksoy', 1, '28234567898','DKTR19', '5051112251', 7, 91000.00, 'El Cerrahisi'),
('Merve', 'Kaplan', 1, '29234567899','DKTR20', '5051112252', 7, 92000.00, 'Spor Hekimliği'),
('Tolga', 'Şen', 1,'30234567890','DKTR21',  '5051112253', 7, 90000.00, 'Omurga Cerrahisi'),

-- Göz Sağlığı (poliklinikID: 8)
('Nazlı', 'Ateş', 1, '31234567891','DKTR22', '5051112254', 8, 88000.00, 'Retina Hastalıkları'),
('Barış', 'Doğan', 1, '32234567892','DKTR23', '5051112255', 8, 87500.00, 'Katarakt ve Refraktif'),
('Gökhan', 'Erdem', 1, '33234567893','DKTR24', '5051112256', 8, 89000.00, 'Glokom Uzmanı'),

-- Psikiyatri (poliklinikID: 9)
('İlayda', 'Yalçın', 1, '34234567894','DKTR25', '5051112257', 9, 80000.00, 'Yetişkin Psikiyatri'),
('Kadir', 'Boz', 1, '35234567895', 'DKTR26','5051112258', 9, 81500.00, 'Bilişsel Davranışçı Terapi'),
('Sibel', 'Taş', 1, '36234567896', 'DKTR27','5051112259', 9, 83000.00, 'Bağımlılık Psikiyatrisi'),

-- Nöroloji (poliklinikID: 10)
('Ferhat', 'Öztürk', 1, '37234567897','DKTR28', '5051112260', 10, 89500.00, 'Epilepsi Uzmanı'),
('Deniz', 'Kılıç', 1, '38234567898','DKTR29', '5051112261', 10, 91000.00, 'İnme ve Serebrovasküler'),
('Ece', 'Acar', 1, '39234567899','DKTR30', '5051112262', 10, 92000.00, 'Uyku Bozuklukları');

INSERT INTO Personel (Ad,Soyad, personelTuruID, personelTC,personelSifre, personeltlfn, poliklinikID, maas, uzmanlikAlani) 
VALUES
-- HEMŞİRELER (personelTuruID: 2)
-- Farklı polikliniklere (KBB, Dahiliye, Çocuk vb.) dağıtılmıştır
('Fatma', 'Yılmaz', 2, '40234567890','HMSR01', '5551110001', 1, 45000.00, 'KBB Hemşiresi'),
('Ayşe', 'Kaya', 2, '41234567891','HMSR02', '5551110002', 2, 46000.00, 'Dahiliye Hemşiresi'),
('Emine', 'Çelik', 2, '42234567892','HMSR03', '5551110003', 4, 45500.00, 'Pediatri Hemşiresi'),
('Hatice', 'Yıldız', 2, '43234567893','HMSR04', '5551110004', 6, 48000.00, 'Koroner Yoğun Bakım'),
('Zeynep', 'Öztürk', 2, '44234567894','HMSR05', '5551110005', 5, 47000.00, 'Ameliyathane Hemşiresi'),
('Merve', 'Yurt', 2, '45234567895','HMSR06', '5551110006', 3, 46500.00, 'Doğumhane Hemşiresi'),
('Gizem', 'Şen', 2, '46234567896','HMSR07', '5551110007', 5, 47500.00, 'Cerrahi Servis Hemşiresi'),
('Seda', 'Aslan', 2, '47234567897','HMSR08', '5551110008', 6, 49000.00, 'Kardiyoloji Yoğun Bakım'),
('Demet', 'Bulut', 2, '48234567898','HMSR09', '5551110009', 7, 46000.00, 'Ortopedi Servis Hemşiresi'),
('Kübra', 'Yavuz', 2, '49234567899','HMSR10', '5551110010', 8, 45500.00, 'Göz Poliklinik Hemşiresi'),

-- MEMURLAR (personelTuruID: 3)
-- Poliklinik kısmı idari personel oldukları için NULL (boş) bırakılmıştır
('Ahmet', 'Yılmaz', 3, '50234567890','MEMR01', '5441110001', NULL, 38000.00, 'Danışma / Hasta Kabul'),
('Mustafa', 'Aydın', 3, '51234567891','MEMR02', '5441110002', NULL, 40000.00, 'Danışma / Hasta Kabul'),
('Mehmet', 'Demir', 3, '52234567892','MEMR03', '5441110003', NULL, 39000.00, 'Danışma / Hasta Kabul'),
('Ali', 'Arslan', 3, '53234567893','MEMR04', '5441110004', NULL, 38000.00, 'Danışma / Hasta Kabul'),
('Hüseyin', 'Köse', 3, '54234567894','MEMR05', '5441110005', NULL, 41000.00, 'Danışma / Hasta Kabul');
ALTER TABLE Hasta 
DROP CONSTRAINT UQ__Hasta__0D8E1E95CABC5910;
GO

ALTER TABLE Hasta
DROP COLUMN personelSifre;
GO
----  bu kod bir hastanın aynı randevuyu tekrar alamasın diye 
ALTER TABLE Randevu
ADD CONSTRAINT UQ_Hasta_Randevu_Zaman UNIQUE (hastaID, randevuTarih, randevuSaat);
GO

--TEST VERİLERİ
--ÖNCE HASTA EKLEYELİM

INSERT INTO Hasta (hastaAd,hastaSoyad,hastaDgmTarih,hastaCinsiyet,hastaTlfn,hastaEposta,hastaAdres,hastaAdresUlke,hastaAdresil,
hastaAdresilce,hastaTC,randevulumu,hastaSifre)
VALUES
('Nisanur','Çap','2003-05-15','K','5520000000', 'nisanur@gmail.com','Atatürk Mahallesi No:5','Türkiye','Kocaeli','Darıca','12345678900', 'H','678900'),
('Melike','Bulut','2006-04-28','K','5525556556', 'melke@gmail.com','Güzeller Mahallesi No:6','Türkiye','Kocaeli','Darıca','12345678901', 'H','678901'),
('Nisanur','Hacıoğlu','2020-05-15','K','5535263632', 'nisanur100@gmail.com','Çiçek Mahallesi No:5','Türkiye','Kocaeli','Darıca','12345678902', 'H','678902'),
('Kamuran','Akkor','1975-03-15','K','5548585696', 'akkor@gmail.com','Lavanta Mahallesi No:5','Türkiye','Kocaeli','Darıca','12345678903', 'H','678903'),
('Hüseyin','Tepe','2010-05-30','E','5347674985', 'hsyntepe@gmail.com','Atatürk Mahallesi No:3','Türkiye','Kocaeli','Darıca','12345678904', 'H','678904'),
('Mete','Aslan','2002-12-01','E','5342589645', 'mete@gmail.com','Atatürk Mahallesi No:8','Türkiye','Kocaeli','Darıca','12345678905', 'H','678905'),
('Neslihan','Güllü','2003-01-01','K','5685986547', 'nesli@gmail.com','Atatürk Mahallesi No:28','Türkiye','Kocaeli','Darıca','12345678906', 'H','678906'),
('Metehan','Arslan','2003-09-09','E','5545613214', 'mthn@gmail.com','Gül Mahallesi No:85','Türkiye','Kocaeli','Darıca','12345678907', 'H','678907'),
('Ahmet','Çap','2099-02-20','E','5598579874', 'ahmet@gmail.com','Hikmet Mahallesi No:90','Türkiye','Kocaeli','Darıca','12345678908', 'H','678908'),
('Veli','Çap','2018-04-25','E','5548544563', 'capVeli@gmail.com','Atatürk Mahallesi No:54','Türkiye','Kocaeli','Darıca','12345678909', 'H','678909');


INSERT INTO Tahliller (tahlilTuru, Neden, Sonuc, personelID, hastaID, Durum)
VALUES 
('Kan', 'Kan değerlerinin kontrolü', NULL, 1, 1, 'Bekleniyor'),
('İdrar', 'Enfeksiyon şüphesi kontrolü', NULL, 1, 1, 'Bekleniyor'),
('Kan', 'Rutin genel sağlık taraması', NULL, 9, 2, 'Bekleniyor'),
('İdrar', 'Böbrek fonksiyon testleri', NULL, 8, 2, 'Bekleniyor'),
('Kan', 'Kan değerlerinin kontrolü', NULL, 11, 3, 'Bekleniyor'),
('Kan', 'Demir ve B12 eksikliği kontrolü', NULL, 25, 4, 'Bekleniyor'),
('İdrar', 'Şeker (Glikoz) takibi için', NULL, 11, 3, 'Bekleniyor'),
('Kan', 'Kan değerlerinin kontrolü', NULL, 12, 5, 'Bekleniyor'),
('İdrar', 'Sıvı kaybı ve hidrasyon kontrolü', NULL, 4, 10, 'Bekleniyor'),
('Kan', 'Ameliyat öncesi rutin kan sayımı', NULL, 21, 8, 'Bekleniyor');

INSERT INTO Recete (hastaID, ilacAdi, personelID)
VALUES 
(1, 'Parol', 4),   -- Randevu 2 için
(2, 'Parol', 9),   -- Randevu 3 için
(2, 'Parol', 8),   -- Randevu 4 için
(3, 'Parol', 11),  -- Randevu 5 için
(4, 'Parol', 25),  -- Randevu 6 için
(5, 'Parol', 12),  -- Randevu 7 için
(5, 'Parol', 24),  -- Randevu 8 için
(10, 'Parol', 4),  -- Randevu 9 için
(8, 'Parol', 21);  -- Randevu 10 için