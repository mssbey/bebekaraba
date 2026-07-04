/**
 * prisma/blog-seed-data.ts — Demo blog yazıları (seed verisi)
 * İçerikler özgün, Türkçe ve SEO uyumlu olarak hazırlanmıştır.
 */

export interface SeedBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  faq: { question: string; answer: string }[];
  sortOrder: number;
}

export const blogSeedData: SeedBlogPost[] = [
  {
    title: 'Bebek Arabası Alırken Nelere Dikkat Edilmeli?',
    slug: 'bebek-arabasi-alirken-nelere-dikkat-edilmeli',
    category: 'rehber',
    tags: ['bebek arabası', 'satın alma rehberi', 'güvenlik'],
    featured: true,
    sortOrder: 1,
    coverImage: '/products/1.jpeg',
    excerpt:
      'Bebek arabası seçimi, doğru yapıldığında yıllarca sorunsuz kullanılan bir yatırıma dönüşür. İşte satın almadan önce kontrol etmeniz gereken 9 kritik başlık.',
    seoTitle: 'Bebek Arabası Alırken Nelere Dikkat Edilmeli? (2026 Rehberi)',
    seoDescription:
      'Bebek arabası satın alırken güvenlik, şasi, tekerlek, ağırlık ve bütçe açısından dikkat edilmesi gerekenleri anlatan detaylı rehber.',
    content: `Bebek arabası, yeni ebeveynlerin yaptığı en önemli satın almalardan biridir. Doğru seçim; bebeğinizin konforunu, güvenliğini ve sizin günlük yaşamınızın kolaylığını doğrudan etkiler. İşte karar vermeden önce gözden geçirmeniz gereken kritik noktalar.

## 1. Yaşam Tarzınıza Uygun Model Seçin

Şehir içi kısa yürüyüşler mi yapıyorsunuz, yoksa uzun parkur koşuları mı planlıyorsunuz? Toplu taşıma kullanıyorsanız hafif ve katlanabilir bir şasi, otomobille seyahat ediyorsanız oto koltuğuyla uyumlu bir travel sistem daha mantıklı olur.

## 2. Şasi ve Malzeme Kalitesi

Alüminyum şasiler hafif ve paslanmaya dayanıklıdır, uzun ömürlüdür. Şasinin katlama mekanizmasını mağazada mutlaka deneyin; tek elle katlanabilen modeller günlük kullanımda büyük kolaylık sağlar.

## 3. Tekerlek Tipi ve Süspansiyon

Kauçuk dolgulu tekerlekler şehir kaldırımlarında daha sessiz ve konforlu bir sürüş sunar. Şişme tekerlekler ise parke taşı veya toprak zeminlerde daha iyi süspansiyon sağlar ama patlama riski taşır. Süspansiyon sistemi bebeğinizin sarsıntıdan en az etkilenmesini sağlar.

## 4. Güvenlik Standartları

Avrupa'da EN 1888, satın alacağınız arabanın uyması gereken temel güvenlik normudur. 5 noktalı emniyet kemeri, çift kilitli fren sistemi ve devrilme testinden geçmiş bir şasi tercih edin.

## 5. Oturma Pozisyonu ve Yatırma Açısı

Yenidoğanlar için sırtın tam yatay pozisyona getirilebildiği modeller şarttır. Büyüyen bebekler için ise oturma açısının kademeli ayarlanabilmesi, hem uyku hem de çevreyi izleme ihtiyacını karşılar.

## 6. Ağırlık ve Taşınabilirlik

Merdivenli bir apartmanda oturuyorsanız veya sık sık araç bagajına kaldırıyorsanız arabanın toplam ağırlığı belirleyici olur. 10-12 kg aralığındaki modeller günlük kullanım için idealdir.

## 7. Depolama Alanı ve Aksesuar Uyumu

Alışveriş filesi, bardaklık, yağmurluk gibi aksesuarların arabanıza uygun olup olmadığını kontrol edin. Geniş bir alt sepet, günlük ihtiyaçlarınızı taşımak için oldukça pratiktir.

## 8. İkinci El Alımında Kontrol Listesi

İkinci el bir bebek arabası alıyorsanız şasi çatlakları, tekerlek aşınması, fren mekanizması ve kumaş yıpranmasını mutlaka kontrol edin. Güvenilir satıcılardan, bakım geçmişi belli ürünleri tercih etmek uzun vadede sizi maddi kayıptan korur.

## 9. Bütçe ve Uzun Vadeli Değer

En pahalı model her zaman en doğru seçim değildir. İhtiyacınıza uygun, kaliteli ve markası güvenilir bir ürün; hem bebeğinizin konforu hem de yeniden satış değeri açısından daha akıllıca bir tercihtir.

Bebek arabası seçimi kişisel bir karardır ama yukarıdaki kriterleri göz önünde bulundurarak hem bütçenizi hem de aile rutininizi koruyan bir seçim yapabilirsiniz.`,
    faq: [
      {
        question: 'Yeni doğan bebek için hangi tip bebek arabası uygundur?',
        answer: 'Yenidoğanlar için sırtın tam yatay pozisyona getirilebildiği, portbebe uyumlu veya 0. günden itibaren kullanılabilen travel sistem modeller en uygun seçimdir.',
      },
      {
        question: 'İkinci el bebek arabası almak güvenli mi?',
        answer: 'Şasi, fren ve tekerlek mekanizması dikkatlice kontrol edilip güvenilir bir satıcıdan alındığında ikinci el bebek arabaları gayet güvenli ve ekonomik bir tercihtir.',
      },
      {
        question: 'Bebek arabası kaç yaşına kadar kullanılabilir?',
        answer: 'Çoğu model doğumdan yaklaşık 3-4 yaşına (15-22 kg) kadar kullanılabilecek şekilde tasarlanır, ancak bu marka ve modele göre değişiklik gösterir.',
      },
    ],
  },
  {
    title: 'Travel Sistem Bebek Arabası Nedir?',
    slug: 'travel-sistem-bebek-arabasi-nedir',
    category: 'travel-sistem',
    tags: ['travel sistem', 'oto koltuğu', 'yenidoğan'],
    featured: true,
    sortOrder: 2,
    coverImage: '/products/2.jpeg',
    excerpt:
      'Travel sistem, şasi, portbebe ve oto koltuğunun birlikte çalıştığı akıllı bir sistemdir. Bebeğinizi uyandırmadan araçtan arabaya aktarmanın yollarını keşfedin.',
    seoTitle: 'Travel Sistem Bebek Arabası Nedir? Avantajları ve Seçim Rehberi',
    seoDescription:
      'Travel sistem bebek arabalarının ne olduğunu, nasıl çalıştığını ve yeni ebeveynler için neden pratik bir çözüm olduğunu anlatan kapsamlı rehber.',
    content: `Yeni ebeveynlerin en çok karşılaştığı kavramlardan biri "travel sistem"dir. Peki bu sistem tam olarak nedir ve neden bu kadar tercih edilir?

## Travel Sistem Tanımı

Travel sistem; bir şasi, bir portbebe (veya oturma ünitesi) ve bir oto koltuğunun tek bir uyumlu bütün olarak tasarlandığı bebek arabası tipidir. Adaptörler sayesinde oto koltuğu doğrudan şasiye takılabilir, böylece bebeğinizi arabadan indirmeden şasiye oturtabilirsiniz.

## Neden Tercih Edilir?

**Uykuyu bölmez:** Araçta uyuyan bebeğinizi uyandırmadan oto koltuğunu şasiye klipslemeniz yeterlidir.

**Tek yatırımla çoklu kullanım:** Doğumdan itibaren oto koltuğu, portbebe ve oturma ünitesi olmak üzere üç farklı konfigürasyonda kullanılabilir.

**Şehir ve seyahat için pratik:** Alışverişten uzun yolculuklara kadar her senaryoda aynı sistemi kullanabilirsiniz.

## Travel Sistem Bileşenleri

1. **Şasi:** Katlanabilir, tekerlekli ana gövde.
2. **Portbebe:** Yenidoğan döneminde tam yatay pozisyon sağlayan taşıma ünitesi.
3. **Oto koltuğu:** Araçta ISOFIX veya emniyet kemeriyle sabitlenen, şasiye de takılabilen güvenlik koltuğu.
4. **Adaptörler:** Oto koltuğunu şasiye bağlayan uyum parçaları.

## Satın Alırken Nelere Dikkat Edilmeli?

Marka uyumluluğuna dikkat edin — her oto koltuğu her şasiyle uyumlu değildir. Orijinal adaptörlerle satılan setler, güvenlik ve bağlantı sağlamlığı açısından daha güvenilirdir. Ayrıca oto koltuğunun yaş/kilo aralığını (genellikle 0-13 kg) kontrol edin.

## Kimler İçin İdeal?

Sık araç kullanan, uzun yolculuklar yapan veya bebeğin uyku düzenini bozmak istemeyen aileler için travel sistem neredeyse vazgeçilmezdir. İlk bebeğini bekleyen aileler için de tek seferde eksiksiz bir kurulum sunar.

Travel sistem, doğru marka ve model kombinasyonuyla hem pratiklik hem de güvenlik sağlayan, uzun vadede en verimli yatırımlardan biridir.`,
    faq: [
      {
        question: 'Travel sistem ile normal bebek arabası arasındaki fark nedir?',
        answer: 'Normal bebek arabasında sadece şasi ve oturma ünitesi bulunurken, travel sistemde ek olarak şasiyle uyumlu bir oto koltuğu ve adaptörler yer alır.',
      },
      {
        question: 'Her oto koltuğu her şasiye takılabilir mi?',
        answer: 'Hayır. Uyumluluk marka ve modele göre değişir; adaptör gerekebilir. Satın almadan önce şasi ile oto koltuğunun uyumlu olduğunu doğrulamak gerekir.',
      },
      {
        question: 'Travel sistem kaç aylık bebekler için uygundur?',
        answer: 'Travel sistemler genellikle 0. aydan itibaren, oto koltuğu ünitesiyle kullanılabilecek şekilde tasarlanır.',
      },
    ],
  },
  {
    title: 'Kabin Boy Bebek Arabası Seçme Rehberi',
    slug: 'kabin-boy-bebek-arabasi-secme-rehberi',
    category: 'rehber',
    tags: ['kabin boy', 'seyahat', 'uçak yolculuğu'],
    featured: false,
    sortOrder: 3,
    coverImage: '/products/3.jpeg',
    excerpt:
      'Sık uçak yolculuğu yapan ailelerin gözdesi kabin boy bebek arabaları hakkında bilmeniz gereken her şey: boyut sınırları, katlama mekanizması ve marka önerileri.',
    seoTitle: 'Kabin Boy Bebek Arabası Seçme Rehberi — Uçakta Yanınıza Alın',
    seoDescription:
      'Kabin boy bebek arabası nedir, hangi ölçülere uygun olmalı ve seyahat ederken nelere dikkat etmeli? Detaylı seçim rehberi.',
    content: `Uçakla seyahat eden ailelerin en büyük derdi, bebek arabasını kargoya vermeden yanlarında taşıyabilmektir. İşte tam bu ihtiyaca çözüm olarak "kabin boy" bebek arabaları devreye giriyor.

## Kabin Boy Bebek Arabası Nedir?

Kabin boy bebek arabaları, çoğu havayolunun el bagajı standartlarına uyacak şekilde (genellikle 25x35x45 cm katlanmış ölçülerde) tasarlanmış, son derece kompakt ve hafif modellerdir. Katlandığında kabin dolabına veya koltuk altına sığacak kadar küçülür.

## Neden Tercih Edilmeli?

**Bagaj hasarı riski yok:** Kargoya verilen arabalar zaman zaman hasar görebilir; kabin boy modeller bu riski ortadan kaldırır.

**Havalimanında pratiklik:** Uçağa biniş kapısına kadar bebeğinizi arabada taşıyabilir, sonrasında tek elle katlayabilirsiniz.

**Şehir kullanımı için de ideal:** Toplu taşıma, dar asansörler ve küçük araç bagajları için de mükemmel bir çözümdür.

## Seçerken Nelere Dikkat Edilmeli?

1. **Katlanmış ölçüler:** Uçuş yapacağınız havayolunun el bagajı boyut sınırlarını mutlaka kontrol edin.
2. **Katlama mekanizması:** Tek elle, hızlı ve tek hareketle katlanabilen modeller havalimanı telaşında büyük kolaylık sağlar.
3. **Ağırlık:** 7 kg altındaki modeller taşıma açısından ideal kabul edilir.
4. **Oturma açısı ve konfor:** Kompakt olsa da yatırma açısı ayarlanabilen, güneşliği olan modelleri tercih edin.
5. **Tekerlek kalitesi:** Küçük tekerlekler bazı zeminlerde daha az konforlu olabilir; kaliteli süspansiyonlu modelleri araştırın.

## Kimler İçin Uygun?

Sık seyahat eden aileler, şehir merkezinde yaşayan ve dar mekanlarda depolama sorunu yaşayan ebeveynler için kabin boy bebek arabaları ideal bir çözümdür. Ana arabanızın yanında ikinci bir "seyahat arabası" olarak da düşünülebilir.

Doğru kabin boy model, seyahatlerinizi çok daha rahat ve stressiz hale getirir.`,
    faq: [
      {
        question: 'Kabin boy bebek arabası uçağa kabinde alınabilir mi?',
        answer: 'Çoğu havayolu, katlanmış haldeki boyutları el bagajı limitlerini karşılayan kabin boy bebek arabalarının kabine alınmasına izin verir. Uçuş öncesi havayolu politikasını kontrol etmek önemlidir.',
      },
      {
        question: 'Kabin boy bebek arabası hangi yaş aralığı için uygundur?',
        answer: 'Çoğu model 6 aydan itibaren oturmaya başlayan bebekler için uygundur, ancak tam yatar pozisyona sahip bazı modeller yenidoğan döneminde de kullanılabilir.',
      },
      {
        question: 'Kabin boy modeller günlük kullanım için yeterince dayanıklı mı?',
        answer: 'Evet, kaliteli markaların kabin boy modelleri hem seyahat hem de günlük şehir kullanımı için tasarlanmıştır ve dayanıklılık açısından standart modellerden geri kalmaz.',
      },
    ],
  },
  {
    title: 'Yeni Doğan Bebek İçin Hangi Bebek Arabası Seçilmeli?',
    slug: 'yeni-dogan-bebek-icin-hangi-bebek-arabasi-secilmeli',
    category: 'rehber',
    tags: ['yenidoğan', 'portbebe', 'satın alma rehberi'],
    featured: true,
    sortOrder: 4,
    coverImage: '/products/4.jpeg',
    excerpt:
      'Yenidoğan bebeğiniz için doğru bebek arabasını seçmek omurga sağlığından güvenliğe kadar birçok faktörü etkiler. İşte bilmeniz gereken her şey.',
    seoTitle: 'Yeni Doğan Bebek İçin Hangi Bebek Arabası Seçilmeli?',
    seoDescription:
      'Yenidoğan bebekler için portbebe, travel sistem ve tam yatar modelleri karşılaştıran, doğru seçimi yapmanıza yardımcı olan rehber.',
    content: `Yeni doğan bir bebeğin kemik ve omurga yapısı henüz gelişim aşamasındadır. Bu nedenle ilk aylarda kullanılacak bebek arabası, sıradan bir konfor ürünü değil, bebeğinizin fiziksel gelişimini destekleyen bir araçtır.

## Neden Tam Yatar Pozisyon Şart?

Yenidoğanlar oturur pozisyonda taşınmamalıdır; omurgaları buna hazır değildir. Bu yüzden 0-6 ay arası için sırtın tamamen düz, yatay pozisyona getirilebildiği portbebe veya "lay-flat" (tam yatar) oturma üniteleri tercih edilmelidir.

## Portbebe mi, Tam Yatar Oturma Ünitesi mi?

**Portbebe:** Sepete benzer, kapalı ve sert tabanlı bir taşıma ünitesidir. Yenidoğanı dış etkenlerden izole eder, evden çıkmadan taşımak için de kullanılabilir.

**Tam yatar oturma ünitesi:** Şasi üzerinde sırtlığı 180 dereceye kadar yatırılabilen modellerdir. Bebek büyüdükçe kademeli olarak oturur pozisyona geçirilebilir, tek üniteyle uzun süre kullanım sağlar.

## Travel Sistem Seçeneği

Doğumdan itibaren oto koltuğuyla uyumlu bir travel sistem tercih ederseniz, hem araçta hem yürüyüşte aynı üniteyi kullanabilir, bebeğinizi hiç uyandırmadan taşıyabilirsiniz.

## Dikkat Edilmesi Gereken Diğer Noktalar

- **Havalandırma:** Portbebenin nefes alabilir kumaşlardan yapılmış olması önemlidir.
- **Güneşlik ve rüzgarlık:** Yenidoğan cildi güneşe ve soğuğa karşı çok hassastır; geniş güneşlikli modeller tercih edilmelidir.
- **Şok emici süspansiyon:** Yenidoğanın başı henüz tam desteklenmediğinden, sarsıntıyı azaltan bir süspansiyon sistemi şarttır.
- **Kolay temizlenebilir kumaş:** Yeni doğan döneminde sık kusma ve leke olayları yaşanır; çıkarılıp yıkanabilen kumaşlar büyük kolaylık sağlar.

## Sonuç

Yenidoğan için en doğru seçim, tam yatar pozisyon sunan, güvenlik sertifikalı ve büyüdükçe adapte olabilen bir sistemdir. Bu sayede hem bebeğinizin sağlıklı gelişimini destekler hem de uzun vadede yeniden yatırım yapmak zorunda kalmazsınız.`,
    faq: [
      {
        question: 'Yenidoğan bebek oturur pozisyonda bebek arabasında taşınabilir mi?',
        answer: 'Hayır, yenidoğanların omurgası oturma pozisyonuna hazır olmadığından 0-6 ay arası tam yatar pozisyon veya portbebe kullanılması önerilir.',
      },
      {
        question: 'Portbebe ne zamana kadar kullanılır?',
        answer: 'Portbebeler genellikle bebeğin desteksiz oturmaya başladığı 5-6. aya kadar, ya da üretici tarafından belirtilen kilo sınırına kadar kullanılır.',
      },
      {
        question: 'Yenidoğan için ikinci el bebek arabası almak sakıncalı mı?',
        answer: 'Şasi ve kumaş temiz, mekanizmalar sağlam olduğu sürece ikinci el bir sistem yenidoğan için de güvenle kullanılabilir; önemli olan ürünün bakımlı ve eksiksiz olmasıdır.',
      },
    ],
  },
  {
    title: 'İkiz Bebek Arabası Alırken Dikkat Edilmesi Gerekenler',
    slug: 'ikiz-bebek-arabasi-alirken-dikkat-edilmesi-gerekenler',
    category: 'ikiz',
    tags: ['ikiz araba', 'çoklu doğum', 'satın alma rehberi'],
    featured: false,
    sortOrder: 5,
    coverImage: '/products/5.jpeg',
    excerpt:
      'İkiz ya da yakın yaşta iki çocuklu ailelerin arabası, tekli modellerden çok daha farklı kriterlerle seçilmelidir. Yan yana mı, art arda mı? İşte cevaplar.',
    seoTitle: 'İkiz Bebek Arabası Alırken Dikkat Edilmesi Gerekenler',
    seoDescription:
      'İkiz bebek arabası modelleri, yan yana ve art arda tasarımların artıları eksileri, genişlik, manevra kabiliyeti ve bütçe karşılaştırması.',
    content: `İkiz bebeklere veya yaşları birbirine yakın kardeşlere sahip aileler için bebek arabası seçimi, tekli modellere göre çok daha fazla planlama gerektirir. İşte doğru kararı vermenize yardımcı olacak kriterler.

## Yan Yana mı, Art Arda mı?

**Yan yana (side-by-side) modeller:** Her iki çocuk da aynı hizada, birbirini görebilecek şekilde oturur. Genişlikleri fazladır (genelde 70-80 cm), bu da dar kapı ve asansörlerde zorluk yaratabilir. Ancak her iki koltuk da eşit görüş açısına sahiptir.

**Art arda (tandem) modeller:** Standart bir bebek arabası genişliğindedir, dar geçitlerden rahatça geçer. Ancak arkadaki çocuğun görüş alanı önündeki koltukla sınırlı kalabilir ve araba, yan yana modellere göre daha uzun olur.

## Ağırlık ve Manevra Kabiliyeti

İkiz arabalar doğal olarak tekli modellerden daha ağırdır. Kaldırma, katlama ve araç bagajına yerleştirme sıklığınızı düşünerek, ön tekerleği döner ve manevra kabiliyeti yüksek modelleri tercih edin.

## Farklı Yaştaki Kardeşler İçin

İkiz olmayan ama yaşları yakın iki çocuğunuz varsa, bir koltuğu portbebe/oturma ünitesi, diğerini büyüyen çocuk için sabit oturma modu sunan "modüler" ikiz arabalar idealdir. Bu sistemlerde her iki koltuk farklı yaş gruplarına göre ayarlanabilir.

## Depolama ve Taşıma

İkiz arabalar hem daha büyük hem daha ağır olduğundan, aracınızın bagaj hacmini ve evinizdeki depolama alanını önceden değerlendirin. Katlandığında ayakta durabilen modeller, dar antrelerde büyük kolaylık sağlar.

## Bütçe Planlaması

İkiz bebek arabaları, tekli modellere göre genellikle %40-70 daha pahalıdır. İkinci el, uzman kontrolünden geçmiş modeller; hem bütçe dostu hem de çevre dostu bir alternatif sunar.

## Sonuç

İkiz bebek arabası seçerken önceliğiniz yaşam alanınıza uygun genişlik, manevra kolaylığı ve çocuklarınızın yaş farkına uygun modülerlik olmalıdır. Doğru seçim, günlük rutininizi çok daha yönetilebilir hale getirir.`,
    faq: [
      {
        question: 'İkiz bebek arabası dar kapılardan geçer mi?',
        answer: 'Art arda (tandem) modeller standart genişlikte olduğundan dar kapı ve asansörlerden daha rahat geçer; yan yana modeller ise daha geniştir ve bu konuda dikkat gerektirir.',
      },
      {
        question: 'Yaşları farklı iki çocuk için ikiz araba kullanılabilir mi?',
        answer: 'Evet, modüler ikiz arabalarda bir koltuk portbebe/tam yatar, diğeri oturur pozisyon olacak şekilde ayarlanabildiğinden farklı yaştaki kardeşler için uygundur.',
      },
      {
        question: 'İkiz bebek arabası tek başına katlanıp taşınabilir mi?',
        answer: 'Kaliteli modellerin çoğu tek elle katlanabilir ve katlandığında ayakta durabilir, ancak toplam ağırlıkları tekli modellere göre daha fazladır.',
      },
    ],
  },
  {
    title: 'Bebek Arabası Temizliği Nasıl Yapılır?',
    slug: 'bebek-arabasi-temizligi-nasil-yapilir',
    category: 'bakim',
    tags: ['temizlik', 'bakım', 'hijyen'],
    featured: false,
    sortOrder: 6,
    coverImage: '/products/6.jpeg',
    excerpt:
      'Düzenli temizlik, bebek arabanızın hem hijyenini hem de ömrünü uzatır. Kumaştan şasiye, tekerlekten güneşliğe adım adım temizlik rehberi.',
    seoTitle: 'Bebek Arabası Temizliği Nasıl Yapılır? Adım Adım Rehber',
    seoDescription:
      'Bebek arabası kumaşı, şasisi, tekerlekleri ve güneşliğinin nasıl temizleneceğini anlatan pratik ve güvenli temizlik rehberi.',
    content: `Bebek arabası, dış ortamda en sık kullanılan ekipmanlardan biridir; toz, çamur, yiyecek lekeleri ve bakteri birikimi kaçınılmazdır. Düzenli ve doğru temizlik hem bebeğinizin sağlığını korur hem de arabanın kullanım ömrünü uzatır.

## 1. Kumaş Parçaların Temizliği

Çoğu modern bebek arabasında oturma ünitesi kumaşı çıkarılabilir. Üreticinin etiketindeki talimatlara bakın:

- Makinede yıkanabilir kumaşlar için 30°C'de, hassas programda ve narin deterjanla yıkayın.
- Çıkarılamayan kumaşlar için ise ıslak bir bez ve nötr pH'lı sabunla yerinde silme yöntemi uygulayın.
- Yıkama sonrası kumaşı doğrudan güneşte değil, gölgede asarak kurutun; renk solmasını önler.

## 2. Şasi ve Metal Aksam

Nemli bir bez ile şasideki toz ve çamuru silin. Menteşe ve katlama noktalarında biriken kiri yumuşak bir fırça ile temizleyin. Ayda bir kez hareketli eklemlere silikon bazlı (yağ bazlı değil) bir yağlayıcı uygulamak, gıcırdamayı önler ve mekanizmanın ömrünü uzatır.

## 3. Tekerlekler

Tekerlek aksları arasına sıkışan saç, ip veya küçük taşlar hem sürüşü zorlaştırır hem de mekanizmaya zarar verir. Haftada bir tekerlekleri kontrol edip aralarını temizleyin. Şişme tekerlekli modellerde hava basıncını üreticinin önerdiği seviyede tutun.

## 4. Güneşlik ve Şemsiye

Güneşlik kısmı genellikle su geçirmez kumaştan yapılır; ıslak bez ile silmek yeterlidir. Katlanır bölgelerde küf oluşmaması için tamamen kurumadan katlamayın.

## 5. Dezenfeksiyon

Kulp, tokalar ve emniyet kemeri tokası gibi sıkça el temas eden yüzeyleri haftada bir alkol bazlı olmayan bebek dezenfektanıyla silin. Bu, özellikle hastalık dönemlerinde bakteri ve virüs yayılımını azaltır.

## 6. Depolama Önerileri

Bebek arabasını uzun süre kullanmayacaksanız, tamamen kuru halde, nem almayan bir poşet veya kılıf içinde saklayın. Doğrudan güneş ışığı kumaşın rengini soldurabilir, aşırı nem ise metal aksamda paslanmaya yol açabilir.

## Ne Sıklıkla Temizlenmeli?

- **Günlük:** Görünür kir ve leke varsa hemen silin.
- **Haftalık:** Tekerlekler ve tutamaklar kontrol edilmeli.
- **Aylık:** Kumaş yıkama ve mekanizma yağlama yapılmalı.

Düzenli bakım, bebeğinizin sağlığını korurken bebek arabanızın yeniden satış değerini de yüksek tutar.`,
    faq: [
      {
        question: 'Bebek arabası kumaşı kaç derecede yıkanmalı?',
        answer: 'Üreticinin etiket talimatına bağlı olarak genellikle 30°C\'de, hassas yıkama programında ve narin bir deterjanla yıkanması önerilir.',
      },
      {
        question: 'Bebek arabası ne sıklıkla temizlenmeli?',
        answer: 'Görünür kirler hemen silinmeli, tekerlekler haftalık kontrol edilmeli, kumaş ve mekanizma bakımı ise ayda bir kez yapılmalıdır.',
      },
      {
        question: 'Bebek arabası şasisi nasıl paslanmadan korunur?',
        answer: 'Nemli ortamlarda uzun süre bekletmemek, kullanım sonrası kurulayarak saklamak ve eklem noktalarını düzenli yağlamak paslanmayı önler.',
      },
    ],
  },
];
