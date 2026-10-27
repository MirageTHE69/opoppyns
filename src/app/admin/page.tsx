"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./admin.css";
import type { Post, Block } from "@/content/blog";
import type { Service } from "@/content/services";
import type { PortfolioProject, SiteSettings, ContentDatabase } from "@/lib/data";

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // App data state
  const [tab, setTab] = useState<"dashboard" | "blogs" | "services" | "portfolio" | "settings">("dashboard");
  const [data, setData] = useState<ContentDatabase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Modals state
  const [blogModal, setBlogModal] = useState<{ open: boolean; isNew: boolean; post: Post } | null>(null);
  const [serviceModal, setServiceModal] = useState<{ open: boolean; isNew: boolean; service: Service } | null>(null);
  const [portfolioModal, setPortfolioModal] = useState<{ open: boolean; isNew: boolean; item: PortfolioProject } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "blog" | "service" | "portfolio";
    id: string;
    title: string;
  } | null>(null);

  // Password change state
  const [pwdChange, setPwdChange] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdStatus, setPwdStatus] = useState<{ message: string; error?: boolean } | null>(null);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Check initial login
  useEffect(() => {
    const token = localStorage.getItem("poppyns_admin_auth");
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
    setIsAuthChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        localStorage.setItem("poppyns_admin_auth", json.token);
        setIsAuthenticated(true);
        fetchData();
        showToast("Welcome to Poppyns Admin Panel", "success");
      } else {
        setAuthError(json.error || "Incorrect password. Default is admin123");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("poppyns_admin_auth");
    setIsAuthenticated(false);
    setData(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        showToast("Failed to load content data", "error");
      }
    } catch {
      showToast("Network error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveDatabase = async (updated: Partial<ContentDatabase>, successMsg = "Saved successfully") => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        showToast(successMsg, "success");
        return true;
      } else {
        showToast(json.error || "Failed to save", "error");
        return false;
      }
    } catch {
      showToast("Network error while saving", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Image file upload helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    showToast("Uploading media...", "info");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        showToast("Image uploaded successfully!", "success");
        return json.url;
      } else {
        showToast(json.error || "Upload failed", "error");
        return null;
      }
    } catch {
      showToast("Upload network error", "error");
      return null;
    }
  };

  // ------------------ BLOG HANDLERS ------------------
  const openNewBlogModal = () => {
    const newPost: Post = {
      slug: `article-${Date.now().toString().slice(-4)}`,
      title: "",
      category: "Brands",
      date: new Date().toISOString().split("T")[0],
      readTime: "4 min read",
      excerpt: "",
      cover: {
        src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&q=80&auto=format",
        alt: "Cover image",
      },
      body: [
        { type: "p", text: "Start writing your article here..." },
        { type: "h2", text: "Key Takeaways" },
        { type: "p", text: "Explain your points clearly and concisely." },
      ],
    };
    setBlogModal({ open: true, isNew: true, post: newPost });
  };

  const saveBlogPost = async () => {
    if (!blogModal || !data) return;
    const post = blogModal.post;

    if (!post.title.trim()) {
      showToast("Please enter an article title", "error");
      return;
    }
    if (!post.slug.trim()) {
      post.slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    let updatedPosts = [...data.posts];
    if (blogModal.isNew) {
      if (updatedPosts.some((p) => p.slug === post.slug)) {
        post.slug = `${post.slug}-${Date.now().toString().slice(-4)}`;
      }
      updatedPosts = [post, ...updatedPosts];
    } else {
      updatedPosts = updatedPosts.map((p) => (p.slug === post.slug ? post : p));
    }

    const success = await saveDatabase({ posts: updatedPosts }, "Article saved successfully!");
    if (success) {
      setBlogModal(null);
    }
  };

  const deleteBlogPost = async (slug: string) => {
    if (!data) return;
    const updated = data.posts.filter((p) => p.slug !== slug);
    await saveDatabase({ posts: updated }, "Article deleted");
    setDeleteConfirm(null);
  };

  // ------------------ SERVICE HANDLERS ------------------
  const openNewServiceModal = () => {
    const newService: Service = {
      slug: `service-${Date.now().toString().slice(-4)}`,
      title: "",
      tagline: "Sharp perspective for ambitious brands.",
      intro: "Describe how this service helps clients transform their communication.",
      items: [
        { name: "Deliverable 1", body: "Detailed description of what the client gets." },
        { name: "Deliverable 2", body: "Detailed description of what the client gets." },
      ],
      steps: [
        { title: "Discovery", body: "Listening, auditing and finding the core truth." },
        { title: "Execution", body: "Crafting and building with relentless precision." },
      ],
    };
    setServiceModal({ open: true, isNew: true, service: newService });
  };

  const saveService = async () => {
    if (!serviceModal || !data) return;
    const svc = serviceModal.service;

    if (!svc.title.trim()) {
      showToast("Please enter a service title", "error");
      return;
    }
    if (!svc.slug.trim()) {
      svc.slug = svc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    let updated = [...data.services];
    if (serviceModal.isNew) {
      if (updated.some((s) => s.slug === svc.slug)) {
        svc.slug = `${svc.slug}-${Date.now().toString().slice(-4)}`;
      }
      updated = [...updated, svc];
    } else {
      updated = updated.map((s) => (s.slug === svc.slug ? svc : s));
    }

    const success = await saveDatabase({ services: updated }, "Service saved successfully!");
    if (success) {
      setServiceModal(null);
    }
  };

  const deleteService = async (slug: string) => {
    if (!data) return;
    const updated = data.services.filter((s) => s.slug !== slug);
    await saveDatabase({ services: updated }, "Service deleted");
    setDeleteConfirm(null);
  };

  // ------------------ PORTFOLIO HANDLERS ------------------
  const openNewPortfolioModal = () => {
    const newItem: PortfolioProject = {
      id: `proj-${Date.now().toString().slice(-6)}`,
      title: "",
      category: "Branding",
      year: new Date().getFullYear().toString(),
      alt: "Project showcase",
      src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=80&auto=format",
      link: "#work",
    };
    setPortfolioModal({ open: true, isNew: true, item: newItem });
  };

  const savePortfolioItem = async () => {
    if (!portfolioModal || !data) return;
    const item = portfolioModal.item;

    if (!item.title.trim()) {
      showToast("Please enter a project title", "error");
      return;
    }
    if (!item.src.trim()) {
      showToast("Please provide an image URL or upload one", "error");
      return;
    }

    let updated = [...data.portfolio];
    if (portfolioModal.isNew) {
      updated = [item, ...updated];
    } else {
      updated = updated.map((p) => (p.id === item.id ? item : p));
    }

    const success = await saveDatabase({ portfolio: updated }, "Portfolio project saved!");
    if (success) {
      setPortfolioModal(null);
    }
  };

  const deletePortfolioItem = async (id: string) => {
    if (!data) return;
    const updated = data.portfolio.filter((p) => p.id !== id);
    await saveDatabase({ portfolio: updated }, "Project removed");
    setDeleteConfirm(null);
  };

  const movePortfolioItem = async (index: number, direction: "up" | "down") => {
    if (!data) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.portfolio.length) return;

    const updated = [...data.portfolio];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    await saveDatabase({ portfolio: updated }, "Reordered project");
  };

  // ------------------ SETTINGS & PASSWORD ------------------
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    await saveDatabase({ settings: data.settings }, "Site settings updated!");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus(null);

    if (pwdChange.newPassword !== pwdChange.confirmPassword) {
      setPwdStatus({ message: "New passwords do not match", error: true });
      return;
    }
    if (pwdChange.newPassword.length < 4) {
      setPwdStatus({ message: "Password must be at least 4 characters", error: true });
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "changePassword",
          oldPassword: pwdChange.oldPassword,
          newPassword: pwdChange.newPassword,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPwdStatus({ message: "Password changed successfully! Keep it safe.", error: false });
        setPwdChange({ oldPassword: "", newPassword: "", confirmPassword: "" });
        showToast("Password updated successfully!", "success");
      } else {
        setPwdStatus({ message: json.error || "Failed to update password", error: true });
      }
    } catch {
      setPwdStatus({ message: "Network error", error: true });
    }
  };

  const handleResetData = async () => {
    if (!confirm("Are you sure you want to reset all content (blogs, services, portfolio, settings) to initial default demo data?")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
        showToast("Site reset to default demo data!", "success");
      } else {
        showToast("Reset failed", "error");
      }
    } catch {
      showToast("Network error during reset", "error");
    } finally {
      setSaving(false);
    }
  };

  // Render Login screen if not logged in
  if (isAuthChecking) {
    return (
      <div className="adm-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--adm-muted)", fontSize: "14px" }}>Loading Poppyns Admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="adm-root">
        <div className="adm-login-wrap">
          <div className="adm-login-card">
            <div className="adm-login-brand">
              <span className="adm-login-badge">POPPYNS CONTROL CENTER</span>
              <h1 className="adm-login-title">Admin Sign In</h1>
              <p className="adm-login-sub">Manage blogs, portfolio projects, services & copy</p>
            </div>

            {authError && <div className="adm-error-msg">⚠️ {authError}</div>}

            <form onSubmit={handleLogin}>
              <div className="adm-form-group">
                <label className="adm-label" htmlFor="adm-pwd">
                  Admin Password
                </label>
                <div className="adm-input-wrap">
                  <input
                    id="adm-pwd"
                    type={showPassword ? "text" : "password"}
                    className="adm-input"
                    placeholder="Enter admin password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    className="adm-input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="adm-btn-primary" disabled={authLoading}>
                {authLoading ? "Verifying..." : "Unlock Admin Panel →"}
              </button>
            </form>

            <div className="adm-login-hint">
              <span>Default password:</span>
              <code>admin123</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-root">
      {/* Toast popup */}
      {toast && (
        <div className={`adm-toast ${toast.type}`}>
          {toast.type === "success" && "✓ "}
          {toast.type === "error" && "✕ "}
          {toast.type === "info" && "ℹ "}
          {toast.message}
        </div>
      )}

      {/* Top Header */}
      <header className="adm-header">
        <div className="adm-header-left">
          <Link href="/admin" className="adm-brand-logo">
            <span>POPPYNS</span>
            <span className="adm-brand-tag">CMS ADMIN</span>
          </Link>

          <nav className="adm-nav">
            <button
              className={`adm-nav-btn ${tab === "dashboard" ? "active" : ""}`}
              onClick={() => setTab("dashboard")}
            >
              📊 Overview
            </button>
            <button
              className={`adm-nav-btn ${tab === "blogs" ? "active" : ""}`}
              onClick={() => setTab("blogs")}
            >
              ✍️ Blogs ({data?.posts.length ?? 0})
            </button>
            <button
              className={`adm-nav-btn ${tab === "services" ? "active" : ""}`}
              onClick={() => setTab("services")}
            >
              ⚡ Services ({data?.services.length ?? 0})
            </button>
            <button
              className={`adm-nav-btn ${tab === "portfolio" ? "active" : ""}`}
              onClick={() => setTab("portfolio")}
            >
              🎨 Portfolio ({data?.portfolio.length ?? 0})
            </button>
            <button
              className={`adm-nav-btn ${tab === "settings" ? "active" : ""}`}
              onClick={() => setTab("settings")}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <div className="adm-header-right">
          <Link href="/" target="_blank" className="adm-site-link">
            <span>Live Site ↗</span>
          </Link>
          <button onClick={handleLogout} className="adm-logout-btn">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="adm-main">
        {loading && !data ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--adm-muted)" }}>
            Loading site content...
          </div>
        ) : (
          <>
            {/* ===================== TAB: DASHBOARD ===================== */}
            {tab === "dashboard" && (
              <div>
                <div className="adm-section-header">
                  <div>
                    <h1 className="adm-section-title">Dashboard Overview</h1>
                    <p className="adm-section-sub">
                      All your live frontend content is synced directly from here.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link href="/" target="_blank" className="adm-btn-secondary">
                      View Live Website ↗
                    </Link>
                  </div>
                </div>

                <div className="adm-stats-grid">
                  <div className="adm-stat-card" onClick={() => setTab("blogs")}>
                    <div className="adm-stat-top">
                      <span className="adm-stat-label">Published Articles</span>
                      <span className="adm-stat-icon">✍️</span>
                    </div>
                    <div className="adm-stat-value">{data?.posts.length ?? 0}</div>
                    <div className="adm-stat-desc">Click to create or edit blog articles →</div>
                  </div>

                  <div className="adm-stat-card" onClick={() => setTab("services")}>
                    <div className="adm-stat-top">
                      <span className="adm-stat-label">Active Services</span>
                      <span className="adm-stat-icon">⚡</span>
                    </div>
                    <div className="adm-stat-value">{data?.services.length ?? 0}</div>
                    <div className="adm-stat-desc">Manage agency offerings and steps →</div>
                  </div>

                  <div className="adm-stat-card" onClick={() => setTab("portfolio")}>
                    <div className="adm-stat-top">
                      <span className="adm-stat-label">Portfolio Projects</span>
                      <span className="adm-stat-icon">🎨</span>
                    </div>
                    <div className="adm-stat-value">{data?.portfolio.length ?? 0}</div>
                    <div className="adm-stat-desc">Showcase case studies and imagery →</div>
                  </div>

                  <div className="adm-stat-card" onClick={() => setTab("settings")}>
                    <div className="adm-stat-top">
                      <span className="adm-stat-label">Site Identity</span>
                      <span className="adm-stat-icon">⚙️</span>
                    </div>
                    <div className="adm-stat-value" style={{ fontSize: "20px", marginTop: "8px" }}>
                      {data?.settings.siteName || "Poppyns"}
                    </div>
                    <div className="adm-stat-desc">Hero, contact email & password settings →</div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius-lg)", padding: "28px", marginBottom: "32px" }}>
                  <h3 style={{ fontFamily: "var(--adm-font-serif)", fontSize: "18px", margin: "0 0 16px 0", color: "#fff" }}>
                    Quick Management Actions
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    <button onClick={openNewBlogModal} className="adm-btn-primary" style={{ width: "auto" }}>
                      + Write New Blog Post
                    </button>
                    <button onClick={openNewPortfolioModal} className="adm-btn-secondary">
                      + Add Portfolio Project
                    </button>
                    <button onClick={openNewServiceModal} className="adm-btn-secondary">
                      + Add New Service
                    </button>
                    <button onClick={fetchData} className="adm-btn-secondary">
                      🔄 Refresh Content
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB: BLOGS ===================== */}
            {tab === "blogs" && (
              <div>
                <div className="adm-section-header">
                  <div>
                    <h1 className="adm-section-title">Blog Articles Manager</h1>
                    <p className="adm-section-sub">
                      Create, edit, and organize articles published to /blog and the homepage.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={openNewBlogModal} className="adm-btn-primary" style={{ width: "auto" }}>
                      + Write New Post
                    </button>
                  </div>
                </div>

                <div className="adm-grid">
                  {data?.posts.map((post) => (
                    <div key={post.slug} className="adm-card">
                      <div className="adm-card-media">
                        <img src={post.cover.src} alt={post.cover.alt || post.title} />
                      </div>
                      <div className="adm-card-content">
                        <div className="adm-card-meta">
                          <span className="adm-tag">{post.category}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="adm-card-title">{post.title}</h3>
                        <p className="adm-card-desc">{post.excerpt}</p>
                        <div className="adm-card-actions">
                          <Link href={`/blog/${post.slug}`} target="_blank" style={{ fontSize: "12px", color: "var(--adm-muted)" }}>
                            Preview ↗
                          </Link>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => setBlogModal({ open: true, isNew: false, post: JSON.parse(JSON.stringify(post)) })}
                              className="adm-btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  open: true,
                                  type: "blog",
                                  id: post.slug,
                                  title: post.title,
                                })
                              }
                              className="adm-btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== TAB: SERVICES ===================== */}
            {tab === "services" && (
              <div>
                <div className="adm-section-header">
                  <div>
                    <h1 className="adm-section-title">Services & Offerings</h1>
                    <p className="adm-section-sub">
                      Control the service accordions on the homepage and their dedicated detail pages.
                    </p>
                  </div>
                  <button onClick={openNewServiceModal} className="adm-btn-primary" style={{ width: "auto" }}>
                    + Add New Service
                  </button>
                </div>

                <div>
                  {data?.services.map((svc, i) => (
                    <div key={svc.slug} className="adm-service-card">
                      <div className="adm-service-head">
                        <div>
                          <div className="adm-service-title">
                            <span style={{ color: "var(--adm-muted)", fontSize: "14px", fontFamily: "var(--adm-font-mono)" }}>
                              0{i + 1}
                            </span>
                            <span>{svc.title}</span>
                            <span style={{ fontSize: "11px", color: "var(--adm-muted)" }}>
                              (/{svc.slug})
                            </span>
                          </div>
                          <div className="adm-service-tagline">&ldquo;{svc.tagline}&rdquo;</div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <Link href={`/services/${svc.slug}`} target="_blank" className="adm-btn-secondary" style={{ fontSize: "12px", padding: "6px 10px" }}>
                            View Page ↗
                          </Link>
                          <button
                            onClick={() => setServiceModal({ open: true, isNew: false, service: JSON.parse(JSON.stringify(svc)) })}
                            className="adm-btn-secondary"
                            style={{ fontSize: "12px", padding: "6px 10px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: "service",
                                id: svc.slug,
                                title: svc.title,
                              })
                            }
                            className="adm-btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: "13px", color: "var(--adm-muted)", margin: "0 0 12px 0", lineHeight: 1.45 }}>
                        {svc.intro}
                      </p>

                      <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--adm-muted)", fontWeight: 600 }}>
                        Offerings ({svc.items.length}):
                      </div>
                      <div className="adm-service-pills">
                        {svc.items.map((item, idx) => (
                          <span key={idx} className="adm-pill">
                            ✦ {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== TAB: PORTFOLIO ===================== */}
            {tab === "portfolio" && (
              <div>
                <div className="adm-section-header">
                  <div>
                    <h1 className="adm-section-title">Portfolio & Case Studies</h1>
                    <p className="adm-section-sub">
                      Showcase visual work on the homepage gallery with custom images, tags, and titles.
                    </p>
                  </div>
                  <button onClick={openNewPortfolioModal} className="adm-btn-primary" style={{ width: "auto" }}>
                    + Add Project
                  </button>
                </div>

                <div className="adm-grid">
                  {data?.portfolio.map((proj, i) => (
                    <div key={proj.id} className="adm-card">
                      <div className="adm-card-media" style={{ height: "220px" }}>
                        <img src={proj.src} alt={proj.alt || proj.title} />
                      </div>
                      <div className="adm-card-content">
                        <div className="adm-card-meta">
                          <span className="adm-tag">{proj.category || "Case Study"}</span>
                          <span>{proj.year || "2026"}</span>
                        </div>
                        <h3 className="adm-card-title">{proj.title || "Untitled Project"}</h3>
                        <div className="adm-card-actions">
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              onClick={() => movePortfolioItem(i, "up")}
                              disabled={i === 0}
                              className="adm-btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              title="Move left/up"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => movePortfolioItem(i, "down")}
                              disabled={i === (data?.portfolio.length ?? 0) - 1}
                              className="adm-btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              title="Move right/down"
                            >
                              →
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => setPortfolioModal({ open: true, isNew: false, item: { ...proj } })}
                              className="adm-btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  open: true,
                                  type: "portfolio",
                                  id: proj.id,
                                  title: proj.title || "Project",
                                })
                              }
                              className="adm-btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== TAB: SETTINGS ===================== */}
            {tab === "settings" && data && (
              <div style={{ maxWidth: "800px" }}>
                <div className="adm-section-header">
                  <div>
                    <h1 className="adm-section-title">Site Settings & Hero Copy</h1>
                    <p className="adm-section-sub">
                      Update general brand text, contact info, and admin access credentials.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSettingsSave} style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius-lg)", padding: "28px", marginBottom: "32px" }}>
                  <h3 style={{ fontFamily: "var(--adm-font-serif)", fontSize: "18px", margin: "0 0 20px 0", color: "#fff" }}>
                    Brand & Contact Details
                  </h3>

                  <div className="adm-form-group">
                    <label className="adm-label">Agency / Brand Name</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={data.settings.siteName}
                      onChange={(e) => setData({ ...data, settings: { ...data.settings, siteName: e.target.value } })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="adm-form-group">
                      <label className="adm-label">Contact Email</label>
                      <input
                        type="email"
                        className="adm-input"
                        value={data.settings.email}
                        onChange={(e) => setData({ ...data, settings: { ...data.settings, email: e.target.value } })}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Instagram Link</label>
                      <input
                        type="url"
                        className="adm-input"
                        value={data.settings.instagram}
                        onChange={(e) => setData({ ...data, settings: { ...data.settings, instagram: e.target.value } })}
                      />
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Footer Tagline</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={data.settings.tagline}
                      onChange={(e) => setData({ ...data, settings: { ...data.settings, tagline: e.target.value } })}
                    />
                  </div>

                  <button type="submit" className="adm-btn-primary" style={{ width: "auto" }} disabled={saving}>
                    {saving ? "Saving Changes..." : "Save Brand Settings"}
                  </button>
                </form>

                {/* Password Change Box */}
                <form onSubmit={handleChangePassword} style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius-lg)", padding: "28px", marginBottom: "32px" }}>
                  <h3 style={{ fontFamily: "var(--adm-font-serif)", fontSize: "18px", margin: "0 0 8px 0", color: "#fff" }}>
                    Change Admin Password
                  </h3>
                  <p style={{ color: "var(--adm-muted)", fontSize: "13px", margin: "0 0 20px 0" }}>
                    Set a simple, custom password to lock access to this control center.
                  </p>

                  {pwdStatus && (
                    <div className={pwdStatus.error ? "adm-error-msg" : "adm-error-msg"} style={!pwdStatus.error ? { background: "rgba(34, 197, 94, 0.12)", color: "#86efac", borderColor: "rgba(34, 197, 94, 0.3)" } : {}}>
                      {pwdStatus.message}
                    </div>
                  )}

                  <div className="adm-form-group">
                    <label className="adm-label">Current Password</label>
                    <input
                      type="password"
                      className="adm-input"
                      value={pwdChange.oldPassword}
                      onChange={(e) => setPwdChange({ ...pwdChange, oldPassword: e.target.value })}
                      required
                      placeholder="Enter current password (default is admin123)"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="adm-form-group">
                      <label className="adm-label">New Password</label>
                      <input
                        type="password"
                        className="adm-input"
                        value={pwdChange.newPassword}
                        onChange={(e) => setPwdChange({ ...pwdChange, newPassword: e.target.value })}
                        required
                        placeholder="New password"
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="adm-input"
                        value={pwdChange.confirmPassword}
                        onChange={(e) => setPwdChange({ ...pwdChange, confirmPassword: e.target.value })}
                        required
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <button type="submit" className="adm-btn-secondary">
                    Update Password
                  </button>
                </form>

                {/* Reset Data */}
                <div style={{ border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--adm-radius-lg)", padding: "24px", background: "rgba(239, 68, 68, 0.05)" }}>
                  <h4 style={{ color: "var(--adm-danger)", margin: "0 0 6px 0" }}>Factory Reset Demo Content</h4>
                  <p style={{ color: "var(--adm-muted)", fontSize: "13px", margin: "0 0 16px 0" }}>
                    Restores all blogs, services, and portfolio back to their initial template states.
                  </p>
                  <button type="button" onClick={handleResetData} className="adm-btn-danger" disabled={saving}>
                    Reset To Default Content
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ===================== MODAL: BLOG POST ===================== */}
      {blogModal?.open && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">
                {blogModal.isNew ? "Write New Article" : "Edit Article"}
              </h2>
              <button onClick={() => setBlogModal(null)} className="adm-modal-close">
                ✕
              </button>
            </div>

            <div className="adm-modal-body">
              <div className="adm-form-group">
                <label className="adm-label">Article Title</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="e.g. Why your brand sounds like everyone else"
                  value={blogModal.post.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setBlogModal({
                      ...blogModal,
                      post: {
                        ...blogModal.post,
                        title,
                        slug: blogModal.isNew ? autoSlug : blogModal.post.slug,
                      },
                    });
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="adm-form-group">
                  <label className="adm-label">URL Slug</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={blogModal.post.slug}
                    onChange={(e) =>
                      setBlogModal({
                        ...blogModal,
                        post: { ...blogModal.post, slug: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Category</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="Brands, Craft, Strategy..."
                    value={blogModal.post.category}
                    onChange={(e) =>
                      setBlogModal({
                        ...blogModal,
                        post: { ...blogModal.post, category: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="adm-form-group">
                  <label className="adm-label">Publish Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    className="adm-input"
                    value={blogModal.post.date}
                    onChange={(e) =>
                      setBlogModal({
                        ...blogModal,
                        post: { ...blogModal.post, date: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Read Time</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. 4 min read"
                    value={blogModal.post.readTime}
                    onChange={(e) =>
                      setBlogModal({
                        ...blogModal,
                        post: { ...blogModal.post, readTime: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Excerpt / Summary</label>
                <textarea
                  className="adm-textarea"
                  rows={2}
                  placeholder="Short introductory teaser displayed on cards..."
                  value={blogModal.post.excerpt}
                  onChange={(e) =>
                    setBlogModal({
                      ...blogModal,
                      post: { ...blogModal.post, excerpt: e.target.value },
                    })
                  }
                />
              </div>

              {/* Cover Image Upload / URL */}
              <div className="adm-form-group">
                <label className="adm-label">Cover Image</label>
                <div className="adm-media-uploader">
                  {blogModal.post.cover.src && (
                    <div className="adm-media-preview">
                      <img src={blogModal.post.cover.src} alt={blogModal.post.cover.alt || "Cover"} />
                    </div>
                  )}

                  <div className="adm-upload-actions">
                    <label className="adm-file-input-btn">
                      📁 Upload File From Device
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setBlogModal({
                                ...blogModal,
                                post: {
                                  ...blogModal.post,
                                  cover: { ...blogModal.post.cover, src: url },
                                },
                              });
                            }
                          }
                        }}
                      />
                    </label>

                    <input
                      type="url"
                      className="adm-input"
                      placeholder="Or paste direct image URL (https://...)"
                      value={blogModal.post.cover.src}
                      onChange={(e) =>
                        setBlogModal({
                          ...blogModal,
                          post: {
                            ...blogModal.post,
                            cover: { ...blogModal.post.cover, src: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Article Content Blocks */}
              <div style={{ marginTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label className="adm-label">Article Content Blocks</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      className="adm-btn-secondary"
                      style={{ fontSize: "11px", padding: "4px 8px" }}
                      onClick={() => {
                        const newBlocks: Block[] = [...blogModal.post.body, { type: "p", text: "New paragraph..." }];
                        setBlogModal({ ...blogModal, post: { ...blogModal.post, body: newBlocks } });
                      }}
                    >
                      + Paragraph
                    </button>
                    <button
                      type="button"
                      className="adm-btn-secondary"
                      style={{ fontSize: "11px", padding: "4px 8px" }}
                      onClick={() => {
                        const newBlocks: Block[] = [...blogModal.post.body, { type: "h2", text: "New Section Heading" }];
                        setBlogModal({ ...blogModal, post: { ...blogModal.post, body: newBlocks } });
                      }}
                    >
                      + Section (H2)
                    </button>
                    <button
                      type="button"
                      className="adm-btn-secondary"
                      style={{ fontSize: "11px", padding: "4px 8px" }}
                      onClick={() => {
                        const newBlocks: Block[] = [...blogModal.post.body, { type: "quote", text: "A sharp insight goes here." }];
                        setBlogModal({ ...blogModal, post: { ...blogModal.post, body: newBlocks } });
                      }}
                    >
                      + Quote
                    </button>
                    <button
                      type="button"
                      className="adm-btn-secondary"
                      style={{ fontSize: "11px", padding: "4px 8px" }}
                      onClick={() => {
                        const newBlocks: Block[] = [
                          ...blogModal.post.body,
                          { type: "list", items: ["Point 1", "Point 2", "Point 3"] },
                        ];
                        setBlogModal({ ...blogModal, post: { ...blogModal.post, body: newBlocks } });
                      }}
                    >
                      + Bullet List
                    </button>
                  </div>
                </div>

                <div className="adm-blocks-container">
                  {blogModal.post.body.map((block, idx) => (
                    <div key={idx} className="adm-block-item">
                      <div className="adm-block-head">
                        <span className="adm-block-type">
                          #{idx + 1} {block.type}
                        </span>
                        <div className="adm-block-actions">
                          <button
                            type="button"
                            className="adm-btn-secondary"
                            style={{ padding: "2px 6px", fontSize: "10px" }}
                            disabled={idx === 0}
                            onClick={() => {
                              const b = [...blogModal.post.body];
                              const [moved] = b.splice(idx, 1);
                              b.splice(idx - 1, 0, moved);
                              setBlogModal({ ...blogModal, post: { ...blogModal.post, body: b } });
                            }}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="adm-btn-secondary"
                            style={{ padding: "2px 6px", fontSize: "10px" }}
                            disabled={idx === blogModal.post.body.length - 1}
                            onClick={() => {
                              const b = [...blogModal.post.body];
                              const [moved] = b.splice(idx, 1);
                              b.splice(idx + 1, 0, moved);
                              setBlogModal({ ...blogModal, post: { ...blogModal.post, body: b } });
                            }}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="adm-btn-danger"
                            style={{ padding: "2px 6px", fontSize: "10px" }}
                            onClick={() => {
                              const b = blogModal.post.body.filter((_, i) => i !== idx);
                              setBlogModal({ ...blogModal, post: { ...blogModal.post, body: b } });
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {block.type === "list" ? (
                        <textarea
                          className="adm-textarea"
                          rows={3}
                          value={block.items.join("\n")}
                          placeholder="One bullet point per line..."
                          onChange={(e) => {
                            const lines = e.target.value.split("\n");
                            const b = [...blogModal.post.body];
                            b[idx] = { type: "list", items: lines };
                            setBlogModal({ ...blogModal, post: { ...blogModal.post, body: b } });
                          }}
                        />
                      ) : (
                        <textarea
                          className="adm-textarea"
                          rows={block.type === "h2" ? 1 : block.type === "quote" ? 2 : 3}
                          value={block.text}
                          onChange={(e) => {
                            const b = [...blogModal.post.body];
                            b[idx] = { ...block, text: e.target.value };
                            setBlogModal({ ...blogModal, post: { ...blogModal.post, body: b } });
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <button onClick={() => setBlogModal(null)} className="adm-btn-secondary">
                Cancel
              </button>
              <button onClick={saveBlogPost} className="adm-btn-primary" style={{ width: "auto" }} disabled={saving}>
                {saving ? "Saving..." : "Save Article"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: SERVICE ===================== */}
      {serviceModal?.open && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">
                {serviceModal.isNew ? "Create Service" : `Edit Service (${serviceModal.service.title})`}
              </h2>
              <button onClick={() => setServiceModal(null)} className="adm-modal-close">
                ✕
              </button>
            </div>

            <div className="adm-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="adm-form-group">
                  <label className="adm-label">Service Title</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={serviceModal.service.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setServiceModal({
                        ...serviceModal,
                        service: {
                          ...serviceModal.service,
                          title,
                          slug: serviceModal.isNew ? autoSlug : serviceModal.service.slug,
                        },
                      });
                    }}
                  />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">URL Slug</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={serviceModal.service.slug}
                    onChange={(e) =>
                      setServiceModal({
                        ...serviceModal,
                        service: { ...serviceModal.service, slug: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Tagline (Italic quote on page)</label>
                <input
                  type="text"
                  className="adm-input"
                  value={serviceModal.service.tagline}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      service: { ...serviceModal.service, tagline: e.target.value },
                    })
                  }
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Intro Paragraph</label>
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={serviceModal.service.intro}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      service: { ...serviceModal.service, intro: e.target.value },
                    })
                  }
                />
              </div>

              {/* Service Items / Offerings */}
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label className="adm-label">What&apos;s Inside (Service Items)</label>
                  <button
                    type="button"
                    className="adm-btn-secondary"
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                    onClick={() => {
                      const items = [...serviceModal.service.items, { name: "New Offering", body: "Description of this deliverable." }];
                      setServiceModal({ ...serviceModal, service: { ...serviceModal.service, items } });
                    }}
                  >
                    + Add Item
                  </button>
                </div>

                {serviceModal.service.items.map((it, idx) => (
                  <div key={idx} style={{ background: "var(--adm-surface-2)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius)", padding: "12px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                      <input
                        type="text"
                        className="adm-input"
                        placeholder="Feature name"
                        value={it.name}
                        onChange={(e) => {
                          const items = [...serviceModal.service.items];
                          items[idx] = { ...it, name: e.target.value };
                          setServiceModal({ ...serviceModal, service: { ...serviceModal.service, items } });
                        }}
                      />
                      <button
                        type="button"
                        className="adm-btn-danger"
                        style={{ padding: "6px 10px" }}
                        onClick={() => {
                          const items = serviceModal.service.items.filter((_, i) => i !== idx);
                          setServiceModal({ ...serviceModal, service: { ...serviceModal.service, items } });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      className="adm-textarea"
                      rows={2}
                      placeholder="Detailed explanation..."
                      value={it.body}
                      onChange={(e) => {
                        const items = [...serviceModal.service.items];
                        items[idx] = { ...it, body: e.target.value };
                        setServiceModal({ ...serviceModal, service: { ...serviceModal.service, items } });
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Steps (How it runs) */}
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label className="adm-label">How It Runs (Process Steps)</label>
                  <button
                    type="button"
                    className="adm-btn-secondary"
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                    onClick={() => {
                      const steps = [...serviceModal.service.steps, { title: "Step Title", body: "Step details and outcomes." }];
                      setServiceModal({ ...serviceModal, service: { ...serviceModal.service, steps } });
                    }}
                  >
                    + Add Step
                  </button>
                </div>

                {serviceModal.service.steps.map((st, idx) => (
                  <div key={idx} style={{ background: "var(--adm-surface-2)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius)", padding: "12px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                      <input
                        type="text"
                        className="adm-input"
                        placeholder="Step name (e.g. Listen, Sharpen)"
                        value={st.title}
                        onChange={(e) => {
                          const steps = [...serviceModal.service.steps];
                          steps[idx] = { ...st, title: e.target.value };
                          setServiceModal({ ...serviceModal, service: { ...serviceModal.service, steps } });
                        }}
                      />
                      <button
                        type="button"
                        className="adm-btn-danger"
                        style={{ padding: "6px 10px" }}
                        onClick={() => {
                          const steps = serviceModal.service.steps.filter((_, i) => i !== idx);
                          setServiceModal({ ...serviceModal, service: { ...serviceModal.service, steps } });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      className="adm-textarea"
                      rows={2}
                      placeholder="What happens in this step..."
                      value={st.body}
                      onChange={(e) => {
                        const steps = [...serviceModal.service.steps];
                        steps[idx] = { ...st, body: e.target.value };
                        setServiceModal({ ...serviceModal, service: { ...serviceModal.service, steps } });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="adm-modal-footer">
              <button onClick={() => setServiceModal(null)} className="adm-btn-secondary">
                Cancel
              </button>
              <button onClick={saveService} className="adm-btn-primary" style={{ width: "auto" }} disabled={saving}>
                {saving ? "Saving..." : "Save Service"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: PORTFOLIO ===================== */}
      {portfolioModal?.open && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">
                {portfolioModal.isNew ? "Add Portfolio Project" : "Edit Portfolio Project"}
              </h2>
              <button onClick={() => setPortfolioModal(null)} className="adm-modal-close">
                ✕
              </button>
            </div>

            <div className="adm-modal-body">
              <div className="adm-form-group">
                <label className="adm-label">Project Title</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="e.g. Editorial Lookbook & Film"
                  value={portfolioModal.item.title}
                  onChange={(e) =>
                    setPortfolioModal({
                      ...portfolioModal,
                      item: { ...portfolioModal.item, title: e.target.value },
                    })
                  }
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="adm-form-group">
                  <label className="adm-label">Category</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="Branding, Campaigns, Digital, Production..."
                    value={portfolioModal.item.category || ""}
                    onChange={(e) =>
                      setPortfolioModal({
                        ...portfolioModal,
                        item: { ...portfolioModal.item, category: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Year</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="2026"
                    value={portfolioModal.item.year || ""}
                    onChange={(e) =>
                      setPortfolioModal({
                        ...portfolioModal,
                        item: { ...portfolioModal.item, year: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Target Link (Optional)</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="#work or https://..."
                  value={portfolioModal.item.link || ""}
                  onChange={(e) =>
                    setPortfolioModal({
                      ...portfolioModal,
                      item: { ...portfolioModal.item, link: e.target.value },
                    })
                  }
                />
              </div>

              {/* Project Image */}
              <div className="adm-form-group">
                <label className="adm-label">Project Image</label>
                <div className="adm-media-uploader">
                  {portfolioModal.item.src && (
                    <div className="adm-media-preview">
                      <img src={portfolioModal.item.src} alt={portfolioModal.item.alt || "Preview"} />
                    </div>
                  )}

                  <div className="adm-upload-actions">
                    <label className="adm-file-input-btn">
                      📁 Upload Photo From Computer
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setPortfolioModal({
                                ...portfolioModal,
                                item: { ...portfolioModal.item, src: url },
                              });
                            }
                          }
                        }}
                      />
                    </label>

                    <input
                      type="url"
                      className="adm-input"
                      placeholder="Or paste direct image URL (https://...)"
                      value={portfolioModal.item.src}
                      onChange={(e) =>
                        setPortfolioModal({
                          ...portfolioModal,
                          item: { ...portfolioModal.item, src: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <button onClick={() => setPortfolioModal(null)} className="adm-btn-secondary">
                Cancel
              </button>
              <button onClick={savePortfolioItem} className="adm-btn-primary" style={{ width: "auto" }} disabled={saving}>
                {saving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: DELETE CONFIRMATION ===================== */}
      {deleteConfirm?.open && (
        <div className="adm-modal-overlay">
          <div className="adm-modal" style={{ maxWidth: "420px" }}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title" style={{ color: "var(--adm-danger)" }}>
                Confirm Deletion
              </h2>
              <button onClick={() => setDeleteConfirm(null)} className="adm-modal-close">
                ✕
              </button>
            </div>
            <div className="adm-modal-body">
              <p style={{ margin: "0 0 10px 0", color: "#fff" }}>
                Are you sure you want to delete <strong>&ldquo;{deleteConfirm.title}&rdquo;</strong>?
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--adm-muted)" }}>
                This action is immediate and will update the live website upon confirmation.
              </p>
            </div>
            <div className="adm-modal-footer">
              <button onClick={() => setDeleteConfirm(null)} className="adm-btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === "blog") deleteBlogPost(deleteConfirm.id);
                  if (deleteConfirm.type === "service") deleteService(deleteConfirm.id);
                  if (deleteConfirm.type === "portfolio") deletePortfolioItem(deleteConfirm.id);
                }}
                className="adm-btn-danger"
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
