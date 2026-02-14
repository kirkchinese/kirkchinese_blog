import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: ({ image }) =>
    z.object({
      // === Core Identity ===
      title: z.string().min(5).max(100),
      slug: z.string().optional(),
      description: z.string().min(50).max(160),

      // === Dates & Time ===
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      lastModified: z.coerce.date().optional(),

      // === AI-Specific ===
      summary: z.string().optional(), // For AI summarization
      ai_tags: z.array(z.string()).optional(), // Auto-generated tags
      readingTime: z.number().optional(), // Auto-calculated
      complexity: z.enum(['beginner', 'intermediate', 'advanced']).optional(),

      // === Categorization ===
      category: z.string(),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      order: z.number().optional(),

      // === SEO & Discovery ===
      keywords: z.array(z.string()).optional(),
      seoTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      canonical: z.string().url().optional(),

      // === Authors ===
      author: z.string(),
      authors: z.array(z.string()).optional(),
      guestAuthor: z.boolean().optional(),

      // === Visual Assets ===
      heroImage: image().optional(),

      // === Publishing Control ===
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      unlisted: z.boolean().default(false),

      // === Content Type ===
      contentType: z.enum(['article', 'tutorial', 'reference', 'opinion']).default('article'),

      // === Audio Support ===
      audio: z
        .object({
          src: z.string(),
          type: z.string().default('audio/mpeg'),
          duration: z.string().optional(),
        })
        .optional(),

      // === Relations ===
      relatedPosts: z.array(z.string()).optional(),
      prerequisites: z.array(z.string()).optional(),

      // === External References ===
      externalUrl: z.string().url().optional(),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
    }),
});

export const collections = { blog };
