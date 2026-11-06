# Toolnova tam site paketi — 6 Kasım 2026

Bu paket toolnova.tools içindir. TSIPracticePrep deposuna yüklemeyin. Önceki düzeltme paketinin değişiklikleri dahildir; eski paketi ayrıca uygulamak gerekmez. Canlı siteye veya GitHub'a otomatik yayın yapılmadı.

## Yükleme

1. Mevcut deponun bir yedeğini alın.
2. ZIP'i bilgisayarınızda açın. İçindeki `index.html`, diğer sayfalar ve `assets`, `tools`, `guide`, `blog` gibi klasörler site köküne aittir.
3. `gozetenhidayet/toolnova.tools` deposunda kullandığınız yayın dalını açın. Add file → Upload files ile dosyaları mevcut yapıyı koruyarak yükleyin. ZIP'i tek dosya olarak yüklemek siteyi güncellemez. GitHub tarayıcı yüklemesinin dosya sınırına ulaşırsanız klasörleri ayrı partiler halinde yükleyin veya GitHub Desktop kullanın.
4. Özellikle `index.html`, `assets/document-editor.js`, `assets/document-editor.css` ve `assets/scanner-pro.js` birlikte yayınlanmalıdır.
5. CNAME ve ads.txt mevcut depodan korunmuştur. Hosting ayarlarınızı, alan adınızı ve yayın kaynağınızı değiştirmeyin.
6. Yayın tamamlanınca sayfayı önbelleksiz yenileyin. Dosyayı doğrudan bilgisayarda çift tıklamak yerine HTTPS sitenizde deneyin; kamera ve bazı tarayıcı API'leri güvenli bağlantı ister.

## Yapılan değişiklikler

- **Sign / Add Text:** ortak çok sayfalı düzenleyici; birden çok yazı ve imza katmanı; yazılan, çizilen veya PNG/JPEG olarak yüklenen imza; font, punto, renk, kalın/italik, hizalama, tarih; sürükleme, orantılı boyutlandırma, yüzdeyle konum; çoğaltma, silme, öne getirme ve 40 adımlık geri al/ileri al. Tüm katmanlar tek PDF çıktısına eklenir. Döndürülmüş sayfalar için PDF koordinat dönüşümü kullanılır.
- **Scanner:** A4, Letter ve görsele göre boyut; yön, 150/200/300 DPI sınırı, kenar boşluğu, JPEG kalite seçimi ve dosya adı. Kırpma en-boy oranı korunur; çapraz/bozuk köşe seçimi reddedilir. OCR kelimeleri kendi konumlarına yerleştirilir; okunamayan sayfa ve font sorunları açıkça bildirilir. Küçük görseller yapay olarak büyütülmez. Önizlemeler düşük çözünürlükte tutulur.
- **Ortak dosya akışı:** değişen dosya listesinin eski sonuçları temizlenir; indirme bağlantısı oluşturulurken bağlantı DOM'a eklenir. PDF→görsel ve QR çıktılarının ortak indirme düğmesinden metin özeti yerine doğru dosya türü alınır.
- **Metin ve üreticiler:** metin dönüştürmede HTML güvenli biçimde gösterilir; üç haneli HEX desteklenir; parola seçilen karakter gruplarını içerir ve rastgele seçimde modulo yanlılığı giderilir.
- **Hesaplayıcılar:** boş/geçersiz/negatif giriş kontrolleri güçlendirildi; geçersiz vücut ölçülerinin NaN üretmesi engellendi; su hesabındaki 8 oz bardak dönüşümü düzeltildi.
- **Site geneli:** bazı sayfalardaki sürekli stil yazan gözlemciye tekrar kontrolü eklendi; eksik pdf-sign ve png-to-pdf bağlantıları mevcut sayfalara düzeltildi. Yeni belge özellikleri için üç ayrıntılı kullanım rehberi eklendi.
- **Önceki paket dahil:** araç açılış yönlendirmesi, ses kütüphanelerinin yüklenmesi, doğru MP3/WAV indirme, geciken araç yüklemeleri, PDF sayfa aralıkları, gerçekçi sıkıştırma açıklamaları, Word→PDF Unicode fontu, döviz servisi başarısız olduğunda uydurma kur kullanılmaması, mobil/fokus düzenlemeleri, canonical/sitemap ve altı kullanım rehberi.

## Testler ve sınırlar

- `node tests/regression.cjs`: 23 davranış kontrolü geçti; ana sayfadaki 12 çalıştırılabilir inline script sözdizimi doğrulandı.
- `node tests/workspaces.cjs`: 47 araç ekranının HTML üretimi, yinelenmeyen alan kimlikleri ve araç sayfası eşleştirmeleri geçti. A4/Letter/görsel boyutu ve katman sınırları kontrol edildi. 72 kök HTML sayfasındaki 194 script sözdizimi doğrulandı. Bu kontroller her aracın tüm dosya türlerinde uçtan uca çalıştığı anlamına gelmez.
- `node tests/safety.cjs`: 100 parola örneğinde karakter grupları, HTML metin güvenliği, boş sayı, geçersiz ölçü ve doğru çıktı türü kontrolleri geçti.
- Gerçek tarayıcı: dört sayfalı PDF açıldı; Türkçe karakterli katman, farklı sayfada ikinci katman, çoğaltma/geri alma ve PDF oluşturma başarılı. Scanner'da bir görselden hem OCR kapalı hem OCR açık PDF oluşturuldu; OCR açık sonuç bir sayfada metin katmanı bildirip PDF önizlemesini gösterdi.
- Bu turda PDF indirme olayını test ortamından dosya olarak alma işlemi zaman aşımına uğradı. PDF üretimi ve indirme bağlantısı görüldü; indirilen yeni PDF'nin bağımsız okuyucuda içerik/konum doğrulaması tamamlanmadı. Yayın sonrası bu adımı kontrol edin.
- Önceki doğrulama: indirim hesabı 80 ve %25 için 60 verdi. WAV→MP3 dosyası indirildi ve ffprobe ile MP3/192 kbps doğrulandı.
- Fiziksel telefon kamerası, tüm mobil tarayıcılar, şifreli/bozuk/çok büyük PDF'ler, tüm ses kodekleri ve OCR dilleri uçtan uca test edilmedi.

## Özelliklerin gerçek kapsamı

Yeni yazılar ve imzalar görsel katmandır: orijinal PDF metni korunur fakat eklenen yazı seçilebilir/aranabilir metin değildir. Türkçe karakterler tarayıcı fontuyla görsel olarak aktarılır. Sertifika tabanlı dijital imza, kimlik doğrulama ve imza denetim izi yoktur. Düzenleme oturumu sayfa kapatıldığında kaybolur; önce indirin. Scanner'daki kenar seçimi manueldir; otomatik belge kenarı tespiti yoktur. OCR, fontlar ve bazı kütüphaneler ilk kullanımda internet gerektirir. Tarayıcı belleği ve kodek desteği büyük dosyaları sınırlayabilir.

## AdSense

Bu teknik ve içerik iyileştirmeleri onay garantisi değildir. Google bütün siteyi, içerik değerini, gezinmeyi ve trafik kaynaklarını değerlendirebilir. TSI ekran görüntüsündeki ret, bu paketle otomatik olarak kaldırılmış sayılmaz.

Yeniden inceleme istemeden önce canlı sitede araçları ve bağlantıları, gerçek yayıncı/iletişim bilgilerini, gizlilik açıklamalarını ve AdSense hesabınızdaki bölgesel onay/CMP ayarlarını kontrol edin. Özgün kullanım örneklerini ve rehberleri düzenli olarak geliştirin; yapay ziyaretçi veya reklam tıklaması kullanmayın. Bu pakette AdSense hesabına inceleme isteği gönderilmedi.

Google kaynakları:
- https://support.google.com/adsense/answer/7299563?hl=en
- https://support.google.com/adsense/answer/81904?hl=en
