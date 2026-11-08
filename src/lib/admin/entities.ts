/**
 * Describes every editable table for the dashboard: which fields exist, how they are edited, and their Arabic labels.
 * The same description drives the forms (client) and the validation in the server actions.
 */

export type FieldType =
  | 'i18n' | 'i18nText' | 'i18nList'
  | 'text' | 'textarea' | 'url' | 'email' | 'date' | 'number' | 'slug'
  | 'bool' | 'select' | 'tags' | 'image' | 'file' | 'gallery' | 'metrics' | 'doors' | 'skillGroup';

export interface Option { value: string; label: string }
export interface FieldDef {
  name: string;
  type: FieldType;
  label: string;
  help?: string;
  required?: boolean;
  options?: Option[];
  folder?: string;
  group?: string;
}
export interface EntityDef {
  key: string;
  table: string;
  pk: 'id' | 'key';
  label: string;
  singular: string;
  intro: string;
  titleField: string;
  subtitleField?: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  canCreate: boolean;
  canDelete: boolean;
  flags: ('visible' | 'published' | 'featured')[];
}

const PRECISION: FieldDef = {
  name: 'date_precision', type: 'select', label: 'دقة التاريخ', help: 'كيف يظهر التاريخ في الموقع.',
  options: [{ value: 'day', label: 'يوم وشهر وسنة' }, { value: 'month', label: 'شهر وسنة' }, { value: 'year', label: 'السنة فقط' }]
};
const STORY: FieldDef[] = [
  { name: 'in_story', type: 'bool', label: 'أظهره في "قصتي" (الخط الزمني)', group: 'الخط الزمني' },
  { name: 'story_text', type: 'i18n', label: 'نص الخط الزمني', help: 'جملة قصيرة تظهر في الخط الزمني. إن تركته فارغًا يظهر العنوان.', group: 'الخط الزمني' }
];
const STATUS_OPTIONS: Option[] = [
  { value: 'completed', label: 'مكتمل' }, { value: 'in_progress', label: 'قيد التطوير' }, { value: 'prototype', label: 'نموذج أولي' },
  { value: 'concept', label: 'فكرة ونموذج أولي' }, { value: 'hackathon', label: 'نموذج هاكاثون' }, { value: 'planned', label: 'مخطط له' }
];

export const ENTITIES: Record<string, EntityDef> = {
  projects: {
    key: 'projects', table: 'projects', pk: 'id', label: 'المشاريع', singular: 'مشروع',
    intro: 'كل مشروع يظهر داخل باب واحد أو أكثر، وله صفحة تفاصيل خاصة.',
    titleField: 'title', subtitleField: 'tagline', canCreate: true, canDelete: true, flags: ['visible', 'published', 'featured'],
    defaults: { status: 'completed', date_precision: 'month', visual: 'auto', doors: [], stack: [], metrics: [], gallery: [], featured: false, visible: true, published: false, in_story: false },
    fields: [
      { name: 'title', type: 'i18n', label: 'اسم المشروع', required: true, group: 'الأساسيات' },
      { name: 'slug', type: 'slug', label: 'الرابط المختصر', help: 'يظهر في عنوان صفحة المشروع، بحروف إنجليزية صغيرة وشرطات فقط، مثل: sign-sense', required: true, group: 'الأساسيات' },
      { name: 'tagline', type: 'i18n', label: 'وصف في سطر واحد', group: 'الأساسيات' },
      { name: 'doors', type: 'doors', label: 'الأبواب التي يظهر خلفها', help: 'اختر بابًا واحدًا على الأقل.', group: 'الأساسيات' },
      { name: 'status', type: 'select', label: 'حالة المشروع', options: STATUS_OPTIONS, group: 'الأساسيات' },
      { name: 'team', type: 'i18n', label: 'الفريق', help: 'مثل: فردي، أو فريق، أو مع إبراهيم حسن. اتركه فارغًا لإخفائه.', group: 'الأساسيات' },
      { name: 'award', type: 'i18n', label: 'جائزة', help: 'تظهر بدل حالة المشروع إن كتبتها.', group: 'الأساسيات' },
      { name: 'summary', type: 'i18nText', label: 'وصف قصير للبطاقة', help: 'جملتان أو ثلاث تظهر داخل الباب.', group: 'المحتوى' },
      { name: 'body', type: 'i18nText', label: 'الوصف الكامل', help: 'يظهر في صفحة المشروع. افصل الفقرات بسطر فارغ.', group: 'المحتوى' },
      { name: 'contribution', type: 'i18nList', label: 'ما الذي بنيته', help: 'كل سطر نقطة مستقلة.', group: 'المحتوى' },
      { name: 'metrics', type: 'metrics', label: 'أرقام ونتائج', help: 'مثل: 99.5% دقة الاختبار.', group: 'المحتوى' },
      { name: 'stack', type: 'tags', label: 'التقنيات', help: 'افصل بينها بفاصلة.', group: 'المحتوى' },
      { name: 'start_date', type: 'date', label: 'تاريخ البداية', group: 'التواريخ والروابط' },
      { name: 'end_date', type: 'date', label: 'تاريخ الانتهاء', group: 'التواريخ والروابط' },
      { ...PRECISION, group: 'التواريخ والروابط' },
      { name: 'repo_url', type: 'url', label: 'رابط GitHub', group: 'التواريخ والروابط' },
      { name: 'demo_url', type: 'url', label: 'رابط تجربة مباشرة', group: 'التواريخ والروابط' },
      { name: 'cover_url', type: 'image', label: 'صورة المشروع', folder: 'projects', help: 'صورة حقيقية من المشروع (لقطة شاشة أو تصميم عرض). إن تركتها فارغة لا تظهر أي صورة.', group: 'الصور' },
      { name: 'gallery', type: 'gallery', label: 'معرض الصور', folder: 'projects', help: 'صور إضافية تظهر في صفحة المشروع.', group: 'الصور' },
      { name: 'visual', type: 'select', label: 'شكل الإطار', group: 'الصور', options: [
        { value: 'auto', label: 'الصورة كما هي (أو بدون صورة)' }, { value: 'phone', label: 'الصورة داخل إطار هاتف (للقطات الشاشة)' }, { value: 'monitor', label: 'الصورة داخل إطار شاشة (لمواقع الويب)' }, { value: 'hand', label: 'رسم نقاط اليد (SignSense)' }, { value: 'arch', label: 'قوس صنعاني للزينة' }] },
      ...STORY
    ]
  },
  experiences: {
    key: 'experiences', table: 'experiences', pk: 'id', label: 'الخبرات', singular: 'خبرة',
    intro: 'تظهر في قسم "الخبرة"، ويمكن إظهارها أيضًا خلف باب القيادة.',
    titleField: 'title', subtitleField: 'org', canCreate: true, canDelete: true, flags: ['visible', 'published'],
    defaults: { date_precision: 'month', is_current: false, in_door: true, visible: true, published: false, in_story: false },
    fields: [
      { name: 'title', type: 'i18n', label: 'المسمى', required: true, group: 'الأساسيات' },
      { name: 'org', type: 'i18n', label: 'الجهة', group: 'الأساسيات' },
      { name: 'employment_type', type: 'i18n', label: 'نوع العمل', help: 'مثل: دوام جزئي · عن بُعد', group: 'الأساسيات' },
      { name: 'location', type: 'i18n', label: 'المكان', group: 'الأساسيات' },
      { name: 'summary', type: 'i18nText', label: 'ملخص', group: 'المحتوى' },
      { name: 'bullets', type: 'i18nList', label: 'المهام والإنجازات', help: 'كل سطر نقطة مستقلة.', group: 'المحتوى' },
      { name: 'start_date', type: 'date', label: 'تاريخ البداية', group: 'التواريخ' },
      { name: 'end_date', type: 'date', label: 'تاريخ الانتهاء', group: 'التواريخ' },
      { name: 'is_current', type: 'bool', label: 'ما زلت في هذا المنصب', group: 'التواريخ' },
      { ...PRECISION, group: 'التواريخ' },
      { name: 'link', type: 'url', label: 'رابط', group: 'التواريخ' },
      { name: 'in_door', type: 'bool', label: 'أظهرها خلف باب القيادة', group: 'العرض' },
      ...STORY
    ]
  },
  activities: {
    key: 'activities', table: 'activities', pk: 'id', label: 'القيادة والأنشطة', singular: 'نشاط',
    intro: 'الوفود والبرامج والمؤتمرات والأنشطة.',
    titleField: 'title', subtitleField: 'org', canCreate: true, canDelete: true, flags: ['visible', 'published'],
    defaults: { category: 'program', date_precision: 'day', in_door: false, visible: true, published: false, in_story: false },
    fields: [
      { name: 'title', type: 'i18n', label: 'العنوان', required: true, group: 'الأساسيات' },
      { name: 'category', type: 'select', label: 'النوع', group: 'الأساسيات', options: [
        { value: 'leadership', label: 'قيادة' }, { value: 'delegation', label: 'وفد' }, { value: 'program', label: 'برنامج' },
        { value: 'conference', label: 'مؤتمر أو ندوة' }, { value: 'community', label: 'خدمة مجتمعية' }, { value: 'media', label: 'إعلام' }] },
      { name: 'role', type: 'i18n', label: 'دوري', help: 'مثل: مشارك، متحدث، منظّم، عضو الوفد.', group: 'الأساسيات' },
      { name: 'org', type: 'i18n', label: 'الجهة المنظمة', group: 'الأساسيات' },
      { name: 'location', type: 'i18n', label: 'المكان', group: 'الأساسيات' },
      { name: 'summary', type: 'i18nText', label: 'وصف', group: 'المحتوى' },
      { name: 'start_date', type: 'date', label: 'التاريخ', group: 'التواريخ' },
      { name: 'end_date', type: 'date', label: 'تاريخ الانتهاء (اختياري)', group: 'التواريخ' },
      { ...PRECISION, group: 'التواريخ' },
      { name: 'image_url', type: 'image', label: 'صورة الشهادة أو النشاط', folder: 'activities', group: 'الصور والروابط' },
      { name: 'link', type: 'url', label: 'رابط', group: 'الصور والروابط' },
      { name: 'in_door', type: 'bool', label: 'أظهره خلف باب القيادة', group: 'العرض' },
      ...STORY
    ]
  },
  achievements: {
    key: 'achievements', table: 'achievements', pk: 'id', label: 'الإنجازات والشهادات', singular: 'إنجاز أو شهادة',
    intro: 'الجوائز تظهر كبطاقات بارزة، والشهادات في قائمة مع صورها.',
    titleField: 'title', subtitleField: 'issuer', canCreate: true, canDelete: true, flags: ['visible', 'published', 'featured'],
    defaults: { kind: 'certificate', date_precision: 'day', featured: false, visible: true, published: false, in_story: false },
    fields: [
      { name: 'title', type: 'i18n', label: 'العنوان', required: true, group: 'الأساسيات' },
      { name: 'kind', type: 'select', label: 'النوع', group: 'الأساسيات', options: [{ value: 'award', label: 'جائزة' }, { value: 'certificate', label: 'شهادة إتمام' }, { value: 'participation', label: 'شهادة مشاركة' }] },
      { name: 'issuer', type: 'i18n', label: 'الجهة المانحة', group: 'الأساسيات' },
      { name: 'date', type: 'date', label: 'التاريخ', group: 'الأساسيات' },
      { ...PRECISION, group: 'الأساسيات' },
      { name: 'summary', type: 'i18nText', label: 'وصف (اختياري)', group: 'الأساسيات' },
      { name: 'credential_id', type: 'text', label: 'رقم الشهادة', group: 'الشهادة' },
      { name: 'credential_url', type: 'url', label: 'رابط التحقق', group: 'الشهادة' },
      { name: 'image_url', type: 'image', label: 'صورة الشهادة', folder: 'certificates', help: 'لا ترفع وثائق فيها رقم جواز أو بيانات شخصية.', group: 'الشهادة' },
      ...STORY
    ]
  },
  education: {
    key: 'education', table: 'education', pk: 'id', label: 'التعليم', singular: 'مؤهل',
    intro: 'الجامعات والمؤهلات الدراسية.',
    titleField: 'institution', subtitleField: 'field', canCreate: true, canDelete: true, flags: ['visible', 'published'],
    defaults: { date_precision: 'month', is_expected: false, visible: true, published: false, in_story: false },
    fields: [
      { name: 'institution', type: 'i18n', label: 'الجامعة أو المؤسسة', required: true, group: 'الأساسيات' },
      { name: 'degree', type: 'i18n', label: 'الدرجة', group: 'الأساسيات' },
      { name: 'field', type: 'i18n', label: 'التخصص', group: 'الأساسيات' },
      { name: 'location', type: 'i18n', label: 'المكان', group: 'الأساسيات' },
      { name: 'summary', type: 'i18nText', label: 'وصف', group: 'المحتوى' },
      { name: 'coursework', type: 'i18nList', label: 'المواد ذات الصلة', help: 'كل سطر مادة.', group: 'المحتوى' },
      { name: 'start_date', type: 'date', label: 'تاريخ البداية', group: 'التواريخ' },
      { name: 'end_date', type: 'date', label: 'تاريخ التخرّج', group: 'التواريخ' },
      { name: 'is_expected', type: 'bool', label: 'التخرّج متوقّع (لم أتخرّج بعد)', group: 'التواريخ' },
      { ...PRECISION, group: 'التواريخ' },
      ...STORY
    ]
  },
  skill_groups: {
    key: 'skill_groups', table: 'skill_groups', pk: 'id', label: 'مجموعات المهارات', singular: 'مجموعة',
    intro: 'العناوين التي تُرتّب تحتها المهارات.',
    titleField: 'name', canCreate: true, canDelete: true, flags: ['visible'],
    defaults: { visible: true },
    fields: [{ name: 'name', type: 'i18n', label: 'اسم المجموعة', required: true }]
  },
  skills: {
    key: 'skills', table: 'skills', pk: 'id', label: 'المهارات', singular: 'مهارة',
    intro: 'المهارات التقنية. المهارات التي تتعلّمها الآن تظهر بإطار منقّط.',
    titleField: 'name', canCreate: true, canDelete: true, flags: ['visible'],
    defaults: { level: 'demonstrated', visible: true },
    fields: [
      { name: 'name', type: 'i18n', label: 'المهارة', required: true, help: 'أسماء التقنيات تكفي بالإنجليزية.' },
      { name: 'group_id', type: 'skillGroup', label: 'المجموعة', required: true },
      { name: 'level', type: 'select', label: 'المستوى', options: [{ value: 'demonstrated', label: 'استخدمتها في مشاريع' }, { value: 'learning', label: 'أتعلّمها الآن' }] }
    ]
  },
  doors: {
    key: 'doors', table: 'doors', pk: 'id', label: 'الأبواب', singular: 'باب',
    intro: 'أبواب صنعاء في قسم المشاريع. كل باب له شكل ولون، وتظهر خلفه المشاريع المرتبطة به.',
    titleField: 'name', subtitleField: 'intro', canCreate: true, canDelete: true, flags: ['visible'],
    defaults: { color: 'ruby', style: 'ai', kind: 'projects', visible: true },
    fields: [
      { name: 'id', type: 'slug', label: 'المعرّف', help: 'حروف إنجليزية صغيرة وشرطات، مثل: data-science. لا يمكن تغييره بعد الإنشاء.', required: true },
      { name: 'name', type: 'i18n', label: 'اسم الباب', required: true },
      { name: 'intro', type: 'i18nText', label: 'جملة تعريفية' },
      { name: 'style', type: 'select', label: 'شكل الباب والقمرية', options: [
        { value: 'ai', label: 'خشب أحمر وقفل صنعاني' }, { value: 'mobile', label: 'باب مزدوج من خشب الجوز' }, { value: 'web', label: 'خشب عسلي مع خوخة' }, { value: 'leadership', label: 'خشب معتّق ونجمة منحوتة' }] },
      { name: 'color', type: 'select', label: 'لون الضوء', options: [
        { value: 'ruby', label: 'أحمر' }, { value: 'cobalt', label: 'أزرق' }, { value: 'emerald', label: 'أخضر' }, { value: 'saffron', label: 'زعفراني' }, { value: 'turquoise', label: 'فيروزي' }, { value: 'violet', label: 'بنفسجي' }] },
      { name: 'kind', type: 'select', label: 'ماذا يظهر خلفه', options: [{ value: 'projects', label: 'المشاريع المرتبطة به' }, { value: 'leadership', label: 'الخبرات والأنشطة المختارة' }] }
    ]
  },
  sections: {
    key: 'sections', table: 'sections', pk: 'key', label: 'الأقسام', singular: 'قسم',
    intro: 'رتّب أقسام الصفحة الرئيسية، وأخفِ ما لا تريده، وعدّل عناوينها. الواجهة الأولى تبقى في الأعلى دائمًا.',
    titleField: 'title', subtitleField: 'subtitle', canCreate: false, canDelete: false, flags: ['visible'],
    defaults: {},
    fields: [
      { name: 'title', type: 'i18n', label: 'العنوان الصغير', required: true },
      { name: 'subtitle', type: 'i18n', label: 'العنوان الكبير' }
    ]
  }
};

export const PROFILE_FIELDS: FieldDef[] = [
  { name: 'name', type: 'i18n', label: 'الاسم الكامل', required: true, group: 'الواجهة الأولى' },
  { name: 'greeting', type: 'i18n', label: 'التحية', help: 'مثل: مرحبًا، أنا محمد.', group: 'الواجهة الأولى' },
  { name: 'build_label', type: 'i18n', label: 'النص قبل بطاقة الدفتر', help: 'مثل: أبني', group: 'الواجهة الأولى' },
  { name: 'roles', type: 'i18nList', label: 'العبارات التي تتقلّب في الدفتر', help: 'كل سطر عبارة.', group: 'الواجهة الأولى' },
  { name: 'available', type: 'bool', label: 'أظهر حالة "متاح لفرص التدريب"', group: 'الواجهة الأولى' },
  { name: 'status', type: 'i18n', label: 'نص الحالة', group: 'الواجهة الأولى' },
  { name: 'lead', type: 'i18nText', label: 'التعريف القصير', group: 'الواجهة الأولى' },
  { name: 'photo_url', type: 'image', label: 'الصورة الشخصية', folder: 'profile', help: 'يُفضّل صورة بخلفية مفرّغة (PNG أو WebP شفاف) حتى تقف داخل القوس.', group: 'الواجهة الأولى' },
  { name: 'about', type: 'i18nText', label: 'النبذة التعريفية', help: 'افصل الفقرات بسطر فارغ.', group: 'عن نفسي' },
  { name: 'facts', type: 'i18nList', label: 'معلومات سريعة', help: 'كل سطر معلومة.', group: 'عن نفسي' },
  { name: 'languages', type: 'i18nList', label: 'اللغات', help: 'كل سطر لغة ومستواها.', group: 'عن نفسي' },
  { name: 'location', type: 'i18n', label: 'المدينة', group: 'عن نفسي' },
  { name: 'cv_url', type: 'file', label: 'ملف السيرة الذاتية (PDF)', folder: 'cv', help: 'اختياري. ارفع نسخة ليس فيها تاريخ ميلادك أو رقم جوازك.', group: 'عن نفسي' },
  { name: 'email', type: 'email', label: 'البريد الإلكتروني', group: 'التواصل' },
  { name: 'whatsapp', type: 'text', label: 'رقم واتساب (أرقام فقط مع رمز الدولة)', help: 'مثل: 6285385122793', group: 'التواصل' },
  { name: 'phone_display', type: 'text', label: 'الرقم كما يظهر للزوار', help: 'مثل: +62 853-8512-2793', group: 'التواصل' },
  { name: 'linkedin_url', type: 'url', label: 'رابط LinkedIn', group: 'التواصل' },
  { name: 'github_url', type: 'url', label: 'رابط GitHub', group: 'التواصل' },
  { name: 'contact_title', type: 'i18n', label: 'عنوان قسم التواصل', group: 'التواصل' },
  { name: 'contact_sub', type: 'i18n', label: 'نص قسم التواصل', group: 'التواصل' },
  { name: 'seo_title', type: 'i18n', label: 'عنوان الصفحة في محركات البحث', group: 'محركات البحث' },
  { name: 'seo_description', type: 'i18nText', label: 'وصف الصفحة في محركات البحث', help: 'جملة أو جملتان.', group: 'محركات البحث' }
];
