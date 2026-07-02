import type { BlogPost } from '../types';

const blogModules = import.meta.glob<string>('../content/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const blogContents = Object.entries(blogModules)
  .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
  .map(([, content]) => content);

let cachedPosts: BlogPost[] | null = null;

function createStableId(title: string, fallback: string) {
  const source = title || fallback;

  return source
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || fallback;
}

function parseFrontmatter(fileContent: string) {
  const match = fileContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    return {
      data: {} as Record<string, string>,
      content: fileContent,
    };
  }

  const [, frontmatter, content] = match;
  const data: Record<string, string> = {};

  frontmatter.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    value = value.replace(/^['"]|['"]$/g, '');
    data[key] = value;
  });

  return { data, content };
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  blogContents.forEach((fileContent, index) => {
    try {
      const { data, content: markdownContent } = parseFrontmatter(fileContent);
      const fallbackId = `blog-${index + 1}`;
      const title = data.title || 'Untitled Post';

      posts.push({
        id: data.id || createStableId(title, fallbackId),
        title,
        date: data.date || '1 Jan 2026',
        tag: data.tag || 'Blog',
        excerpt: data.excerpt || '',
        content: markdownContent.trim(),
      });
    } catch (err) {
      console.error('Error parsing blog post:', err);
    }
  });

  const monthMap: Record<string, number> = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  posts.sort((a, b) => {
    const parseDate = (dateStr: string) => {
      const parts = dateStr.split(' ');
      const day = parseInt(parts[0]);
      const monthStr = parts[1];
      const year = parseInt(parts[2]);
      const month = monthMap[monthStr] || 1;

      return new Date(year, month - 1, day).getTime();
    };

    return parseDate(b.date) - parseDate(a.date);
  });
  return posts;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!cachedPosts) {
    cachedPosts = await loadBlogPosts();
  }

  return cachedPosts;
}
