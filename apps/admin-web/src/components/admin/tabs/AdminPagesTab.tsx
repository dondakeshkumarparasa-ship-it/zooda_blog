import { useState, useEffect, useRef } from 'react';
import { FileText, Save, Loader2, Mail, Phone, MapPin, Globe, Info, Shield } from 'lucide-react';

const API_BASE = (localStorage.getItem("use_local_backend") === "true")
  ? "http://localhost:5000/api"
  : "https://api.zooda.in/api";

const PAGES = [
  { slug: 'about', name: 'About Us', icon: 'fa-info-circle' },
  { slug: 'contact', name: 'Contact Us', icon: 'fa-envelope' },
  { slug: 'privacy', name: 'Privacy Policy', icon: 'fa-shield-alt' },
  { slug: 'terms', name: 'Terms & Conditions', icon: 'fa-file-signature' }
];

export function AdminPagesTab() {
  const [activeSlug, setActiveSlug] = useState('about');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<any>(null);

  // Fetch page data whenever activeSlug changes
  useEffect(() => {
    fetchPage();
  }, [activeSlug]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/pages/${activeSlug}`);
      const result = await res.json();
      if (result.success && result.data) {
        setTitle(result.data.title || '');
        setContent(result.data.content || '');
        
        // Metadata fields for contact page
        const meta = result.data.metadata || {};
        setEmail(meta.email || '');
        setPhone(meta.phone || '');
        setAddress(meta.address || '');

        // Load data into CKEditor if initialized
        if (editorRef.current) {
          editorRef.current.setData(result.data.content || '');
        }
      }
    } catch (err) {
      console.error('Error fetching page:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize/rebuild CKEditor 4 on activeSlug or loading changes
  useEffect(() => {
    let active = true;

    const checkAndInitEditor = () => {
      if (!active) return;
      const CKEDITOR = (window as any).CKEDITOR;
      const editorElement = document.getElementById('page-editor');

      if (CKEDITOR && editorElement) {
        // Destroy existing instance to avoid duplicate ID issues
        if (editorRef.current) {
          try {
            editorRef.current.destroy(true);
          } catch (e) {
            console.warn('Error destroying editor:', e);
          }
          editorRef.current = null;
        }

        // Replace the textarea
        const editor = CKEDITOR.replace('page-editor', {
          height: 380,
          uiColor: '#1e293b', // slate-800 look
          skin: 'moono-lisa',
          removeButtons: '',
          allowedContent: true, // Allow custom HTML/CSS inline styles
          versionCheck: false, // Disable EOL security warnings
          // Fully featured toolbar config
          toolbar: [
            { name: 'document', items: ['Source', '-', 'Preview', 'Templates'] },
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
            { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
            { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
            '/',
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
            { name: 'colors', items: ['TextColor', 'BGColor'] },
            { name: 'tools', items: ['Maximize'] }
          ]
        });

        // Set initial data once CKEditor is fully ready
        editor.on('instanceReady', () => {
          editor.setData(content);
        });

        // Bind editor updates back to React state
        editor.on('change', () => {
          setContent(editor.getData());
        });

        editorRef.current = editor;
      } else {
        setTimeout(checkAndInitEditor, 50);
      }
    };

    checkAndInitEditor();

    // Clean up
    return () => {
      active = false;
      if (editorRef.current) {
        try {
          editorRef.current.destroy(true);
        } catch (e) {
          console.warn('Cleanup error destroying editor:', e);
        }
        editorRef.current = null;
      }
    };
  }, [activeSlug, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const finalContent = editorRef.current ? editorRef.current.getData() : content;
    const body: any = {
      title,
      content: finalContent
    };

    if (activeSlug === 'contact') {
      body.metadata = {
        email,
        phone,
        address
      };
    }

    try {
      const res = await fetch(`${API_BASE}/pages/${activeSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (result.success) {
        alert(`${PAGES.find(p => p.slug === activeSlug)?.name} saved successfully!`);
        await fetchPage();
      } else {
        alert('Failed to save page: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error saving page:', err);
      alert('Network error while saving page.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Page Content Editor</h2>
          <p className="text-muted-foreground text-sm">Manage Terms & Conditions, Privacy Policies, About Us, and Contact details dynamically</p>
        </div>
      </div>

      {/* Selector and Editor layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Page Selector */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Select Page</h3>
          <div className="flex flex-col gap-1.5">
            {PAGES.map((p) => {
              const isActive = activeSlug === p.slug;
              return (
                <button
                  key={p.slug}
                  onClick={() => setActiveSlug(p.slug)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/10'
                      : 'bg-card border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {p.slug === 'about' && <Info className={`h-5 w-5 ${isActive ? 'text-[#ffffff]' : 'text-[#15A148]'}`} />}
                    {p.slug === 'contact' && <Mail className={`h-5 w-5 ${isActive ? 'text-[#ffffff]' : 'text-[#15A148]'}`} />}
                    {p.slug === 'privacy' && <Shield className={`h-5 w-5 ${isActive ? 'text-[#ffffff]' : 'text-[#15A148]'}`} />}
                    {p.slug === 'terms' && <FileText className={`h-5 w-5 ${isActive ? 'text-[#ffffff]' : 'text-[#15A148]'}`} />}
                  </span>
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Form Editor */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl">
              <Loader2 className="h-8 w-8 text-[#15A148] animate-spin mb-3" />
              <p className="text-muted-foreground text-sm">Loading page content...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              {/* Page Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Page Title..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                />
              </div>

              {/* Dynamic Metadata Fields for Contact Page */}
              {activeSlug === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#15A148]" /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="support@zooda.in"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#15A148]" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99999 99999"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#15A148]" /> Address / Location
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Vijayawada, India"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/10 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* CKEditor Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Content Editor</label>
                <div className="border border-border rounded-xl overflow-hidden bg-background">
                  <textarea id="page-editor" className="hidden" />
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm hover:from-green-600 hover:to-emerald-700 transition-all shadow-md shadow-green-500/10 hover:shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Page
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
