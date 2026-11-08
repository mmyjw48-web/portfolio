import { LOCALES, type DatePrecision, type I18n, type I18nList, type Lang, type ProjectStatus, type ActivityCategory } from './types';

export { LOCALES };
export type { Lang };

export const isLang = (v: string | undefined | null): v is Lang => !!v && (LOCALES as readonly string[]).includes(v);
export const dirOf = (l: Lang) => (l === 'ar' ? 'rtl' : 'ltr');
export const LANG_NAMES: Record<Lang, string> = { en: 'English', ar: 'العربية', id: 'Bahasa Indonesia' };
export const LANG_SHORT: Record<Lang, string> = { en: 'EN', ar: 'ع', id: 'ID' };

/** Pick the text for a language, falling back to English, then to any language that has text. */
export function t(v: I18n | null | undefined, lang: Lang): string {
  if (!v) return '';
  return (v[lang] || v.en || v.ar || v.id || '').trim();
}
export function tl(v: I18nList | null | undefined, lang: Lang): string[] {
  if (!v) return [];
  const pick = v[lang]?.length ? v[lang] : v.en?.length ? v.en : [];
  return (pick || []).map(s => s.trim()).filter(Boolean);
}

const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
};
export const monthName = (m: number, lang: Lang) => MONTHS[lang][m];

function parts(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return { y, m: (m || 1) - 1, d: day || 1 };
}
export function formatDate(d: string | null, p: DatePrecision, lang: Lang): string {
  if (!d) return '';
  const { y, m, d: day } = parts(d);
  if (p === 'year') return String(y);
  if (p === 'day') return lang === 'en' ? `${MONTHS.en[m]} ${day}, ${y}` : `${day} ${MONTHS[lang][m]} ${y}`;
  return `${MONTHS[lang][m]} ${y}`;
}
export function formatRange(start: string | null, end: string | null, p: DatePrecision, lang: Lang, opts: { current?: boolean; expected?: boolean } = {}): string {
  if (!start && !end) return '';
  if (!end && !opts.current) return formatDate(start, p, lang);
  const a = parts(start || end!);
  if (start && end && !opts.current) {
    const b = parts(end);
    if (p === 'day' && a.y === b.y && a.m === b.m) {
      if (a.d === b.d) return formatDate(start, p, lang);
      return lang === 'en' ? `${MONTHS.en[a.m]} ${a.d}–${b.d}, ${a.y}` : `${a.d}–${b.d} ${MONTHS[lang][a.m]} ${a.y}`;
    }
    if (p !== 'year' && a.y === b.y) return `${MONTHS[lang][a.m]}–${MONTHS[lang][b.m]} ${a.y}`;
  }
  const left = formatDate(start, p === 'day' ? 'month' : p, lang);
  const right = opts.current ? UI[lang].present : formatDate(end, p === 'day' ? 'month' : p, lang) + (opts.expected ? ` (${UI[lang].expected})` : '');
  return `${left} – ${right}`;
}
export const yearOf = (d: string | null) => (d ? Number(d.slice(0, 4)) : null);

export const STATUS: Record<ProjectStatus, I18n> = {
  completed: { en: 'Completed', ar: 'مكتمل', id: 'Selesai' },
  in_progress: { en: 'In progress', ar: 'قيد التطوير', id: 'Sedang dikerjakan' },
  prototype: { en: 'Prototype', ar: 'نموذج أولي', id: 'Prototipe' },
  concept: { en: 'Concept prototype', ar: 'فكرة ونموذج أولي', id: 'Prototipe konsep' },
  hackathon: { en: 'Hackathon MVP', ar: 'نموذج هاكاثون', id: 'MVP Hackathon' },
  planned: { en: 'Planned', ar: 'مخطّط له', id: 'Direncanakan' }
};

export const CATEGORY: Record<ActivityCategory, I18n> = {
  leadership: { en: 'Leadership', ar: 'قيادة', id: 'Kepemimpinan' },
  delegation: { en: 'Delegation', ar: 'وفد', id: 'Delegasi' },
  program: { en: 'Program', ar: 'برنامج', id: 'Program' },
  conference: { en: 'Conference', ar: 'مؤتمر', id: 'Konferensi' },
  community: { en: 'Community', ar: 'مجتمع', id: 'Komunitas' },
  media: { en: 'Media', ar: 'إعلام', id: 'Media' }
};

/** Section names shown in Kufic script as a decorative heading, regardless of the page language. */
export const KUFI: Record<string, string> = {
  about: 'عن نفسي', projects: 'أبواب صنعاء', experience: 'الخبرة', leadership: 'القيادة', achievements: 'الإنجازات',
  skills: 'المهارات', education: 'التعليم', story: 'الحكاية', contact: 'تواصل'
};

export const UI = {
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Doors', experience: 'Experience', leadership: 'Leadership', achievements: 'Awards', skills: 'Skills', education: 'Education', story: 'Story', contact: 'Contact' },
    clockCity: 'Salatiga', language: 'Language', toDay: 'Switch to day', toNight: 'Switch to night',
    openDoors: 'Open the doors', email: 'Email', scrollDoors: 'Scroll to the doors', available: 'Available for internships',
    hint: 'Hover to peek. Click a door to step inside.', hintTouch: 'Tap a door to step inside.', clickEnter: 'Click to enter →',
    enter: (d: string) => `Enter: ${d}`, back: 'Back to the doors', count: (n: number) => (n === 1 ? '1 item' : `${n} items`),
    code: 'Code on GitHub ↗', demo: 'Live demo ↗', details: 'Details →', allProjects: '← All projects',
    present: 'Present', expected: 'expected', current: 'Current role',
    facts: 'At a glance', languages: 'Languages', coursework: 'Relevant coursework',
    legend: { ai: 'AI', mobile: 'Mobile', web: 'Web', lead: 'Leadership', learn: 'Learning & awards' },
    next: (y: number) => `Next: graduating in ${y} (expected)`,
    learning: 'Learning now', demonstrated: 'Used in projects',
    awards: 'Awards', certificates: 'Certificates', viewCertificate: 'View certificate ↗', credential: 'Credential',
    whatIBuilt: 'What I built', problem: 'About the project', stack: 'Built with', results: 'Results', team: 'Team',
    copy: 'Copy', copied: 'Copied', message: 'Message', open: 'Open',
    formName: 'Your name', formEmail: 'Your email', formMsg: 'Message', formSend: 'Send message', formSending: 'Sending…',
    formOk: 'Thank you. Your message has been sent.', formMissing: 'Please fill in your name, a valid email and a message.', formError: 'The message could not be sent. Please try again, or email me directly.',
    rights: 'All rights reserved', preview: 'Preview: drafts are shown', cv: 'Download CV'
  },
  ar: {
    nav: { home: 'الرئيسية', about: 'عن نفسي', projects: 'الأبواب', experience: 'الخبرة', leadership: 'القيادة', achievements: 'الإنجازات', skills: 'المهارات', education: 'التعليم', story: 'قصتي', contact: 'تواصل' },
    clockCity: 'سالاتيغا', language: 'اللغة', toDay: 'التبديل إلى النهار', toNight: 'التبديل إلى الليل',
    openDoors: 'افتح الأبواب', email: 'البريد', scrollDoors: 'انزل إلى الأبواب', available: 'متاح لفرص التدريب',
    hint: 'مرّر المؤشر لتلقي نظرة، واضغط على أي باب للدخول.', hintTouch: 'اضغط على أي باب للدخول.', clickEnter: 'اضغط للدخول ←',
    enter: (d: string) => `ادخل: ${d}`, back: 'العودة إلى الأبواب', count: (n: number) => (n === 1 ? 'عنصر واحد' : n === 2 ? 'عنصران' : n <= 10 ? `${n} عناصر` : `${n} عنصرًا`),
    code: 'الكود على GitHub ↗', demo: 'تجربة مباشرة ↗', details: 'التفاصيل ←', allProjects: 'كل المشاريع →',
    present: 'حتى الآن', expected: 'متوقّع', current: 'المنصب الحالي',
    facts: 'باختصار', languages: 'اللغات', coursework: 'مواد ذات صلة',
    legend: { ai: 'ذكاء اصطناعي', mobile: 'جوال', web: 'ويب', lead: 'قيادة', learn: 'تعلّم وجوائز' },
    next: (y: number) => `التالي: التخرّج في ${y} (متوقّع)`,
    learning: 'أتعلّمها الآن', demonstrated: 'استخدمتها في مشاريع',
    awards: 'الجوائز', certificates: 'الشهادات', viewCertificate: 'عرض الشهادة ↗', credential: 'رقم الشهادة',
    whatIBuilt: 'ما الذي بنيته', problem: 'عن المشروع', stack: 'التقنيات', results: 'النتائج', team: 'الفريق',
    copy: 'نسخ', copied: 'تم النسخ', message: 'راسلني', open: 'فتح',
    formName: 'اسمك', formEmail: 'بريدك الإلكتروني', formMsg: 'رسالتك', formSend: 'إرسال', formSending: 'جارٍ الإرسال…',
    formOk: 'شكرًا لك، وصلت رسالتك.', formMissing: 'اكتب اسمك وبريدًا صحيحًا ورسالة.', formError: 'تعذّر إرسال الرسالة. حاول مرة أخرى أو راسلني على البريد مباشرة.',
    rights: 'جميع الحقوق محفوظة', preview: 'معاينة: تظهر المسودات', cv: 'تحميل السيرة الذاتية'
  },
  id: {
    nav: { home: 'Beranda', about: 'Tentang', projects: 'Pintu', experience: 'Pengalaman', leadership: 'Kepemimpinan', achievements: 'Prestasi', skills: 'Keterampilan', education: 'Pendidikan', story: 'Kisah', contact: 'Kontak' },
    clockCity: 'Salatiga', language: 'Bahasa', toDay: 'Ganti ke siang', toNight: 'Ganti ke malam',
    openDoors: 'Buka pintunya', email: 'Email', scrollDoors: 'Gulir ke pintu', available: 'Terbuka untuk magang',
    hint: 'Arahkan kursor untuk mengintip. Klik pintu untuk masuk.', hintTouch: 'Ketuk pintu untuk masuk.', clickEnter: 'Klik untuk masuk →',
    enter: (d: string) => `Masuk: ${d}`, back: 'Kembali ke pintu', count: (n: number) => `${n} item`,
    code: 'Kode di GitHub ↗', demo: 'Demo langsung ↗', details: 'Detail →', allProjects: '← Semua proyek',
    present: 'Sekarang', expected: 'perkiraan', current: 'Peran saat ini',
    facts: 'Sekilas', languages: 'Bahasa', coursework: 'Mata kuliah terkait',
    legend: { ai: 'AI', mobile: 'Mobile', web: 'Web', lead: 'Kepemimpinan', learn: 'Belajar & penghargaan' },
    next: (y: number) => `Berikutnya: lulus pada ${y} (perkiraan)`,
    learning: 'Sedang dipelajari', demonstrated: 'Dipakai di proyek',
    awards: 'Penghargaan', certificates: 'Sertifikat', viewCertificate: 'Lihat sertifikat ↗', credential: 'Nomor sertifikat',
    whatIBuilt: 'Yang saya bangun', problem: 'Tentang proyek', stack: 'Dibangun dengan', results: 'Hasil', team: 'Tim',
    copy: 'Salin', copied: 'Tersalin', message: 'Kirim pesan', open: 'Buka',
    formName: 'Nama Anda', formEmail: 'Email Anda', formMsg: 'Pesan', formSend: 'Kirim pesan', formSending: 'Mengirim…',
    formOk: 'Terima kasih. Pesan Anda sudah terkirim.', formMissing: 'Isi nama, email yang valid, dan pesan.', formError: 'Pesan gagal dikirim. Coba lagi, atau kirim email langsung.',
    rights: 'Hak cipta dilindungi', preview: 'Pratinjau: draf ditampilkan', cv: 'Unduh CV'
  }
};
export type UIStrings = (typeof UI)['en'];
