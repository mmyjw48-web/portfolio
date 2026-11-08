import MediaLibrary from '@/components/admin/MediaLibrary';

export default function MediaPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold">مكتبة الصور والملفات</h1>
        <p className="max-w-2xl text-muted">كل ما ترفعه من النماذج يُحفظ هنا مرتّبًا في مجلدات. الصور تُصغّر وتُحوّل تلقائيًا إلى WebP لتبقى سريعة. لا ترفع وثائق شخصية مثل الجواز أو الإقامة: كل ما هنا عام.</p>
      </div>
      <MediaLibrary />
    </div>
  );
}
