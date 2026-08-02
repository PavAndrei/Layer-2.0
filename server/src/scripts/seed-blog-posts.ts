import { readFile } from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config';
import mongoose from 'mongoose';

import { MONGO_URI } from '../constants/env';
import { BlogPost } from '../models/blog-posts.model';
import { User } from '../models/users.model';
import type {
  BlogPostContentJson,
  BlogPostCoverImage,
  BlogPostStatus,
} from '../types/blog-post';

type BlogPostSeed = {
  contentBlocks: BlogPostSeedContentBlock[];
  coverImage?: BlogPostCoverImage | null;
  excerpt: string;
  publishedAt?: string | null;
  slug: string;
  status: BlogPostStatus;
  title: string;
};

type BlogPostSeedTextMark = {
  href?: string;
  type: 'bold' | 'italic' | 'link';
};

type BlogPostSeedTextSegment = {
  marks?: BlogPostSeedTextMark[];
  text: string;
};

type BlogPostSeedTextContent = string | BlogPostSeedTextSegment[];

type BlogPostSeedContentBlock =
  | {
      level?: 2;
      text: BlogPostSeedTextContent;
      type: 'heading';
    }
  | {
      text: BlogPostSeedTextContent;
      type: 'paragraph';
    }
  | {
      items: BlogPostSeedTextContent[];
      type: 'bulletList' | 'orderedList';
    }
  | {
      text: BlogPostSeedTextContent;
      type: 'blockquote';
    };

const readJsonFile = async <Data>(fileName: string): Promise<Data> => {
  const filePath = path.resolve(__dirname, '../data', fileName);
  const fileContent = await readFile(filePath, 'utf8');

  return JSON.parse(fileContent.replace(/^\uFEFF/, '')) as Data;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const normalizeSegments = (
  text: BlogPostSeedTextContent,
): BlogPostSeedTextSegment[] =>
  typeof text === 'string'
    ? [
        {
          text,
        },
      ]
    : text;

const textContentToHtml = (text: BlogPostSeedTextContent) =>
  normalizeSegments(text)
    .map((segment) => {
      return (segment.marks ?? []).reduce((html, mark) => {
        if (mark.type === 'bold') return `<strong>${html}</strong>`;
        if (mark.type === 'italic') return `<em>${html}</em>`;
        if (mark.type === 'link' && mark.href) {
          return `<a href="${escapeHtml(mark.href)}">${html}</a>`;
        }

        return html;
      }, escapeHtml(segment.text));
    })
    .join('');

const textContentToJson = (text: BlogPostSeedTextContent) =>
  normalizeSegments(text)
    .filter((segment) => segment.text.length > 0)
    .map((segment) => ({
      type: 'text',
      text: segment.text,
      ...(segment.marks?.length
        ? {
            marks: segment.marks.map((mark) => ({
              type: mark.type,
              ...(mark.type === 'link'
                ? {
                    attrs: {
                      href: mark.href,
                    },
                  }
                : {}),
            })),
          }
        : {}),
    }));

const contentBlockToHtml = (block: BlogPostSeedContentBlock) => {
  if (block.type === 'heading') {
    return `<h2>${textContentToHtml(block.text)}</h2>`;
  }

  if (block.type === 'paragraph') {
    return `<p>${textContentToHtml(block.text)}</p>`;
  }

  if (block.type === 'blockquote') {
    return `<blockquote><p>${textContentToHtml(block.text)}</p></blockquote>`;
  }

  const listTag = block.type === 'bulletList' ? 'ul' : 'ol';
  const items = block.items
    .map((item) => `<li><p>${textContentToHtml(item)}</p></li>`)
    .join('');

  return `<${listTag}>${items}</${listTag}>`;
};

const contentBlockToJson = (block: BlogPostSeedContentBlock) => {
  if (block.type === 'heading') {
    return {
      type: 'heading',
      attrs: {
        level: block.level ?? 2,
      },
      content: textContentToJson(block.text),
    };
  }

  if (block.type === 'paragraph') {
    return {
      type: 'paragraph',
      content: textContentToJson(block.text),
    };
  }

  if (block.type === 'blockquote') {
    return {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: textContentToJson(block.text),
        },
      ],
    };
  }

  return {
    type: block.type,
    content: block.items.map((item) => ({
      type: 'listItem',
      content: [
        {
          type: 'paragraph',
          content: textContentToJson(item),
        },
      ],
    })),
  };
};

const blogPostSeedToContent = (blogPost: BlogPostSeed) => ({
  contentHtml: blogPost.contentBlocks.map(contentBlockToHtml).join(''),
  contentJson: {
    type: 'doc',
    content: blogPost.contentBlocks.map(contentBlockToJson),
  } satisfies BlogPostContentJson,
});

const getBlogPostSeedUpdate = (
  blogPost: BlogPostSeed,
  authorId: mongoose.Types.ObjectId,
) => {
  const { contentHtml, contentJson } = blogPostSeedToContent(blogPost);

  return {
    $set: {
      authorId,
      contentHtml,
      contentJson,
      excerpt: blogPost.excerpt,
      publishedAt: blogPost.publishedAt
        ? new Date(blogPost.publishedAt)
        : undefined,
      status: blogPost.status,
      title: blogPost.title,
      ...(blogPost.coverImage ? { coverImage: blogPost.coverImage } : {}),
    },
    ...(blogPost.coverImage
      ? {}
      : {
          $unset: {
            coverImage: 1 as const,
          },
        }),
    $setOnInsert: {
      slug: blogPost.slug,
    },
  };
};

const seedBlogPosts = async () => {
  await mongoose.connect(MONGO_URI);

  const [blogPostsSeed, adminUser] = await Promise.all([
    readJsonFile<BlogPostSeed[]>('blog-posts.json'),
    User.findOne({ role: 'admin' }).sort({ createdAt: 1 }),
  ]);

  if (!adminUser) {
    throw new Error('Cannot seed blog posts: no admin user found.');
  }

  const result = await BlogPost.bulkWrite(
    blogPostsSeed.map((blogPost) => ({
      updateOne: {
        filter: {
          slug: blogPost.slug,
        },
        update: getBlogPostSeedUpdate(blogPost, adminUser._id),
        upsert: true,
      },
    })),
  );

  console.log(
    `Seeded blog posts: matched ${result.matchedCount}, inserted ${result.upsertedCount}, modified ${result.modifiedCount}. Author: ${adminUser.email}`,
  );
};

seedBlogPosts()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
