import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { getBlogPosts } from "../../blog/services/blogRepository";
import type { BlogPost } from "../../blog/types";
import { FloatingCard } from "../components/FloatingCard";
import type { FloatingCardProps } from "../components/FloatingCard";
import { Eyebrow } from "../components/ui";
import type { PageId } from "../types";

type FloatingPosition = Pick<
  FloatingCardProps,
  "top" | "left" | "right" | "bottom"
>;

interface BlogPostCardProps {
  post: BlogPost;
  position: FloatingPosition;
  delay: number;
  onClick?: () => void;
}

function BlogPostCard({ post, position, delay, onClick }: BlogPostCardProps) {
  return (
    <FloatingCard {...position} width={360} mountDelay={delay} className="blog-card-shell action-card">
      <button type="button" onClick={onClick} className="blog-card-button cursor-hover no-drag">
        <div className="blog-card-meta">
          <span>{post.tag}</span>
          <span>{post.date}</span>
        </div>
        <h3 className="blog-card-title text-lg font-bold text-bone leading-snug mb-2">
          {post.title}
        </h3>
        <p className="blog-card-excerpt text-slate text-sm leading-relaxed mb-4">{post.excerpt}</p>
        <span className="text-2xs tracking-widest uppercase text-bone font-bold inline-flex items-center gap-1 blog-read-more interactive-underline">
          Open post <ArrowUpRight size={12} />
        </span>
      </button>
    </FloatingCard>
  );
}

export function BlogPage({
  setPage,
  setSelectedBlogId,
}: {
  setPage: (page: PageId) => void;
  setSelectedBlogId: (id: string) => void;
}) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const positions: FloatingPosition[] = [
    { top: "15%", left: "5%" },
    { top: "13%", right: "6%" },
    { top: "44%", left: "32%" },
    { top: "66%", left: "7%" },
    { top: "67%", right: "8%" },
  ];

  return (
    <div className="page-canvas page-canvas--blog">
      <FloatingCard top="8%" left="35%" width={360} mountDelay={0} noDrag className="blog-intro-card action-card">
        <Eyebrow>From the Blog</Eyebrow>
        <p className="text-slate text-sm leading-relaxed">
          Occasional notes on design, code, and interfaces.
        </p>
      </FloatingCard>
      {isLoading ? (
        <FloatingCard
          top="50%"
          left="50%"
          width={300}
          mountDelay={0}
          noDrag
          className="transform -translate-x-1/2 -translate-y-1/2"
        >
          <p className="text-slate text-sm">Loading posts...</p>
        </FloatingCard>
      ) : (
        blogPosts.map((post, i) => (
          <BlogPostCard
            key={post.id}
            post={post}
            position={positions[i % positions.length]}
            delay={140 + i * 100}
            onClick={() => {
              setSelectedBlogId(post.id);
              setPage("blogdetail");
            }}
          />
        ))
      )}
    </div>
  );
}

export function BlogDetail({
  setPage,
  selectedBlogId,
}: {
  setPage: (page: PageId) => void;
  selectedBlogId: string;
}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const posts = await getBlogPosts();
        const found = posts.find((p) => p.id === selectedBlogId);
        setPost(found || null);
      } catch (error) {
        console.error("Failed to load blog post:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [selectedBlogId]);

  if (isLoading) {
    return (
      <div className="page-canvas page-canvas--blog">
        <FloatingCard
          top="50%"
          left="50%"
          width={300}
          mountDelay={0}
          className="transform -translate-x-1/2 -translate-y-1/2"
        >
          <p className="text-slate text-sm">Loading post...</p>
        </FloatingCard>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-canvas page-canvas--blog">
        <FloatingCard
          top="50%"
          left="50%"
          width={300}
          mountDelay={0}
          className="transform -translate-x-1/2 -translate-y-1/2"
        >
          <h2 className="text-2xl font-bold text-bone mb-4">Post not found</h2>
          <button
            onClick={() => setPage("blog")}
            className="text-2xs tracking-widest uppercase text-bone font-bold inline-flex items-center gap-1 blog-read-more cursor-hover no-drag interactive-underline"
          >
            Back to the blog <ArrowUpRight size={12} />
          </button>
        </FloatingCard>
      </div>
    );
  }

  return (
    <div className="page-canvas page-canvas--blog">
      <FloatingCard
        top="8%"
        left="8%"
        width={900}
        mountDelay={0}
        className="blog-detail-card max-h-[85vh] overflow-y-auto action-card"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xs tracking-widest uppercase text-slate font-bold">
                {post.tag}
              </span>
              <span className="text-3xs tracking-widest text-slate">
                {post.date}
              </span>
            </div>
            <h1 className="blog-detail-title text-4xl font-bold text-bone leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        <div className="blog-detail-content prose prose-invert max-w-none mb-8">
          {post.content.split("\n\n").map((paragraph, idx) => (
            <p
              key={idx}
              className="text-bone text-sm leading-relaxed mb-4 whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="pt-6 border-t border-line">
          <button
            onClick={() => setPage("blog")}
            className="text-2xs tracking-widest uppercase text-bone font-bold inline-flex items-center gap-1 blog-read-more cursor-hover no-drag interactive-underline"
          >
            Back to the blog <ArrowUpRight size={12} />
          </button>
        </div>
      </FloatingCard>
    </div>
  );
}
