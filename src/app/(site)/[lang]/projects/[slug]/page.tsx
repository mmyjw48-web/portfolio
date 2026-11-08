import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectView from '@/components/site/ProjectView';
import { getSiteData } from '@/lib/data';
import { isLang, t } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const data = await getSiteData();
  return data.projects.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const data = await getSiteData();
  const p = data.projects.find(x => x.slug === slug);
  if (!p) return {};
  return pageMetadata(data, lang, `/projects/${slug}`, { title: `${t(p.title, lang)} · ${t(data.profile.name, lang)}`, description: t(p.tagline, lang) || t(p.summary, lang) });
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const data = await getSiteData();
  const project = data.projects.find(x => x.slug === slug);
  if (!project) notFound();
  return <ProjectView data={data} lang={lang} project={project} />;
}
