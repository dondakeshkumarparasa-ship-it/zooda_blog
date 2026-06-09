import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit3, X, BookOpen, Sparkles, FileText, CheckCircle, Eye, AlertCircle, Image } from 'lucide-react';

interface BlogAuthor {
  name: string;
  avatar: string;
  role: string;
  verified: boolean;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  publishedAt: string;
  author: BlogAuthor;
  views?: number;
}

const INITIAL_BLOGS: BlogPost[] = [
  {
    _id: "blog-seo-secrets",
    title: "Zooda's SEO Secrets: How to Propel Your Shop to Page 1 of Search Engines",
    slug: "seo-secrets-to-propel-your-shop",
    category: "SEO Tips",
    readTime: "4 min read",
    excerpt: "Learn the master strategies to boost your shop's indexing, build premium keywords, and structure your metadata so customers can find your services instantly.",
    content: `
      <p>In the digital age, having an incredible service or store is only half the battle. The real challenge is making sure customers can find you when they search. <strong>Search Engine Optimization (SEO)</strong> is the premium vehicle that bridges this gap.</p>
      <p>Here are the master-class strategies to propel your storefront to Page 1 of search engine indexes:</p>
      <ol>
        <li><strong>Focus on Intent-Based Keywords:</strong> Do not just target "plumber". Target "expert emergency plumber in Vijayawada". Long-tail keywords have lower competition and much higher conversion rates.</li>
        <li><strong>Fine-Tune Your Meta Description:</strong> Your meta description is your ad copy. Keep it between 120 and 160 characters, and make sure it has a compelling Call to Action (CTA).</li>
        <li><strong>Optimize Your Alt Image Tags:</strong> Search engines cannot see images; they read them. Adding detailed alt text like <em class="wysiwyg-text-orange">"Vijayawada Local Shop Storefront Showcase"</em> allows search crawlers to catalog your images.</li>
      </ol>
      <p>By integrating these optimizations into your business facts page, you ensure maximum local reach. Feel free to explore our Zooda Business Network to see how other top local merchants structure their profiles for peak discovery!</p>
    `,
    imageUrl: "https://picsum.photos/600/350?random=1",
    metaTitle: "Zooda's SEO Secrets: Boost Local Business Search Rankings",
    metaDescription: "Master strategies to boost your local shop search engine rankings, write killer meta descriptions, and build high-converting keywords instantly.",
    keywords: "seo secrets, local business marketing, search rankings, local seo description",
    publishedAt: "June 02, 2026",
    author: {
      name: "Zooda Editorial Team",
      avatar: "https://picsum.photos/100/100?random=99",
      role: "SEO & Growth Specialists",
      verified: true
    },
    views: 142
  },
  {
    _id: "blog-ai-sales",
    title: "Mastering the AI Chat Assistant: Tapping into Automated Conversational Sales",
    slug: "tapping-into-automated-sales-ai",
    category: "AI Storefronts",
    readTime: "5 min read",
    excerpt: "Uncover how integrating custom business facts into Zooda's intelligent conversational assistant automates merchant workflows and turns visitors into customers.",
    content: `
      <p>Automated chat is no longer a luxury; it is the cornerstone of premium merchant workflows. Integrating an intelligent conversational agent means you are open for business 24 hours a day, 7 days a week.</p>
      <p>Here is how you can leverage Zooda AI Chat Integration to supercharge your merchant operations:</p>
      <ul>
        <li><strong>Feed Exact Store Facts:</strong> Upload your business hours, refund policy, and product availability directly into the model to guarantee accurate conversational answers.</li>
        <li><strong>Automatic Lead Capture:</strong> Let the AI gather customer names, phone numbers, and query descriptions while you sleep, populating your dashboard instantly.</li>
        <li><strong>Personalized Discounts:</strong> Train the assistant to trigger premium micro-discounts during engagement spikes to turn passive visitors into buyers.</li>
      </ul>
      <p>Merchants who have active AI assistants report a 140% spike in direct inquiries and a significant reduction in support email workloads. Launch your own merchant portal on the Zooda Client Dashboard and activate your conversational growth engine today!</p>
    `,
    imageUrl: "https://picsum.photos/600/350?random=2",
    metaTitle: "Mastering the AI Chat Assistant: Automated Conversational Sales",
    metaDescription: "Discover how integrating precise business facts into Zooda's AI conversational assistant automates support, captures leads, and grows merchant sales.",
    keywords: "conversational ai, zooda assistant, merchant automation, shop chat bot",
    publishedAt: "June 01, 2026",
    author: {
      name: "Zooda Tech Labs",
      avatar: "https://picsum.photos/100/100?random=98",
      role: "Conversational AI Engineers",
      verified: true
    },
    views: 98
  }
];

export function AdminBlogsTab() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("SEO Tips");
  const [readTime, setReadTime] = useState("4 min read");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/600/350?random=10");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [seoScore, setSeoScore] = useState(0);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  const editorRef = useRef<HTMLDivElement>(null);

  // Load blogs from localStorage
  const loadBlogs = () => {
    const stored = localStorage.getItem("zooda_blogs");
    if (!stored) {
      localStorage.setItem("zooda_blogs", JSON.stringify(INITIAL_BLOGS));
      setBlogs(INITIAL_BLOGS);
    } else {
      try {
        setBlogs(JSON.parse(stored));
      } catch (e) {
        setBlogs(INITIAL_BLOGS);
      }
    }
  };

  const loadCategories = () => {
    const stored = localStorage.getItem("zooda_blog_categories");
    if (!stored) {
      const initial = ["SEO Tips", "AI Storefronts", "Local Business"];
      localStorage.setItem("zooda_blog_categories", JSON.stringify(initial));
      setCategoriesList(initial);
    } else {
      try {
        setCategoriesList(JSON.parse(stored));
      } catch (e) {
        setCategoriesList(["SEO Tips", "AI Storefronts", "Local Business"]);
      }
    }
  };

  useEffect(() => {
    loadBlogs();
    loadCategories();
  }, []);

  // Sync content HTML visually inside the editor ref once initially without cursor jumps
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content === ""]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Selection saving & restoring for WYSIWYG
  const savedSelectionRef = useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current && editorRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  const resizeSelectedImage = (size: 'small' | 'medium' | 'full') => {
    if (selectedImage) {
      selectedImage.classList.remove('blog-img-small', 'blog-img-medium', 'blog-img-full');
      
      if (size === 'small') {
        selectedImage.classList.add('blog-img-small');
        selectedImage.style.width = '30%';
      } else if (size === 'medium') {
        selectedImage.classList.add('blog-img-medium');
        selectedImage.style.width = '50%';
      } else {
        selectedImage.classList.add('blog-img-full');
        selectedImage.style.width = '100%';
      }
      handleEditorChange();
    }
  };

  const deleteSelectedImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
      handleEditorChange();
    }
  };

  const handleEditorClickOrKey = (e: any) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      setSelectedImage(target as HTMLImageElement);
    } else {
      setSelectedImage(null);
    }
  };

  const execCmd = (command: string, value: string = "") => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(command, false, value);
    handleEditorChange();
  };

  // Title changes auto-generate slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const cleaned = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
    setSlug(cleaned);
    if (!metaTitle) {
      setMetaTitle(val.slice(0, 60));
    }
  };

  // SEO Score calculation logic
  useEffect(() => {
    let score = 0;
    const focusKeyword = keywords.trim().split(",")[0]?.trim()?.toLowerCase() || "";

    if (focusKeyword && title.toLowerCase().includes(focusKeyword)) score += 15;
    if (focusKeyword && slug.toLowerCase().includes(focusKeyword)) score += 15;
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 20;
    else if (metaDescription.length > 50) score += 10;
    if (content.includes("alt=")) score += 15;
    if (content.includes("<a href=")) score += 15;
    if (content.includes("<ul>") || content.includes("<ol>")) score += 20;

    setSeoScore(score);
  }, [title, slug, content, metaDescription, keywords]);

  const startCreate = () => {
    setTitle("");
    setSlug("");
    
    // Load categories fresh
    const stored = localStorage.getItem("zooda_blog_categories");
    let cats = ["SEO Tips", "AI Storefronts", "Local Business"];
    if (stored) {
      try { cats = JSON.parse(stored); } catch(e){}
    }
    setCategoriesList(cats);
    setCategory(cats[0] || "SEO Tips");
    
    setReadTime("4 min read");
    setExcerpt("");
    setContent("");
    setImageUrl("https://picsum.photos/600/350?random=" + Math.floor(Math.random() * 100));
    setMetaTitle("");
    setMetaDescription("");
    setKeywords("");
    setEditingBlog(null);
    setIsCreating(true);
  };

  const startEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setCategory(blog.category);
    setReadTime(blog.readTime);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setImageUrl(blog.imageUrl);
    setMetaTitle(blog.metaTitle || "");
    setMetaDescription(blog.metaDescription || "");
    setKeywords(blog.keywords || "");
    
    // Load categories fresh
    const stored = localStorage.getItem("zooda_blog_categories");
    let cats = ["SEO Tips", "AI Storefronts", "Local Business"];
    if (stored) {
      try { cats = JSON.parse(stored); } catch(e){}
    }
    setCategoriesList(cats);
    
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      alert("Please populate all required fields.");
      return;
    }

    const blogPost: BlogPost = {
      _id: editingBlog ? editingBlog._id : `blog-custom-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim() || "untitled-slug",
      category,
      readTime,
      excerpt: excerpt.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim(),
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      keywords: keywords.trim() || "blog",
      publishedAt: editingBlog ? editingBlog.publishedAt : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
      author: editingBlog ? editingBlog.author : {
        name: "Zooda Admin",
        avatar: "https://picsum.photos/100/100?random=99",
        role: "Platform Administrator",
        verified: true
      },
      views: editingBlog ? (editingBlog.views || 0) : 0
    };

    let updated: BlogPost[];
    if (editingBlog) {
      updated = blogs.map(b => b._id === editingBlog._id ? blogPost : b);
    } else {
      updated = [blogPost, ...blogs];
    }

    setBlogs(updated);
    localStorage.setItem("zooda_blogs", JSON.stringify(updated));
    setIsCreating(false);
    setEditingBlog(null);
    alert("Post published successfully!");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = blogs.filter(b => b._id !== id);
      setBlogs(updated);
      localStorage.setItem("zooda_blogs", JSON.stringify(updated));
      alert("Post deleted successfully.");
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Blogs Management</h2>
          </div>
          <p className="text-muted-foreground">Publish and optimize content storefront marketing guides, tips and insights</p>
        </div>
        
        {!isCreating && (
          <button
            onClick={startCreate}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Write Article
          </button>
        )}
      </div>

      {isCreating ? (
        /* Visual Publisher Mode */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
          <form onSubmit={handleSave} className="xl:col-span-2 space-y-5">
            {/* Editor Body */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-primary" />
                  1. Article Details
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Blog Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Local Marketing Hacks to Double Retail Foot-Traffic"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">URL Path Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. local-marketing-hacks"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-between">
                    <span>Category Tag *</span>
                    <span className="text-[10px] text-primary lowercase">Admin tags preferences</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (categoriesList.length <= 1) {
                            alert("You must keep at least one category tag.");
                            return;
                          }
                          if (window.confirm(`Are you sure you want to delete the category tag "${category}"?`)) {
                            const updated = categoriesList.filter((c) => c !== category);
                            localStorage.setItem("zooda_blog_categories", JSON.stringify(updated));
                            setCategoriesList(updated);
                            setCategory(updated[0] || "");
                          }
                        }}
                        className="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 px-3.5 rounded-xl border border-rose-500/20 transition-all shrink-0 flex items-center justify-center cursor-pointer"
                        title="Delete Selected Category Tag"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        id="new-category-input-admin"
                        placeholder="Add custom preference tag..."
                        className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("new-category-input-admin") as HTMLInputElement;
                          const val = input?.value?.trim();
                          if (val) {
                            const updated = [...categoriesList];
                            if (!updated.includes(val)) {
                              updated.push(val);
                              localStorage.setItem("zooda_blog_categories", JSON.stringify(updated));
                              setCategoriesList(updated);
                            }
                            setCategory(val);
                            input.value = "";
                          }
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-between">
                    <span>Featured Image</span>
                    <span className="text-[10px] text-muted-foreground lowercase">URL or Local File</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="https://picsum.photos/600/350"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                    />
                    <label className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-dashed border-border bg-background hover:bg-muted hover:border-primary text-xs font-bold text-foreground cursor-pointer transition-all active:scale-[0.98] shrink-0">
                      <Plus className="h-4 w-4" />
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setImageUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Reading Estimation</label>
                  <input
                    type="text"
                    placeholder="4 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Excerpt description snippet *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Write a brief, highly compelling 1-2 sentence description summarizing this article."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none resize-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Visual Editor Publisher Block */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
                  <FileText className="h-4 w-4 text-primary" />
                  2. Visual Content Publisher (No HTML tags needed!)
                </h3>
                
                {/* Visual Editor Toolbar */}
                <div className="flex flex-wrap items-center gap-2 bg-muted/30 border border-border p-2 rounded-2xl shadow-sm">
                  
                  {/* Text Formatting Group */}
                  <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => execCmd("bold")}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-sm font-extrabold text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("italic")}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-sm italic text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => execCmd("underline")}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-sm underline text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
                      title="Underline"
                    >
                      U
                    </button>
                  </div>

                  {/* Layout & Typography Group */}
                  <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-xl shadow-xs">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          execCmd("formatBlock", e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="bg-transparent text-xs text-foreground focus:outline-none font-bold cursor-pointer px-2 py-1 hover:bg-muted rounded-lg border-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Typography</option>
                      <option value="H1">Heading 1</option>
                      <option value="H2">Heading 2</option>
                      <option value="H3">Heading 3</option>
                      <option value="H4">Heading 4</option>
                      <option value="H5">Heading 5</option>
                      <option value="H6">Heading 6</option>
                      <option value="P">Paragraph</option>
                    </select>
                  </div>

                  {/* Inserts & Tables Group */}
                  <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => execCmd("insertUnorderedList")}
                      className="px-2.5 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-xs font-semibold text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt("Enter hyperlink URL (e.g., https://google.com):", "https://");
                        if (url) {
                          execCmd("createLink", url);
                        }
                      }}
                      className="px-2.5 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-xs font-semibold text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
                      title="Insert Link"
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const colsInput = prompt("Enter number of columns:", "3");
                        if (colsInput === null) return;
                        const rowsInput = prompt("Enter number of rows:", "3");
                        if (rowsInput === null) return;
                        const cols = parseInt(colsInput) || 3;
                        const rows = parseInt(rowsInput) || 3;
                        if (cols > 0 && rows > 0) {
                          let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #000000; font-size: 13px;"><tbody>`;
                          for (let r = 0; r < rows; r++) {
                            tableHtml += `<tr>`;
                            for (let c = 0; c < cols; c++) {
                              if (r === 0) {
                                tableHtml += `<th style="border: 1px solid #000000; padding: 10px; color: #ffffff; background-color: #245d8c; font-weight: bold; text-align: left;">Header</th>`;
                              } else if (c === 0) {
                                tableHtml += `<td style="border: 1px solid #000000; padding: 10px; color: #000000; background-color: #ffffff; font-weight: bold;">Label</td>`;
                              } else {
                                tableHtml += `<td style="border: 1px solid #000000; padding: 10px; color: #000000; background-color: #ffffff;">Cell</td>`;
                              }
                            }
                            tableHtml += `</tr>`;
                          }
                          tableHtml += `</tbody></table><p>&nbsp;</p>`;
                          execCmd("insertHTML", tableHtml);
                        }
                      }}
                      className="px-2.5 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-xs font-semibold text-foreground transition-all duration-150 active:scale-95 cursor-pointer"
                      title="Insert Table"
                    >
                      Table
                    </button>
                  </div>

                  {/* Colors Group */}
                  <div className="flex items-center gap-1.5 bg-background border border-border p-1.5 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => execCmd("foreColor", "#0f172a")}
                      className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer bg-[#0f172a] border border-slate-300"
                      title="Dark Slate (Text)"
                    />
                    <button
                      type="button"
                      onClick={() => execCmd("foreColor", "#ef4444")}
                      className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer bg-[#ef4444] border border-red-300"
                      title="Red (Crimson)"
                    />
                    <button
                      type="button"
                      onClick={() => execCmd("foreColor", "#f97316")}
                      className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer bg-[#f97316] border border-orange-300"
                      title="Orange"
                    />
                    <button
                      type="button"
                      onClick={() => execCmd("foreColor", "#22c55e")}
                      className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer bg-[#22c55e] border border-emerald-300"
                      title="Green"
                    />
                    <button
                      type="button"
                      onClick={() => execCmd("foreColor", "#3b82f6")}
                      className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer bg-[#3b82f6] border border-blue-300"
                      title="Blue"
                    />
                    <button
                      type="button"
                      onClick={() => execCmd("foreColor", "#a855f7")}
                      className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer bg-[#a855f7] border border-purple-300"
                      title="Purple"
                    />
                    <span className="w-px h-4 bg-border mx-0.5" />
                    <div className="flex items-center justify-center w-5 h-5 hover:scale-110 transition-all" title="Choose Custom Color">
                      <input
                        type="color"
                        onChange={(e) => execCmd("foreColor", e.target.value)}
                        className="w-5 h-5 rounded-full cursor-pointer border border-border p-0 bg-transparent overflow-hidden"
                      />
                    </div>
                  </div>

                  {/* Media Insert Group */}
                  <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-xl shadow-xs">
                    <label className="px-3 h-8 flex items-center justify-center gap-1.5 rounded-lg hover:bg-muted text-xs font-bold text-foreground cursor-pointer transition-all duration-150 active:scale-95">
                      <Image className="h-3.5 w-3.5" />
                      Add Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                const imgHtml = `<img src="${reader.result}" alt="Visual Image" style="width: 100%; max-width: 100%; border-radius: 12px; margin: 12px 0; object-fit: cover;" class="blog-img-full" />`;
                                execCmd("insertHTML", imgHtml);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Image Context Sizing Actions */}
                  {selectedImage && (
                    <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-1 rounded-xl shadow-xs animate-fade-in">
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-wide px-1">Img Size:</span>
                      <button
                        type="button"
                        onClick={() => resizeSelectedImage('small')}
                        className={`px-2.5 h-6 rounded-lg text-[10px] font-bold transition-all duration-150 active:scale-95 cursor-pointer ${selectedImage.classList.contains('blog-img-small') ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted text-foreground border border-border'}`}
                      >
                        30%
                      </button>
                      <button
                        type="button"
                        onClick={() => resizeSelectedImage('medium')}
                        className={`px-2.5 h-6 rounded-lg text-[10px] font-bold transition-all duration-150 active:scale-95 cursor-pointer ${selectedImage.classList.contains('blog-img-medium') ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted text-foreground border border-border'}`}
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        onClick={() => resizeSelectedImage('full')}
                        className={`px-2.5 h-6 rounded-lg text-[10px] font-bold transition-all duration-150 active:scale-95 cursor-pointer ${selectedImage.classList.contains('blog-img-full') || (!selectedImage.classList.contains('blog-img-small') && !selectedImage.classList.contains('blog-img-medium')) ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted text-foreground border border-border'}`}
                      >
                        100%
                      </button>
                      
                      <span className="w-px h-4 bg-primary/20 mx-1" />
                      
                      <button
                        type="button"
                        onClick={deleteSelectedImage}
                        className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center"
                        title="Delete Image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              </div>

              <div className="space-y-1">
                <div
                  id="admin-wysiwyg-visual-editor"
                  ref={editorRef}
                  contentEditable={true}
                  onBlur={() => {
                    saveSelection();
                    handleEditorChange();
                  }}
                  onClick={handleEditorClickOrKey}
                  onKeyUp={(e) => {
                    saveSelection();
                    handleEditorClickOrKey(e);
                  }}
                  onInput={handleEditorChange}
                  className="w-full bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:border-primary focus:outline-none min-h-[250px] max-h-[450px] overflow-y-auto leading-relaxed space-y-4"
                  style={{ whiteSpace: "pre-wrap" }}
                  placeholder="Write your beautiful article content here... Highlighting words to format or click toolbar buttons."
                />
                <p className="text-[10px] text-muted-foreground">
                  Visual Compose Active: Type naturally, style selections, and upload images directly from your computer or mobile. No HTML tags required!
                </p>
              </div>
            </div>

            {/* SEO Optimization Meta Data */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider border-b border-border pb-3">
                <AlertCircle className="h-4 w-4 text-primary" />
                3. SEO Meta Tags
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Focus Keyword *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. storefront hacks"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Meta Title Tag</label>
                  <input
                    type="text"
                    placeholder="Vijayawada Shop Marketing Guides | Zooda"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex justify-between">
                    <span>Meta Description Tag</span>
                    <span className={metaDescription.length >= 120 && metaDescription.length <= 160 ? "text-emerald-500 font-bold" : "text-muted-foreground"}>
                      ({metaDescription.length} chars - optimal: 120-160)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Write a precise search engine snippet description (120-160 characters)."
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none resize-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {editingBlog ? "Save Updates" : "Publish Guide"}
              </button>
            </div>
          </form>

          {/* Sidebar SEO score & live preview pane */}
          <div className="space-y-6">
            {/* Scorecard Panel */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                SEO Scoreboard
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">SEO Quality:</span>
                  <span className={`text-lg font-bold ${seoScore >= 80 ? "text-emerald-500" : (seoScore >= 50 ? "text-amber-500" : "text-destructive")}`}>
                    {seoScore} / 100
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${seoScore}%` }}
                    className={`h-full transition-all duration-300 ${seoScore >= 80 ? "bg-emerald-500" : (seoScore >= 50 ? "bg-amber-500" : "bg-destructive")}`}
                  />
                </div>
              </div>

              {/* Checks list */}
              <div className="space-y-2.5 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className={`h-4 w-4 ${title.toLowerCase().includes(keywords.toLowerCase()) && keywords.trim() !== "" ? "text-emerald-500" : "text-muted/40"}`} />
                  <span className="text-foreground">Keyword in Title</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className={`h-4 w-4 ${slug.toLowerCase().includes(keywords.toLowerCase()) && keywords.trim() !== "" ? "text-emerald-500" : "text-muted/40"}`} />
                  <span className="text-foreground">Keyword in URL Slug</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className={`h-4 w-4 ${metaDescription.length >= 120 && metaDescription.length <= 160 ? "text-emerald-500" : "text-muted/40"}`} />
                  <span className="text-foreground">Meta Description (120-160)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className={`h-4 w-4 ${content.includes("alt=") ? "text-emerald-500" : "text-muted/40"}`} />
                  <span className="text-foreground">Image Alt attributes</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className={`h-4 w-4 ${content.includes("<a href=") ? "text-emerald-500" : "text-muted/40"}`} />
                  <span className="text-foreground">Outbound hyperlinks</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle className={`h-4 w-4 ${content.includes("<ul>") || content.includes("<ol>") ? "text-emerald-500" : "text-muted/40"}`} />
                  <span className="text-foreground">Lists inside body</span>
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                Live Preview
              </h3>

              <div className="border border-border rounded-xl p-4 bg-background max-h-[300px] overflow-y-auto scrollbar-thin">
                {title ? (
                  <h4 className="text-sm font-extrabold text-foreground mb-2">{title}</h4>
                ) : (
                  <p className="text-xs italic text-muted-foreground">Draft title here...</p>
                )}
                
                {imageUrl && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted border border-border mb-3">
                    <img src={imageUrl} alt="Featured cover" className="w-full h-full object-cover" />
                  </div>
                )}

                <div 
                  className="text-xs text-foreground/80 leading-relaxed space-y-3 blog-preview-content"
                  dangerouslySetInnerHTML={{ __html: content || "<p className='italic text-muted-foreground'>Live visual rendering appears here...</p>" }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Blog posts lists view */
        <div className="space-y-4 animate-fade-in">
          {/* Search bar */}
          <div className="flex items-center bg-card border border-border px-4 py-3 rounded-2xl shadow-sm">
            <span className="material-icons text-muted-foreground mr-3 text-sm">search</span>
            <input
              type="text"
              placeholder="Search published articles, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none border-none placeholder:text-muted-foreground"
            />
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBlogs.map((blog) => (
                <div key={blog._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full">
                  
                  {/* Media */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border">
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg">
                      {blog.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-semibold">
                        <span>{blog.publishedAt}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {blog.views || 0} views
                        </span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm leading-snug line-clamp-2">
                        {blog.title}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-border w-full">
                      <div className="flex items-center gap-1.5">
                        <img src={blog.author.avatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-border" />
                        <span className="text-[10px] text-foreground font-bold">{blog.author.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(blog)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                          title="Edit Post"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-card border border-border p-12 rounded-2xl max-w-md mx-auto space-y-3">
              <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <h4 className="font-bold text-foreground">No posts found</h4>
              <p className="text-muted-foreground text-xs">Publish your first blog post or storefront marketing guide by clicking "Write Article" above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
