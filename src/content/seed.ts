/**
 * Starting content for the site, in English, Arabic and Indonesian.
 *
 * It is used in two places:
 *  1. `npm run seed:sql` turns it into supabase/seed.sql, which fills the database the first time.
 *  2. If the Supabase keys are missing (local preview), the site renders from this file.
 *
 * After the first setup, edit content from /admin, not here.
 */
import type { SiteData } from '../lib/types.ts';

const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const base = { visible: true, published: true, in_story: false, story_text: null };
/** [english, arabic?, indonesian?, level?] */
const skill = (n: number, group: number, r: string[], i: number) => ({
  id: id(n), group_id: id(group), visible: true, sort: (i + 1) * 10,
  name: { en: r[0], ...(r[1] ? { ar: r[1] } : {}), ...(r[2] ? { id: r[2] } : {}) },
  level: (r[3] === 'learning' ? 'learning' : 'demonstrated') as 'demonstrated' | 'learning'
});

export const seed: SiteData = {
  profile: {
    id: 1,
    name: { en: 'Mohammed Nasser Mijo', ar: 'محمد ناصر ميجو', id: 'Mohammed Nasser Mijo' },
    greeting: { en: "Hi, I'm Mohammed.", ar: 'مرحبًا، أنا محمد.', id: 'Halo, saya Mohammed.' },
    build_label: { en: 'I build', ar: 'أبني', id: 'Saya membangun' },
    roles: {
      en: ['on-device AI', 'computer vision apps', 'Flutter mobile apps', 'LLM-powered features'],
      ar: ['ذكاءً اصطناعيًا يعمل على الجهاز', 'تطبيقات رؤية حاسوبية', 'تطبيقات جوال بـ Flutter', 'ميزات بالنماذج اللغوية'],
      id: ['AI di perangkat', 'aplikasi computer vision', 'aplikasi mobile Flutter', 'fitur berbasis LLM']
    },
    status: { en: 'Open to AI / ML internships', ar: 'متاح لفرص التدريب في الذكاء الاصطناعي وتعلّم الآلة', id: 'Terbuka untuk magang AI / ML' },
    available: true,
    lead: {
      en: "I'm an Information Technology student at UIN Salatiga, Indonesia, originally from Yemen. I train machine learning models and ship them inside mobile apps, and I serve as Secretary General of the Yemeni Students Union in Indonesia.",
      ar: 'طالب تقنية معلومات في جامعة UIN سالاتيغا بإندونيسيا، من اليمن. أدرّب نماذج تعلّم الآلة وأدمجها في تطبيقات الجوال، وأشغل منصب الأمين العام لاتحاد الطلاب اليمنيين في إندونيسيا.',
      id: 'Saya mahasiswa Teknologi Informasi di UIN Salatiga, Indonesia, berasal dari Yaman. Saya melatih model machine learning dan menerapkannya di aplikasi mobile, serta menjabat sebagai Sekretaris Jenderal Persatuan Pelajar Yaman di Indonesia.'
    },
    about: {
      en: "I'm an Information Technology student at UIN Salatiga in Central Java, Indonesia, and I come from Yemen. Most of what I build sits where AI meets mobile apps: models I train and run on the phone, and LLM features I integrate into Flutter apps.\n\nWith SignSense I took a model from dataset to phone: hand landmarks extracted with MediaPipe, a TensorFlow classifier evaluated on a held-out test set, and a TensorFlow Lite model running inside a Flutter app. With FarmGuardAI I built, on my own, an app that uses the Gemini API to help farmers spot crop and livestock problems early.\n\nAlongside my studies I serve as Secretary General of the Yemeni Students Union in Indonesia, after a year leading its media office. Next, I want to measure how my models perform with real users, and deploy AI features through APIs and cloud services.",
      ar: 'أدرس تقنية المعلومات في جامعة UIN سالاتيغا بجاوة الوسطى في إندونيسيا، وأنا من اليمن. معظم ما أبنيه يقع حيث يلتقي الذكاء الاصطناعي بتطبيقات الجوال: نماذج أدرّبها وأشغّلها على الهاتف، وميزات تعتمد على النماذج اللغوية أدمجها في تطبيقات Flutter.\n\nفي SignSense نقلت النموذج من البيانات إلى الهاتف: استخرجت نقاط اليد باستخدام MediaPipe، ودرّبت مصنّفًا بـ TensorFlow وقيّمته على بيانات اختبار منفصلة، ثم شغّلته بصيغة TensorFlow Lite داخل تطبيق Flutter. وفي FarmGuardAI بنيت وحدي تطبيقًا يستخدم Gemini API ليساعد المزارعين على اكتشاف مشكلات المحاصيل والمواشي مبكرًا.\n\nإلى جانب دراستي أشغل منصب الأمين العام لاتحاد الطلاب اليمنيين في إندونيسيا، بعد عام في رئاسة مكتبه الإعلامي. خطوتي التالية أن أقيس أداء نماذجي مع مستخدمين حقيقيين، وأن أنشر ميزات الذكاء الاصطناعي عبر واجهات برمجية وخدمات سحابية.',
      id: 'Saya mahasiswa Teknologi Informasi di UIN Salatiga, Jawa Tengah, Indonesia, dan saya berasal dari Yaman. Sebagian besar yang saya bangun berada di pertemuan AI dan aplikasi mobile: model yang saya latih dan jalankan di ponsel, serta fitur berbasis LLM yang saya integrasikan ke aplikasi Flutter.\n\nLewat SignSense saya membawa model dari dataset sampai ke ponsel: titik tangan diekstrak dengan MediaPipe, classifier TensorFlow dievaluasi pada data uji terpisah, lalu dijalankan sebagai TensorFlow Lite di dalam aplikasi Flutter. Lewat FarmGuardAI saya membangun sendiri aplikasi yang memakai Gemini API untuk membantu petani mendeteksi masalah tanaman dan ternak lebih awal.\n\nDi samping kuliah, saya menjabat sebagai Sekretaris Jenderal Persatuan Pelajar Yaman di Indonesia, setelah setahun memimpin kantor medianya. Langkah berikutnya: mengukur kinerja model saya bersama pengguna nyata, dan menerapkan fitur AI melalui API dan layanan cloud.'
    },
    facts: {
      en: ['Based in Salatiga, Central Java, Indonesia', "Bachelor's in Information Technology, UIN Salatiga (expected 2028)", 'Secretary General, Yemeni Students Union in Indonesia', 'Focus: computer vision, on-device ML and LLM apps'],
      ar: ['مقيم في سالاتيغا، جاوة الوسطى، إندونيسيا', 'بكالوريوس تقنية المعلومات، UIN سالاتيغا (التخرّج المتوقّع 2028)', 'الأمين العام لاتحاد الطلاب اليمنيين في إندونيسيا', 'التركيز: الرؤية الحاسوبية، وتعلّم الآلة على الجهاز، وتطبيقات النماذج اللغوية'],
      id: ['Tinggal di Salatiga, Jawa Tengah, Indonesia', 'S1 Teknologi Informasi, UIN Salatiga (perkiraan lulus 2028)', 'Sekretaris Jenderal Persatuan Pelajar Yaman di Indonesia', 'Fokus: computer vision, ML di perangkat, dan aplikasi LLM']
    },
    languages: {
      en: ['Arabic: native', 'Indonesian: advanced', 'English: advanced'],
      ar: ['العربية: اللغة الأم', 'الإندونيسية: متقدّم', 'الإنجليزية: متقدّم'],
      id: ['Bahasa Arab: bahasa ibu', 'Bahasa Indonesia: mahir', 'Bahasa Inggris: mahir']
    },
    location: { en: 'Salatiga, Indonesia', ar: 'سالاتيغا، إندونيسيا', id: 'Salatiga, Indonesia' },
    email: 'mmyjw48@gmail.com',
    whatsapp: '6285385122793',
    phone_display: '+62 853-8512-2793',
    linkedin_url: 'https://www.linkedin.com/in/mohammed-nasser-mijo-a654a2343/',
    github_url: 'https://github.com/mmyjw48-web',
    photo_url: '/images/mohammed.webp',
    cv_url: null,
    contact_title: { en: "Building something with AI? Let's talk.", ar: 'تبني شيئًا بالذكاء الاصطناعي؟ لنتحدّث.', id: 'Sedang membangun sesuatu dengan AI? Mari bicara.' },
    contact_sub: { en: 'I reply in English, Arabic or Indonesian.', ar: 'أردّ بالعربية أو الإنجليزية أو الإندونيسية.', id: 'Saya membalas dalam bahasa Indonesia, Inggris, atau Arab.' },
    seo_title: { en: 'Mohammed Nasser Mijo · AI & mobile apps', ar: 'محمد ناصر ميجو · الذكاء الاصطناعي وتطبيقات الجوال', id: 'Mohammed Nasser Mijo · AI & aplikasi mobile' },
    seo_description: {
      en: 'IT student at UIN Salatiga building computer vision and LLM-powered mobile apps. Projects, experience, awards and contact.',
      ar: 'طالب تقنية معلومات في UIN سالاتيغا يبني تطبيقات جوال تعتمد على الرؤية الحاسوبية والنماذج اللغوية. المشاريع والخبرات والجوائز ووسائل التواصل.',
      id: 'Mahasiswa TI di UIN Salatiga yang membangun aplikasi mobile berbasis computer vision dan LLM. Proyek, pengalaman, prestasi, dan kontak.'
    }
  },

  sections: [
    { key: 'about', sort: 10, visible: true, title: { en: 'About', ar: 'عن نفسي', id: 'Tentang saya' }, subtitle: { en: 'Where AI meets the phone in your pocket.', ar: 'حيث يلتقي الذكاء الاصطناعي بالهاتف في جيبك.', id: 'Tempat AI bertemu ponsel di saku Anda.' } },
    { key: 'projects', sort: 20, visible: true, title: { en: 'Projects', ar: 'المشاريع', id: 'Proyek' }, subtitle: { en: 'Behind every door, something I built.', ar: 'خلف كل باب، شيء صنعته.', id: 'Di balik setiap pintu, ada yang saya bangun.' } },
    { key: 'experience', sort: 30, visible: true, title: { en: 'Experience', ar: 'الخبرة', id: 'Pengalaman' }, subtitle: { en: "Roles I've held, and what I did in them.", ar: 'المناصب التي شغلتها وما أنجزته فيها.', id: 'Peran yang pernah saya jalani dan apa yang saya kerjakan.' } },
    { key: 'leadership', sort: 40, visible: true, title: { en: 'Leadership & Activities', ar: 'القيادة والأنشطة', id: 'Kepemimpinan & Kegiatan' }, subtitle: { en: 'Delegations, programs and conferences.', ar: 'وفود وبرامج ومؤتمرات.', id: 'Delegasi, program, dan konferensi.' } },
    { key: 'achievements', sort: 50, visible: true, title: { en: 'Achievements & Certifications', ar: 'الإنجازات والشهادات', id: 'Prestasi & Sertifikat' }, subtitle: { en: "Awards I've won and programs I've completed.", ar: 'جوائز فزت بها وبرامج أتممتها.', id: 'Penghargaan yang saya raih dan program yang saya selesaikan.' } },
    { key: 'skills', sort: 60, visible: true, title: { en: 'Technical Skills', ar: 'المهارات التقنية', id: 'Keterampilan Teknis' }, subtitle: { en: "What I use, and what I'm learning next.", ar: 'ما أستخدمه، وما أتعلّمه الآن.', id: 'Yang saya gunakan, dan yang sedang saya pelajari.' } },
    { key: 'education', sort: 70, visible: true, title: { en: 'Education', ar: 'التعليم', id: 'Pendidikan' }, subtitle: { en: 'Where I study and what I study.', ar: 'أين أدرس وماذا أدرس.', id: 'Tempat dan bidang studi saya.' } },
    { key: 'story', sort: 80, visible: true, title: { en: 'My story', ar: 'قصتي', id: 'Kisah saya' }, subtitle: { en: "Let's go back in time.", ar: 'لنعد بالزمن إلى الوراء.', id: 'Mari kembali ke masa lalu.' } },
    { key: 'contact', sort: 90, visible: true, title: { en: 'Contact', ar: 'تواصل', id: 'Kontak' }, subtitle: { en: 'Available for internships and collaborations', ar: 'متاح لفرص التدريب والتعاون', id: 'Terbuka untuk magang dan kolaborasi' } }
  ],

  doors: [
    { id: 'ai', style: 'ai', color: 'ruby', kind: 'projects', sort: 10, visible: true,
      name: { en: 'AI & Vision', ar: 'الذكاء الاصطناعي والرؤية', id: 'AI & Visi Komputer' },
      intro: { en: 'Models I trained or integrated, and the apps they run in.', ar: 'نماذج درّبتها أو دمجتها، والتطبيقات التي تعمل فيها.', id: 'Model yang saya latih atau integrasikan, dan aplikasi tempat model itu berjalan.' } },
    { id: 'mobile', style: 'mobile', color: 'cobalt', kind: 'projects', sort: 20, visible: true,
      name: { en: 'Mobile Apps', ar: 'تطبيقات الجوال', id: 'Aplikasi Mobile' },
      intro: { en: 'Flutter apps, from solo builds to team prototypes.', ar: 'تطبيقات Flutter، من مشاريع فردية إلى نماذج أولية مع فرق.', id: 'Aplikasi Flutter, dari proyek mandiri hingga prototipe tim.' } },
    { id: 'web', style: 'web', color: 'emerald', kind: 'projects', sort: 30, visible: true,
      name: { en: 'Web', ar: 'الويب', id: 'Web' },
      intro: { en: 'Web projects, including an award-winning plastic-free store.', ar: 'مشاريع ويب، منها متجر بلا بلاستيك فاز بجائزة.', id: 'Proyek web, termasuk toko tanpa plastik yang meraih juara.' } },
    { id: 'leadership', style: 'leadership', color: 'saffron', kind: 'leadership', sort: 40, visible: true,
      name: { en: 'Leadership & Media', ar: 'القيادة والإعلام', id: 'Kepemimpinan & Media' },
      intro: { en: 'Roles and programs where I led, organized and communicated.', ar: 'مناصب وبرامج قُدت فيها ونظّمت وتواصلت.', id: 'Peran dan program tempat saya memimpin, mengorganisasi, dan berkomunikasi.' } }
  ],

  projects: [
    { ...base, id: id(101), slug: 'signsense', sort: 10, featured: true, doors: ['ai', 'mobile'], status: 'completed', visual: 'hand',
      title: { en: 'SignSense', ar: 'SignSense', id: 'SignSense' },
      tagline: { en: 'ASL alphabet recognition with on-device AI', ar: 'التعرّف على أبجدية لغة الإشارة الأمريكية بذكاء اصطناعي يعمل على الجهاز', id: 'Pengenalan alfabet ASL dengan AI di perangkat' },
      summary: {
        en: 'Learners practice ASL letters and get instant feedback from the camera or a photo. MediaPipe extracts 21 hand landmarks, and a neural network I trained classifies them into 28 classes, running offline as TensorFlow Lite with a confidence score.',
        ar: 'يتدرّب المتعلّم على حروف لغة الإشارة الأمريكية ويحصل على تقييم فوري من الكاميرا أو من صورة. يستخرج MediaPipe 21 نقطة من اليد، ثم تصنّفها شبكة عصبية درّبتها إلى 28 فئة، وتعمل دون إنترنت بصيغة TensorFlow Lite مع نسبة ثقة لكل توقّع.',
        id: 'Pengguna berlatih huruf ASL dan langsung mendapat umpan balik dari kamera atau foto. MediaPipe mengekstrak 21 titik tangan, lalu jaringan saraf yang saya latih mengklasifikasikannya ke 28 kelas, berjalan offline sebagai TensorFlow Lite dengan skor keyakinan.'
      },
      body: {
        en: "Practicing sign language alone is hard, because nobody tells you whether a sign is right. SignSense is a Flutter app with an A–Z learning section and a recognition screen that works with the camera or an uploaded photo.\n\nInstead of classifying the whole image, the app first finds 21 hand landmarks with MediaPipe, turns them into 63 numbers (x, y, z for each point), normalizes them relative to the wrist, and passes them to a small neural network that runs on the phone as TensorFlow Lite. That keeps the model tiny, fast and usable offline.",
        ar: 'التدرّب على لغة الإشارة وحدك صعب، لأن لا أحد يخبرك إن كانت الإشارة صحيحة. SignSense تطبيق Flutter فيه قسم لتعلّم الحروف من A إلى Z، وشاشة للتعرّف على الإشارة من الكاميرا أو من صورة مرفوعة.\n\nبدل تصنيف الصورة كاملة، يحدّد التطبيق أولًا 21 نقطة على اليد باستخدام MediaPipe، ويحوّلها إلى 63 رقمًا (x وy وz لكل نقطة)، ثم يطبّعها نسبةً إلى المعصم، ويمرّرها إلى شبكة عصبية صغيرة تعمل على الهاتف بصيغة TensorFlow Lite. بهذا يبقى النموذج صغيرًا وسريعًا ويعمل دون إنترنت.',
        id: 'Berlatih bahasa isyarat sendirian itu sulit, karena tidak ada yang memberi tahu apakah isyarat Anda benar. SignSense adalah aplikasi Flutter dengan bagian belajar A–Z dan layar pengenalan yang bekerja dengan kamera atau foto yang diunggah.\n\nAlih-alih mengklasifikasikan seluruh gambar, aplikasi ini terlebih dahulu menemukan 21 titik tangan dengan MediaPipe, mengubahnya menjadi 63 angka (x, y, z untuk setiap titik), menormalkannya terhadap pergelangan tangan, lalu meneruskannya ke jaringan saraf kecil yang berjalan di ponsel sebagai TensorFlow Lite. Hasilnya model kecil, cepat, dan bisa dipakai offline.'
      },
      contribution: {
        en: ['Extracted hand landmarks from the Kaggle ASL Alphabet dataset with MediaPipe and built a 12,496-sample feature set across 28 classes', 'Trained a TensorFlow/Keras network with class weights, early stopping and a stratified 70/15/15 split: 99.5% accuracy on 1,875 held-out test samples', 'Converted the model to a 235 KB TensorFlow Lite file, checked it before export, and integrated it with tflite_flutter', 'Connected MediaPipe on Android to Flutter through a Kotlin MethodChannel, with a hand-skeleton overlay and confidence scores'],
        ar: ['استخرجت نقاط اليد من مجموعة بيانات ASL Alphabet في Kaggle باستخدام MediaPipe، وبنيت 12,496 عيّنة موزّعة على 28 فئة', 'درّبت شبكة TensorFlow/Keras مع أوزان للفئات وإيقاف مبكر وتقسيم 70/15/15 متوازن: دقة 99.5% على 1,875 عيّنة اختبار منفصلة', 'حوّلت النموذج إلى ملف TensorFlow Lite بحجم 235 KB، وتحقّقت منه قبل التصدير، ودمجته عبر tflite_flutter', 'ربطت MediaPipe على أندرويد بتطبيق Flutter عبر Kotlin MethodChannel، مع رسم هيكل اليد ونسبة الثقة'],
        id: ['Mengekstrak titik tangan dari dataset Kaggle ASL Alphabet dengan MediaPipe dan membangun 12.496 sampel fitur di 28 kelas', 'Melatih jaringan TensorFlow/Keras dengan class weight, early stopping, dan pembagian 70/15/15 terstratifikasi: akurasi 99,5% pada 1.875 sampel uji terpisah', 'Mengonversi model menjadi file TensorFlow Lite 235 KB, mengujinya sebelum ekspor, dan mengintegrasikannya dengan tflite_flutter', 'Menghubungkan MediaPipe di Android ke Flutter melalui Kotlin MethodChannel, dengan overlay kerangka tangan dan skor keyakinan']
      },
      team: null, award: null, start_date: '2026-05-01', end_date: '2026-06-01', date_precision: 'month',
      stack: ['Python', 'TensorFlow / Keras', 'TensorFlow Lite', 'MediaPipe', 'scikit-learn', 'pandas', 'Flutter', 'Riverpod', 'Kotlin'],
      metrics: [
        { value: { en: '99.5%', ar: '99.5%', id: '99,5%' }, label: { en: 'test accuracy', ar: 'دقة الاختبار', id: 'akurasi uji' } },
        { value: { en: '28', ar: '28', id: '28' }, label: { en: 'classes (A–Z, space, delete)', ar: 'فئة (A–Z، مسافة، حذف)', id: 'kelas (A–Z, spasi, hapus)' } },
        { value: { en: '12,496', ar: '12,496', id: '12.496' }, label: { en: 'training samples', ar: 'عيّنة تدريب', id: 'sampel pelatihan' } },
        { value: { en: '235 KB', ar: '235 KB', id: '235 KB' }, label: { en: 'TensorFlow Lite model', ar: 'حجم نموذج TensorFlow Lite', id: 'model TensorFlow Lite' } }
      ],
      repo_url: 'https://github.com/mmyjw48-web/sign-language-app', demo_url: null, cover_url: null, gallery: [],
      in_story: true, story_text: { en: 'Built SignSense: a TensorFlow Lite model inside a Flutter app', ar: 'بنيت SignSense: نموذج TensorFlow Lite داخل تطبيق Flutter', id: 'Membangun SignSense: model TensorFlow Lite di dalam aplikasi Flutter' } },

    { ...base, id: id(102), slug: 'farmguardai', sort: 20, featured: false, doors: ['ai', 'mobile'], status: 'prototype', visual: 'auto',
      title: { en: 'FarmGuardAI', ar: 'FarmGuardAI', id: 'FarmGuardAI' },
      tagline: { en: 'AI assistant for crop and livestock health', ar: 'مساعد ذكي لصحة المحاصيل والمواشي', id: 'Asisten AI untuk kesehatan tanaman dan ternak' },
      summary: {
        en: "Detects plant diseases from leaf photos, suggests possible livestock diagnoses from the animal's type, age and how long it has been sick, and recommends treatment or a vet visit. The MVP uses the Gemini API; the next step is models trained on labeled agricultural data.",
        ar: 'يكتشف أمراض النباتات من صور الأوراق، ويقترح تشخيصات محتملة للمواشي بناءً على نوع الحيوان وعمره ومدة مرضه، ويوصي بالعلاج أو بزيارة الطبيب البيطري. تعتمد النسخة الأولى على Gemini API، والخطوة التالية نماذج مدرّبة على بيانات زراعية مصنّفة.',
        id: 'Mendeteksi penyakit tanaman dari foto daun, menyarankan kemungkinan diagnosis ternak berdasarkan jenis, umur, dan lama sakit hewan, serta merekomendasikan pengobatan atau kunjungan ke dokter hewan. MVP ini memakai Gemini API; langkah berikutnya adalah model yang dilatih dengan data pertanian berlabel.'
      },
      body: {
        en: 'Crop and livestock diseases are often spotted late, and many farmers have little access to agricultural or veterinary experts. FarmGuardAI puts a first opinion in their pocket. The project is built around SDG 2 (Zero Hunger).\n\nThis version uses the Gemini API to validate the idea and the workflow quickly. The plan is to replace it with dedicated models trained on real, labeled agricultural data.',
        ar: 'كثيرًا ما تُكتشف أمراض المحاصيل والمواشي متأخرة، ولا يصل كثير من المزارعين إلى خبراء زراعيين أو أطباء بيطريين. يضع FarmGuardAI رأيًا أوليًا في جيب المزارع، وهو مبني حول الهدف الثاني من أهداف التنمية المستدامة (القضاء على الجوع).\n\nتستخدم هذه النسخة Gemini API للتحقق من الفكرة وسير العمل بسرعة، والخطة استبداله بنماذج مخصّصة مدرّبة على بيانات زراعية حقيقية ومصنّفة.',
        id: 'Penyakit tanaman dan ternak sering terdeteksi terlambat, dan banyak petani sulit menjangkau ahli pertanian atau dokter hewan. FarmGuardAI memberi pendapat awal langsung di saku mereka. Proyek ini dibangun di sekitar SDG 2 (Tanpa Kelaparan).\n\nVersi ini memakai Gemini API untuk menguji ide dan alur kerja dengan cepat. Rencananya, Gemini akan diganti dengan model khusus yang dilatih pada data pertanian nyata dan berlabel.'
      },
      contribution: {
        en: ['Built the whole app on my own in Flutter, with Riverpod and GoRouter', "Plant disease detection from leaf photos, and livestock diagnosis from the animal's type, age and illness duration, with risk levels and next steps", 'An AI chat assistant for farming questions, powered by the Gemini API', 'Firebase Authentication and Cloud Firestore for accounts and data'],
        ar: ['بنيت التطبيق كاملًا وحدي بـ Flutter مع Riverpod وGoRouter', 'كشف أمراض النبات من صور الأوراق، وتشخيص المواشي حسب نوع الحيوان وعمره ومدة مرضه، مع مستوى الخطورة والخطوات التالية', 'مساعد محادثة ذكي للأسئلة الزراعية يعمل بـ Gemini API', 'Firebase Authentication وCloud Firestore للحسابات والبيانات'],
        id: ['Membangun seluruh aplikasi sendiri dengan Flutter, Riverpod, dan GoRouter', 'Deteksi penyakit tanaman dari foto daun, dan diagnosis ternak berdasarkan jenis, umur, dan lama sakit, lengkap dengan tingkat risiko dan langkah berikutnya', 'Asisten chat AI untuk pertanyaan pertanian, ditenagai Gemini API', 'Firebase Authentication dan Cloud Firestore untuk akun dan data']
      },
      team: { en: 'Solo', ar: 'فردي', id: 'Mandiri' }, award: null, start_date: '2026-06-01', end_date: '2026-07-01', date_precision: 'month',
      stack: ['Flutter', 'Dart', 'Gemini API', 'Firebase', 'Riverpod', 'GoRouter'], metrics: [],
      repo_url: 'https://github.com/mmyjw48-web/FarmGuardAI', demo_url: null, cover_url: null, gallery: [],
      in_story: true, story_text: { en: 'Built FarmGuardAI on my own with the Gemini API', ar: 'بنيت FarmGuardAI وحدي باستخدام Gemini API', id: 'Membangun FarmGuardAI sendiri dengan Gemini API' } },

    { ...base, id: id(103), slug: 'skillbridge-oman', sort: 30, featured: false, doors: ['ai'], status: 'hackathon', visual: 'monitor',
      title: { en: 'SkillBridge Oman', ar: 'SkillBridge Oman', id: 'SkillBridge Oman' },
      tagline: { en: 'Evidence-based skill matching for junior tech roles', ar: 'مطابقة المهارات بالأدلة لوظائف التقنية للمبتدئين', id: 'Pencocokan kompetensi berbasis bukti untuk posisi teknologi junior' },
      summary: {
        en: 'Compares an English CV with a real junior job description and weighs the evidence for each skill: demonstrated, claimed, not enough evidence, or missing, instead of only matching keywords.',
        ar: 'يقارن سيرة ذاتية بالإنجليزية بوصف وظيفة حقيقية للمبتدئين، ويزن الأدلة على كل مهارة: مثبتة، أو مُدّعاة، أو بلا أدلة كافية، أو غائبة، بدل الاكتفاء بمطابقة الكلمات المفتاحية.',
        id: 'Membandingkan CV berbahasa Inggris dengan deskripsi pekerjaan junior yang nyata dan menimbang bukti setiap keterampilan: terbukti, diklaim, bukti kurang, atau tidak ada, bukan sekadar mencocokkan kata kunci.'
      },
      body: {
        en: 'A candidate-facing MVP built for a hackathon. It reads an English CV next to a real junior technology job description and sorts every competency by the strength of its evidence.',
        ar: 'نموذج أولي موجّه للمتقدّمين للوظائف، بُني في هاكاثون. يقرأ سيرة ذاتية بالإنجليزية إلى جانب وصف وظيفة تقنية حقيقية للمبتدئين، ويصنّف كل مهارة حسب قوة الأدلة عليها.',
        id: 'MVP untuk pencari kerja yang dibuat dalam hackathon. Aplikasi ini membaca CV berbahasa Inggris berdampingan dengan deskripsi pekerjaan teknologi junior yang nyata, lalu mengelompokkan setiap kompetensi berdasarkan kekuatan buktinya.'
      },
      contribution: { en: [], ar: [], id: [] },
      team: { en: 'Team', ar: 'فريق', id: 'Tim' }, award: null, start_date: null, end_date: null, date_precision: 'month',
      stack: [], metrics: [], repo_url: null, demo_url: null, cover_url: null, gallery: [] },

    { ...base, id: id(104), slug: 'smart-student-uin-salatiga', sort: 40, featured: false, doors: ['mobile'], status: 'prototype', visual: 'auto',
      title: { en: 'Smart Student UIN Salatiga', ar: 'Smart Student UIN Salatiga', id: 'Smart Student UIN Salatiga' },
      tagline: { en: 'Digital services app for UIN Salatiga students', ar: 'تطبيق خدمات رقمية لطلاب UIN سالاتيغا', id: 'Aplikasi layanan digital untuk mahasiswa UIN Salatiga' },
      summary: {
        en: 'A team prototype of a university services app. My part: reminders, KRS document handling with email delivery, GPA history, Arabic-language support, navigation improvements and testing.',
        ar: 'نموذج أولي لتطبيق خدمات جامعية بنيناه كفريق. الجزء الذي نفّذته: التذكيرات، ومعالجة مستندات KRS وإرسالها بالبريد، وسجل المعدّل، ودعم اللغة العربية، وتحسين التنقّل، والاختبار.',
        id: 'Prototipe tim untuk aplikasi layanan kampus. Bagian saya: pengingat, pengelolaan dokumen KRS dengan pengiriman email, riwayat IPK, dukungan bahasa Arab, perbaikan navigasi, dan pengujian.'
      },
      body: { en: '', ar: '', id: '' },
      contribution: {
        en: ['Reminders', 'KRS document handling with email delivery', 'GPA history', 'Arabic-language support', 'Navigation improvements and testing'],
        ar: ['التذكيرات', 'معالجة مستندات KRS وإرسالها بالبريد', 'سجل المعدّل', 'دعم اللغة العربية', 'تحسين التنقّل والاختبار'],
        id: ['Pengingat', 'Pengelolaan dokumen KRS dengan pengiriman email', 'Riwayat IPK', 'Dukungan bahasa Arab', 'Perbaikan navigasi dan pengujian']
      },
      team: { en: 'Team', ar: 'فريق', id: 'Tim' }, award: null, start_date: '2026-04-01', end_date: '2026-06-01', date_precision: 'month',
      stack: ['Flutter', 'Dart'], metrics: [], repo_url: 'https://github.com/mmyjw48-web/Smart-Student-UIN-Salatiga', demo_url: null, cover_url: null, gallery: [] },

    { ...base, id: id(105), slug: 'layananku', sort: 50, featured: false, doors: ['mobile'], status: 'concept', visual: 'auto',
      title: { en: 'LayananKu', ar: 'LayananKu', id: 'LayananKu' },
      tagline: { en: 'One app for Indonesian public services', ar: 'تطبيق واحد للخدمات الحكومية في إندونيسيا', id: 'Satu aplikasi untuk layanan publik Indonesia' },
      summary: {
        en: 'A product concept and Flutter prototype that brings several public-service areas into one role-based mobile experience, planned as a bilingual, Android-first app.',
        ar: 'فكرة منتج ونموذج أولي بـ Flutter يجمع عدة مجالات للخدمات العامة في تجربة جوال واحدة حسب دور المستخدم، ومخطط له أن يكون ثنائي اللغة ويبدأ بأندرويد.',
        id: 'Konsep produk dan prototipe Flutter yang menyatukan beberapa layanan publik dalam satu pengalaman mobile berbasis peran, direncanakan dua bahasa dan Android-first.'
      },
      body: { en: '', ar: '', id: '' }, contribution: { en: [], ar: [], id: [] },
      team: null, award: null, start_date: null, end_date: null, date_precision: 'month',
      stack: ['Flutter'], metrics: [], repo_url: null, demo_url: null, cover_url: null, gallery: [] },

    { ...base, id: id(106), slug: 'lestari-tani', sort: 60, featured: false, doors: ['web'], status: 'completed', visual: 'auto',
      title: { en: 'Lestari Tani', ar: 'Lestari Tani', id: 'Lestari Tani' },
      tagline: { en: 'Plastic-free store for local products', ar: 'متجر إلكتروني لمنتجات محلية بلا بلاستيك', id: 'Toko daring produk lokal tanpa plastik' },
      summary: {
        en: 'An online store that sells local products without plastic packaging, to protect the environment and support local producers. Won 3rd place in Web Development at INTECHFEST 2026, UIN Salatiga.',
        ar: 'متجر إلكتروني يبيع المنتجات المحلية دون تغليف بلاستيكي، ليحمي البيئة ويدعم المنتجين المحليين. حصل على المركز الثالث في فئة تطوير الويب في INTECHFEST 2026 بجامعة UIN سالاتيغا.',
        id: 'Toko daring yang menjual produk lokal tanpa kemasan plastik untuk menjaga lingkungan dan mendukung produsen lokal. Meraih Juara 3 Web Development di INTECHFEST 2026, UIN Salatiga.'
      },
      body: { en: '', ar: '', id: '' }, contribution: { en: [], ar: [], id: [] },
      team: { en: 'With Ibrahim Hassan', ar: 'مع إبراهيم حسن', id: 'Bersama Ibrahim Hassan' },
      award: { en: '3rd place · INTECHFEST 2026', ar: 'المركز الثالث · INTECHFEST 2026', id: 'Juara 3 · INTECHFEST 2026' },
      start_date: '2026-01-01', end_date: null, date_precision: 'year',
      stack: [], metrics: [], repo_url: null, demo_url: null, cover_url: null, gallery: [] },

    { ...base, id: id(107), slug: 'tasks-management', sort: 70, featured: false, doors: ['web'], status: 'completed', visual: 'auto',
      title: { en: 'Tasks Management', ar: 'Tasks Management', id: 'Tasks Management' },
      tagline: { en: 'Task tracking web app', ar: 'تطبيق ويب لتنظيم المهام', id: 'Aplikasi web pengelola tugas' },
      summary: { en: 'Helps users organize and track their daily tasks in one place.', ar: 'يساعد المستخدم على تنظيم مهامه اليومية ومتابعتها في مكان واحد.', id: 'Membantu pengguna mengatur dan memantau tugas harian di satu tempat.' },
      body: { en: '', ar: '', id: '' }, contribution: { en: [], ar: [], id: [] },
      team: null, award: null, start_date: null, end_date: null, date_precision: 'month',
      stack: [], metrics: [], repo_url: null, demo_url: null, cover_url: null, gallery: [] }
  ],

  experiences: [
    { ...base, id: id(201), sort: 10, in_door: true,
      title: { en: 'Secretary General, 5th term', ar: 'الأمين العام، الدورة الخامسة', id: 'Sekretaris Jenderal, periode ke-5' },
      org: { en: 'Yemeni Students Union in Indonesia', ar: 'اتحاد الطلاب اليمنيين في إندونيسيا', id: 'Persatuan Pelajar Yaman di Indonesia' },
      employment_type: { en: 'Part-time · Remote', ar: 'دوام جزئي · عن بُعد', id: 'Paruh waktu · Jarak jauh' },
      location: { en: 'Indonesia', ar: 'إندونيسيا', id: 'Indonesia' },
      start_date: '2026-05-01', end_date: '2027-05-01', is_current: true, date_precision: 'month',
      summary: { en: "Responsible for the union's executive administration for the 2026–2027 term.", ar: 'مسؤول عن الإدارة التنفيذية للاتحاد في دورة 2026–2027.', id: 'Bertanggung jawab atas administrasi eksekutif persatuan untuk periode 2026–2027.' },
      bullets: {
        en: ['Coordinate union meetings, agendas, official letters and activity reports', 'Manage communication between committees and follow up on assigned tasks', 'Support student programs, new-student reception and organizational activities', 'Support external relations with universities and international offices'],
        ar: ['تنسيق اجتماعات الاتحاد وجداول الأعمال والمراسلات الرسمية وتقارير الأنشطة', 'إدارة التواصل بين اللجان ومتابعة المهام المكلّفة', 'دعم البرامج الطلابية واستقبال الطلاب الجدد والأنشطة التنظيمية', 'دعم العلاقات الخارجية مع الجامعات والمكاتب الدولية'],
        id: ['Mengoordinasikan rapat, agenda, surat resmi, dan laporan kegiatan persatuan', 'Mengelola komunikasi antarkomite dan menindaklanjuti tugas', 'Mendukung program mahasiswa, penyambutan mahasiswa baru, dan kegiatan organisasi', 'Mendukung hubungan eksternal dengan universitas dan kantor internasional']
      },
      link: null, in_story: true, story_text: { en: 'Became Secretary General of the Yemeni Students Union in Indonesia', ar: 'أصبحت الأمين العام لاتحاد الطلاب اليمنيين في إندونيسيا', id: 'Menjadi Sekretaris Jenderal Persatuan Pelajar Yaman di Indonesia' } },
    { ...base, id: id(202), sort: 20, in_door: true,
      title: { en: 'Head of Media Office', ar: 'رئيس المكتب الإعلامي', id: 'Kepala Kantor Media' },
      org: { en: 'Yemeni Students Union in Indonesia', ar: 'اتحاد الطلاب اليمنيين في إندونيسيا', id: 'Persatuan Pelajar Yaman di Indonesia' },
      employment_type: { en: 'Part-time · Remote', ar: 'دوام جزئي · عن بُعد', id: 'Paruh waktu · Jarak jauh' },
      location: { en: 'Indonesia', ar: 'إندونيسيا', id: 'Indonesia' },
      start_date: '2025-05-01', end_date: '2026-05-01', is_current: false, date_precision: 'month',
      summary: { en: "Led the union's media and online communication for one year.", ar: 'قدت العمل الإعلامي والتواصل الرقمي للاتحاد لمدة عام.', id: 'Memimpin media dan komunikasi daring persatuan selama satu tahun.' },
      bullets: {
        en: ['Led video production, graphic design, social media management, website development and content editing', "Supervised coverage and publication of the union's activities, events and official announcements", "Managed online communication and helped improve the union's digital presence"],
        ar: ['قدت إنتاج الفيديو والتصميم الجرافيكي وإدارة وسائل التواصل وتطوير الموقع وتحرير المحتوى', 'أشرفت على تغطية أنشطة الاتحاد وفعالياته وإعلاناته الرسمية ونشرها', 'أدرت التواصل الرقمي وساهمت في تحسين حضور الاتحاد على الإنترنت'],
        id: ['Memimpin produksi video, desain grafis, pengelolaan media sosial, pengembangan situs web, dan penyuntingan konten', 'Mengawasi liputan dan publikasi kegiatan, acara, serta pengumuman resmi persatuan', 'Mengelola komunikasi daring dan membantu meningkatkan kehadiran digital persatuan']
      },
      link: null, in_story: true, story_text: { en: 'Head of Media Office, Yemeni Students Union in Indonesia', ar: 'رئيس المكتب الإعلامي في اتحاد الطلاب اليمنيين في إندونيسيا', id: 'Kepala Kantor Media, Persatuan Pelajar Yaman di Indonesia' } }
  ],

  activities: [
    { ...base, id: id(301), sort: 10, category: 'delegation', in_door: true,
      title: { en: 'RCOY MENA 2026', ar: 'RCOY MENA 2026', id: 'RCOY MENA 2026' },
      org: { en: 'Madad Foundation for Development & Green Opportunities', ar: 'مؤسسة مدد للتنمية ومنصة فرص خضراء', id: 'Madad Foundation for Development & Green Opportunities' },
      role: { en: 'Delegate, Yemeni delegation', ar: 'عضو الوفد اليمني', id: 'Delegasi Yaman' },
      start_date: '2026-09-16', end_date: '2026-09-19', date_precision: 'day',
      location: { en: 'Oman', ar: 'سلطنة عُمان', id: 'Oman' },
      summary: { en: 'Officially selected to take part in the Regional Conference of Youth on climate for the Middle East and North Africa.', ar: 'اختِرت رسميًا للمشاركة في المؤتمر الإقليمي للشباب حول المناخ في الشرق الأوسط وشمال أفريقيا.', id: 'Terpilih secara resmi untuk mengikuti Konferensi Regional Pemuda tentang iklim untuk Timur Tengah dan Afrika Utara.' },
      image_url: null, link: null,
      in_story: true, story_text: { en: 'Joined the Yemeni delegation at RCOY MENA 2026 in Oman', ar: 'شاركت ضمن الوفد اليمني في RCOY MENA 2026 بسلطنة عُمان', id: 'Bergabung dengan delegasi Yaman di RCOY MENA 2026 di Oman' } },
    { ...base, id: id(302), sort: 20, category: 'conference', in_door: true,
      title: { en: 'International Youth Climate Forum 2026', ar: 'المنتدى الدولي للشباب حول المناخ 2026', id: 'International Youth Climate Forum 2026' },
      org: { en: 'Universitas Indonesia', ar: 'جامعة إندونيسيا', id: 'Universitas Indonesia' },
      role: { en: 'Participant · certificate of appreciation', ar: 'مشارك · شهادة تقدير', id: 'Peserta · sertifikat penghargaan' },
      start_date: '2026-06-10', end_date: null, date_precision: 'day',
      location: { en: 'Depok, Indonesia', ar: 'ديبوك، إندونيسيا', id: 'Depok, Indonesia' },
      summary: { en: 'A forum on environmental resilience and climate action.', ar: 'منتدى حول المرونة البيئية والعمل المناخي.', id: 'Forum tentang ketahanan lingkungan dan aksi iklim.' },
      image_url: '/certificates/iycf-2026.webp', link: null },
    { ...base, id: id(303), sort: 30, category: 'program',  in_door: false,
      title: { en: 'Young Leader Program, first session', ar: 'برنامج الشاب القائد، اللقاء الأول', id: 'Program Pemimpin Muda, sesi pertama' },
      org: { en: 'Yemeni Students Union in Indonesia', ar: 'اتحاد الطلاب اليمنيين في إندونيسيا', id: 'Persatuan Pelajar Yaman di Indonesia' },
      role: { en: 'Participant', ar: 'مشارك', id: 'Peserta' },
      start_date: '2026-10-16', end_date: null, date_precision: 'day', location: { en: 'Online', ar: 'عن بُعد', id: 'Daring' },
      summary: { en: '"The message of youth in shaping the future and building civilization", presented by Dr. Abdulkarim Bakkar.', ar: '«رسالة الشباب في صناعة المستقبل وبناء الحضارة»، قدّمه الدكتور عبدالكريم بكار.', id: '"Peran pemuda dalam membentuk masa depan dan membangun peradaban", dibawakan oleh Dr. Abdulkarim Bakkar.' },
      image_url: '/certificates/young-leader-2026.webp', link: null },
    { ...base, id: id(304), sort: 40, category: 'conference', in_door: false,
      title: { en: '2nd International Cultural Presentation (ICP)', ar: 'العرض الثقافي الدولي الثاني (ICP)', id: 'International Cultural Presentation (ICP) ke-2' },
      org: { en: 'UIN Raden Mas Said Surakarta', ar: 'UIN رادن ماس سعيد سوراكارتا', id: 'UIN Raden Mas Said Surakarta' },
      role: { en: 'Participant, representing UIN Salatiga', ar: 'مشارك ممثّلًا لجامعة UIN سالاتيغا', id: 'Peserta, mewakili UIN Salatiga' },
      start_date: '2026-10-20', end_date: null, date_precision: 'day', location: { en: 'Surakarta, Indonesia', ar: 'سوراكارتا، إندونيسيا', id: 'Surakarta, Indonesia' },
      summary: { en: '"Bridging Cultures, Uniting Differences".', ar: '«جسور بين الثقافات، ووحدة في الاختلاف».', id: '"Bridging Cultures, Uniting Differences".' },
      image_url: '/certificates/icp-2026.webp', link: null },
    { ...base, id: id(305), sort: 50, category: 'conference', in_door: false,
      title: { en: 'International Conference on Privacy and Cyber Security Awareness', ar: 'المؤتمر الدولي للتوعية بالخصوصية والأمن السيبراني', id: 'Konferensi Internasional Kesadaran Privasi dan Keamanan Siber' },
      org: { en: 'Faculty of Dakwah, UIN Salatiga', ar: 'كلية الدعوة، UIN سالاتيغا', id: 'Fakultas Dakwah, UIN Salatiga' },
      role: { en: 'Participant', ar: 'مشارك', id: 'Peserta' },
      start_date: '2026-08-13', end_date: null, date_precision: 'day', location: { en: 'Salatiga, Indonesia', ar: 'سالاتيغا، إندونيسيا', id: 'Salatiga, Indonesia' },
      summary: { en: '', ar: '', id: '' }, image_url: '/certificates/privacy-cyber-2026.webp', link: null },
    { ...base, id: id(306), sort: 60, category: 'conference', in_door: false,
      title: { en: 'International Seminar: Contemporary Issues on Education and Psychology', ar: 'ندوة دولية: قضايا معاصرة في التربية وعلم النفس', id: 'Seminar Internasional: Isu Kontemporer Pendidikan dan Psikologi' },
      org: { en: 'Faculty of Education and Psychology, Universitas Negeri Semarang', ar: 'كلية التربية وعلم النفس، جامعة سمارانغ الحكومية', id: 'Fakultas Ilmu Pendidikan dan Psikologi, Universitas Negeri Semarang' },
      role: { en: 'Participant', ar: 'مشارك', id: 'Peserta' },
      start_date: '2026-02-19', end_date: null, date_precision: 'day', location: { en: 'Semarang, Indonesia', ar: 'سمارانغ، إندونيسيا', id: 'Semarang, Indonesia' },
      summary: { en: '', ar: '', id: '' }, image_url: '/certificates/unnes-seminar-2026.webp', link: null },
    { ...base, id: id(307), sort: 70, category: 'conference', in_door: false,
      title: { en: 'AICIEB 2024: 5th Annual International Conference on Islamic Economics and Business', ar: 'AICIEB 2024: المؤتمر الدولي السنوي الخامس للاقتصاد والأعمال الإسلامية', id: 'AICIEB 2024: Konferensi Internasional Tahunan ke-5 Ekonomi dan Bisnis Islam' },
      org: { en: 'UIN Salatiga', ar: 'UIN سالاتيغا', id: 'UIN Salatiga' },
      role: { en: 'Participant', ar: 'مشارك', id: 'Peserta' },
      start_date: '2024-09-18', end_date: null, date_precision: 'day', location: { en: 'Salatiga, Indonesia', ar: 'سالاتيغا، إندونيسيا', id: 'Salatiga, Indonesia' },
      summary: { en: '"Aligning ESG with Halal Principles to Realize Green Economy for Sustainable Development in the Era of Society 5.0".', ar: '«مواءمة معايير ESG مع مبادئ الحلال لتحقيق اقتصاد أخضر من أجل التنمية المستدامة في عصر المجتمع 5.0».', id: '"Aligning ESG with Halal Principles to Realize Green Economy for Sustainable Development in the Era of Society 5.0".' },
      image_url: '/certificates/aicieb-2024.webp', link: null,
      in_story: true, story_text: { en: 'Attended AICIEB 2024, an international conference at UIN Salatiga', ar: 'حضرت مؤتمر AICIEB 2024 الدولي في UIN سالاتيغا', id: 'Mengikuti AICIEB 2024, konferensi internasional di UIN Salatiga' } },
    { ...base, id: id(308), sort: 80, category: 'program', in_door: false, visible: false,
      title: { en: 'International eBooks (iG Publishing) socialization', ar: 'تعريف بالكتب الإلكترونية الدولية (iG Publishing)', id: 'Sosialisasi E-book Internasional (iG Publishing)' },
      org: { en: 'UIN Salatiga Library', ar: 'مكتبة UIN سالاتيغا', id: 'Perpustakaan UIN Salatiga' },
      role: { en: 'Participant', ar: 'مشارك', id: 'Peserta' },
      start_date: '2026-07-07', end_date: null, date_precision: 'day', location: { en: 'Salatiga, Indonesia', ar: 'سالاتيغا، إندونيسيا', id: 'Salatiga, Indonesia' },
      summary: { en: '', ar: '', id: '' }, image_url: '/certificates/library-ebooks-2026.webp', link: null }
  ],

  achievements: [
    { ...base, id: id(401), sort: 10, kind: 'award', featured: true,
      title: { en: '1st Place, International Indonesian Language Debate', ar: 'المركز الأول في المناظرة الدولية باللغة الإندونيسية', id: 'Juara 1 Kompetisi Debat Internasional Bahasa Indonesia' },
      issuer: { en: 'GRAFITACI 2025 · UIN Raden Fatah Palembang', ar: 'GRAFITACI 2025 · UIN رادن فتاح باليمبانغ', id: 'GRAFITACI 2025 · UIN Raden Fatah Palembang' },
      date: '2025-09-11', date_precision: 'day', credential_id: 'B.231/UN.09/PLI/KS.02/09/2025', credential_url: null,
      image_url: '/certificates/grafitaci-debate-2025.webp', summary: { en: '', ar: '', id: '' },
      in_story: true, story_text: { en: '1st place, International Indonesian Language Debate, GRAFITACI 2025', ar: 'المركز الأول في المناظرة الدولية باللغة الإندونيسية، GRAFITACI 2025', id: 'Juara 1 Debat Internasional Bahasa Indonesia, GRAFITACI 2025' } },
    { ...base, id: id(402), sort: 20, kind: 'award', featured: true,
      title: { en: 'Best Essay Award, DNA! International Summer Course 2026', ar: 'جائزة أفضل مقال، برنامج DNA! الصيفي الدولي 2026', id: 'Best Essay Award, DNA! International Summer Course 2026' },
      issuer: { en: 'Faculty of Architecture and Design, UPN "Veteran" Jawa Timur', ar: 'كلية العمارة والتصميم، UPN "Veteran" جاوة الشرقية', id: 'Fakultas Arsitektur dan Desain, UPN "Veteran" Jawa Timur' },
      date: '2026-07-08', date_precision: 'day', credential_id: '401/UN63.5/Sertiv_DNA/2026', credential_url: null,
      image_url: '/certificates/dna-best-essay-2026.webp', summary: { en: 'Awarded in Online Lecture Series 2.', ar: 'مُنحت في سلسلة المحاضرات الثانية عبر الإنترنت.', id: 'Diberikan pada Online Lecture Series 2.' },
      in_story: true, story_text: { en: 'Completed the DNA! International Summer Course and won its Best Essay Award', ar: 'أتممت برنامج DNA! الصيفي الدولي وفزت بجائزة أفضل مقال', id: 'Menyelesaikan DNA! International Summer Course dan meraih Best Essay Award' } },
    { ...base, id: id(403), sort: 30, kind: 'award', featured: true,
      title: { en: '3rd Place, Web Development, INTECHFEST 2026', ar: 'المركز الثالث في تطوير الويب، INTECHFEST 2026', id: 'Juara 3 Web Development, INTECHFEST 2026' },
      issuer: { en: 'UIN Salatiga · with the project Lestari Tani', ar: 'UIN سالاتيغا · بمشروع Lestari Tani', id: 'UIN Salatiga · dengan proyek Lestari Tani' },
      date: '2026-01-01', date_precision: 'year', credential_id: null, credential_url: null, image_url: null, summary: { en: '', ar: '', id: '' },
      in_story: true, story_text: { en: '3rd place in Web Development at INTECHFEST 2026 with Lestari Tani', ar: 'المركز الثالث في تطوير الويب في INTECHFEST 2026 بمشروع Lestari Tani', id: 'Juara 3 Web Development di INTECHFEST 2026 dengan Lestari Tani' } },
    { ...base, id: id(404), sort: 40, kind: 'award', featured: false,
      title: { en: '3rd Place, Best Traditional Costume', ar: 'المركز الثالث في فئة أفضل زي تقليدي', id: 'Juara 3 Kategori Busana Adat Terbaik' },
      issuer: { en: 'GRAFITACI 2025 · UIN Raden Fatah Palembang', ar: 'GRAFITACI 2025 · UIN رادن فتاح باليمبانغ', id: 'GRAFITACI 2025 · UIN Raden Fatah Palembang' },
      date: '2025-09-11', date_precision: 'day', credential_id: null, credential_url: null,
      image_url: '/certificates/grafitaci-costume-2025.webp', summary: { en: '', ar: '', id: '' },
      in_story: true, story_text: { en: '3rd place, Best Traditional Costume, GRAFITACI 2025', ar: 'المركز الثالث في فئة أفضل زي تقليدي، GRAFITACI 2025', id: 'Juara 3 Busana Adat Terbaik, GRAFITACI 2025' } },
    { ...base, id: id(405), sort: 50, kind: 'certificate', featured: false,
      title: { en: 'DNA! International Summer Course Program 2026: program completion', ar: 'إتمام برنامج DNA! الصيفي الدولي 2026', id: 'Penyelesaian Program DNA! International Summer Course 2026' },
      issuer: { en: 'UPN "Veteran" Jawa Timur, Surabaya', ar: 'UPN "Veteran" جاوة الشرقية، سورابايا', id: 'UPN "Veteran" Jawa Timur, Surabaya' },
      date: '2026-07-18', date_precision: 'day', credential_id: '433/UN63.5/Sertiv_DNA/2026', credential_url: null,
      image_url: '/certificates/dna-completion-2026.webp', summary: { en: 'Hybrid program, July 6–18, 2026: online lectures, creative workshops and field study.', ar: 'برنامج هجين من 6 إلى 18 يوليو 2026: محاضرات عبر الإنترنت وورش إبداعية ودراسة ميدانية.', id: 'Program hybrid, 6–18 Juli 2026: kuliah daring, lokakarya kreatif, dan studi lapangan.' } },
    { ...base, id: id(406), sort: 60, kind: 'certificate', featured: false,
      title: { en: 'International Short Course: Academic Writing for International Students', ar: 'دورة دولية قصيرة: الكتابة الأكاديمية للطلاب الدوليين', id: 'International Short Course: Academic Writing for International Students' },
      issuer: { en: "Faculty of Shari'a, UIN Salatiga", ar: 'كلية الشريعة، UIN سالاتيغا', id: 'Fakultas Syariah, UIN Salatiga' },
      date: '2026-07-01', date_precision: 'day', credential_id: 'B-3390/Un.29/D2/PL.08/07/2026', credential_url: null,
      image_url: '/certificates/academic-writing-2026.webp', summary: { en: '', ar: '', id: '' } },
    { ...base, id: id(407), sort: 70, kind: 'certificate', featured: false,
      title: { en: '2nd Summer Course: Conservation of Mind and Culture (CoMiC)', ar: 'الدورة الصيفية الثانية: صون العقل والثقافة (CoMiC)', id: 'Summer Course ke-2: Conservation of Mind and Culture (CoMiC)' },
      issuer: { en: 'Faculty of Education and Psychology, Universitas Negeri Semarang', ar: 'كلية التربية وعلم النفس، جامعة سمارانغ الحكومية', id: 'Fakultas Ilmu Pendidikan dan Psikologi, Universitas Negeri Semarang' },
      date: '2026-05-07', date_precision: 'day', credential_id: 'B/9429/UN37.1.1/KM.04.01/2026', credential_url: null,
      image_url: '/certificates/comic-summer-2026.webp', summary: { en: '', ar: '', id: '' } }
  ],

  education: [
    { ...base, id: id(501), sort: 10,
      institution: { en: 'State Islamic University of Salatiga (UIN Salatiga)', ar: 'جامعة سالاتيغا الإسلامية الحكومية (UIN Salatiga)', id: 'Universitas Islam Negeri Salatiga (UIN Salatiga)' },
      degree: { en: "Bachelor's degree", ar: 'بكالوريوس', id: 'Sarjana (S1)' },
      field: { en: 'Information Technology', ar: 'تقنية المعلومات', id: 'Teknologi Informasi' },
      location: { en: 'Salatiga, Central Java, Indonesia', ar: 'سالاتيغا، جاوة الوسطى، إندونيسيا', id: 'Salatiga, Jawa Tengah, Indonesia' },
      start_date: '2024-08-01', end_date: '2028-08-01', is_expected: true, date_precision: 'month',
      summary: { en: 'Information Technology undergraduate focusing on artificial intelligence and mobile app development.', ar: 'طالب بكالوريوس تقنية معلومات يركّز على الذكاء الاصطناعي وتطوير تطبيقات الجوال.', id: 'Mahasiswa S1 Teknologi Informasi dengan fokus kecerdasan buatan dan pengembangan aplikasi mobile.' },
      coursework: {
        en: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Data Structures and Algorithms'],
        ar: ['الذكاء الاصطناعي', 'تعلّم الآلة', 'التعلّم العميق', 'الرؤية الحاسوبية', 'هياكل البيانات والخوارزميات'],
        id: ['Kecerdasan Buatan', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Struktur Data dan Algoritma']
      },
      in_story: true, story_text: { en: "Started a bachelor's in Information Technology at UIN Salatiga", ar: 'بدأت دراسة البكالوريوس في تقنية المعلومات بجامعة UIN سالاتيغا', id: 'Memulai S1 Teknologi Informasi di UIN Salatiga' } }
  ],

  skillGroups: [
    { id: id(601), sort: 10, visible: true, name: { en: 'AI & data', ar: 'الذكاء الاصطناعي والبيانات', id: 'AI & data' } },
    { id: id(602), sort: 20, visible: true, name: { en: 'LLM apps', ar: 'تطبيقات النماذج اللغوية', id: 'Aplikasi LLM' } },
    { id: id(603), sort: 30, visible: true, name: { en: 'Programming', ar: 'البرمجة', id: 'Pemrograman' } },
    { id: id(604), sort: 40, visible: true, name: { en: 'Mobile & web', ar: 'الجوال والويب', id: 'Mobile & web' } },
    { id: id(605), sort: 50, visible: true, name: { en: 'Databases & cloud', ar: 'قواعد البيانات والسحابة', id: 'Basis data & cloud' } },
    { id: id(606), sort: 60, visible: true, name: { en: 'Tools', ar: 'الأدوات', id: 'Alat' } },
    { id: id(607), sort: 70, visible: true, name: { en: 'Leadership & media', ar: 'القيادة والإعلام', id: 'Kepemimpinan & media' } }
  ],

  skills: [
    ...([
      ['Machine Learning'], ['Computer Vision'], ['Deep Learning fundamentals', 'أساسيات التعلّم العميق', 'Dasar-dasar Deep Learning'], ['Data preprocessing', 'المعالجة المسبقة للبيانات', 'Prapemrosesan data'],
      ['Feature engineering', 'هندسة الخصائص', 'Rekayasa fitur'], ['TensorFlow / Keras'], ['TensorFlow Lite'], ['MediaPipe'], ['scikit-learn'], ['pandas'], ['NumPy'],
      ['Model evaluation with real users', 'تقييم النماذج مع مستخدمين حقيقيين', 'Evaluasi model dengan pengguna nyata', 'learning'],
      ['Serving models through APIs', 'تقديم النماذج عبر واجهات برمجية', 'Menyajikan model melalui API', 'learning']
    ] as string[][]).map((r, i) => skill(700 + i, 601, r, i)),
    ...([['Google Gemini API'], ['Retrieval-augmented generation (RAG)', 'التوليد المعزّز بالاسترجاع (RAG)', 'Retrieval-augmented generation (RAG)', 'learning']] as string[][]).map((r, i) => skill(720 + i, 602, r, i)),
    ...['Python', 'Dart', 'C++', 'JavaScript / TypeScript'].map((n, i) => skill(730 + i, 603, [n], i)),
    ...([['Flutter'], ['Riverpod'], ['GoRouter'], ['Kotlin (MethodChannel)'], ['HTML5'], ['CSS3'], ['REST API integration', 'التكامل مع REST API', 'Integrasi REST API'], ['UI/UX design', 'تصميم واجهات وتجربة المستخدم', 'Desain UI/UX']] as string[][]).map((r, i) => skill(740 + i, 604, r, i)),
    ...['Firebase', 'MongoDB', 'PostgreSQL', 'MySQL'].map((n, i) => skill(760 + i, 605, [n], i)),
    ...['Git', 'GitHub', 'Google Colab', 'Kaggle', 'Trello'].map((n, i) => skill(770 + i, 606, [n], i)),
    ...([
      ['Team leadership', 'قيادة الفرق', 'Kepemimpinan tim'], ['Administrative coordination', 'التنسيق الإداري', 'Koordinasi administrasi'], ['Public speaking', 'الخطابة والإلقاء', 'Berbicara di depan umum'],
      ['Academic writing', 'الكتابة الأكاديمية', 'Penulisan akademik'], ['Video production', 'إنتاج الفيديو', 'Produksi video'], ['Graphic design', 'التصميم الجرافيكي', 'Desain grafis'], ['Social media management', 'إدارة وسائل التواصل', 'Manajemen media sosial']
    ] as string[][]).map((r, i) => skill(780 + i, 607, r, i))
  ]
};
