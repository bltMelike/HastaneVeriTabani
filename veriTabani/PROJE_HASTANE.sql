
CREATE DATABASE HastaneManagement;
GO

-- Yeni oluşturduğumuz boş veritabanını seçiyoruz
USE HastaneManagement;
GO

--TABLO ADLARI
--Personel
--PersonelTürü
--Hasta Adres
--Randevu
--Poliklinik
--Reçete
--Tahliller



CREATE TABLE Hasta(
hastaID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
hastaAd VARCHAR(30) NOT NULL,
hastaSoyad VARCHAR(30) NOT NULL,
hastaDgmTarih DATE NOT NULL,
hastaCinsiyet CHAR(1) NOT NULL CONSTRAINT CHK_hastaCinsiyet CHECK (hastaCinsiyet IN ('E', 'K')),
hastaTlfn VARCHAR(10) NOT NULL,
hastaEposta NVARCHAR(50) NOT NULL,
hastaAdres VARCHAR(100) NOT NULL,
hastaAdresUlke VARCHAR(50)NOT NULL,
hastaAdresil VARCHAR(50) NOT NULL,
hastaAdresilce VARCHAR(50) NOT NULL,
hastaTC VARCHAR(11) NOT NULL UNIQUE,
CONSTRAINT CHK_HastaTC CHECK (hastaTC LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
randevulumu VARCHAR(1) NOT NULL CONSTRAINT CHK_Randevulumu CHECK (randevulumu IN ('E', 'H'))
);


CREATE TABLE Poliklinik(
poliklinikID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
poliklinikAdi VARCHAR(50) NOT NULL,
);

CREATE TABLE PersonelTuru(--doktor hemşire memur
personelTuruID INT IDENTITY(1,1) NOT NULL PRIMARY KEY
);
--burada tür sütununu koymayı unuttuğumdan alter ile ekledik
ALTER TABLE PersonelTuru
ADD tur VARCHAR(20) NOT NULL;

CREATE TABLE Personel(
personelID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
personelTuruID INT,
FOREIGN KEY (personelTuruID) REFERENCES PersonelTuru(personelTuruID),
personelTC VARCHAR(11) NOT NULL UNIQUE,
personeltlfn VARCHAR(10),
poliklinikID INT,
FOREIGN KEY (poliklinikID) REFERENCES Poliklinik(poliklinikID),
maas DECIMAL(10) NOT NULL CONSTRAINT CHK_PersonelMaas CHECK (maas > 0),
uzmanlikAlani VARCHAR(30) --sadece doktorlar için gibi
);
ALTER TABLE Personel
ADD Ad VARCHAR(20) NOT NULL;
ALTER TABLE Personel
ADD Soyad VARCHAR(20) NOT NULL;
CREATE TABLE Randevu(
randevuID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
randevuTarih DATETIME NOT NULL,
randevuSaat CHAR(5) NOT NULL,CONSTRAINT CHK_RandevuSaat CHECK (randevuSaat LIKE '[0-2][0-9]:[0-5][0-9]'),
personelID INT,
FOREIGN KEY (personelID) REFERENCES Personel(personelID),
hastaID INT,
FOREIGN KEY (hastaID) REFERENCES Hasta(hastaID),
);


CREATE TABLE Recete(
receteID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
hastaID INT,
FOREIGN KEY (hastaID) REFERENCES Hasta(hastaID),
ilacAdi VARCHAR(50) NOT NULL,
personelID INT,
FOREIGN KEY (personelID) REFERENCES Personel(personelID),
);




CREATE TABLE Tahliller(
tahlilID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
tahlilTuru VARCHAR(10) NOT NULL,
Neden VARCHAR(100),
Sonuc VARCHAR(100),
hastaID INT,
FOREIGN KEY (hastaID) REFERENCES Hasta(hastaID),
personelID INT,
FOREIGN KEY (personelID) REFERENCES Personel(personelID)
);

INSERT INTO PersonelTuru  VALUES ('Doktor');
INSERT INTO PersonelTuru  VALUES ('Hemşire');
INSERT INTO PersonelTuru VALUES ('Memur');

ALTER TABLE Hasta
ADD hastaSifre VARCHAR(6) UNIQUE;

ALTER TABLE Hasta
ADD personelSifre VARCHAR(6) UNIQUE;

ALTER TABLE Randevu
ADD durum VARCHAR(5) ;

ALTER TABLE Randevu
ADD CONSTRAINT DF_Randevu_Durum DEFAULT 'Aktif' FOR durum;
GO


ALTER TABLE Hasta
ADD hastaAdres VARCHAR(100) NOT NULL,--mahalle sokak no
hastaAdresUlke VARCHAR(50)NOT NULL,
hastaAdresil VARCHAR(50) NOT NULL,
hastaAdresilce VARCHAR(50) NOT NULL;