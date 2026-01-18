import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Newspaper, 
  MessageSquare, 
  LogOut,
  Save,
  Trash2,
  Upload,
  Eye,
  Calendar,
  User,
  Phone,
  MapPin,
  CheckCircle,
  Clock
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin");
  };

  // Fetch site content
  const { data: siteContent } = useQuery({
    queryKey: ["admin-site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch news
  const { data: news } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch gallery
  const { data: gallery } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch complaints
  const { data: complaints, refetch: refetchComplaints } = useQuery({
    queryKey: ["admin-complaints"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bengali font-bold text-lg">অ্যাডমিন ড্যাশবোর্ড</h1>
              <p className="text-sm text-muted-foreground">কন্টেন্ট ম্যানেজমেন্ট</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            <span className="font-bengali">লগআউট</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="content" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline font-bengali">কন্টেন্ট</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline font-bengali">সংবাদ</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline font-bengali">গ্যালারি</span>
            </TabsTrigger>
            <TabsTrigger value="complaints" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline font-bengali">অভিযোগ</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Editor */}
          <TabsContent value="content">
            <ContentEditor siteContent={siteContent} />
          </TabsContent>

          {/* News Manager */}
          <TabsContent value="news">
            <NewsManager news={news} />
          </TabsContent>

          {/* Gallery Manager */}
          <TabsContent value="gallery">
            <GalleryManager gallery={gallery} />
          </TabsContent>

          {/* Complaints Viewer */}
          <TabsContent value="complaints">
            <ComplaintsViewer complaints={complaints} onUpdate={refetchComplaints} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Content Editor Component
const ContentEditor = ({ siteContent }: { siteContent: any[] | undefined }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState<Record<string, { title: string; content: string }>>({});

  useEffect(() => {
    if (siteContent) {
      const contentMap: Record<string, { title: string; content: string }> = {};
      siteContent.forEach((item) => {
        contentMap[item.id] = { title: item.title, content: item.content };
      });
      setEditingContent(contentMap);
    }
  }, [siteContent]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { error } = await supabase
        .from("site_content")
        .update({ title, content })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-content"] });
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast({ title: "সফল", description: "কন্টেন্ট আপডেট করা হয়েছে" });
    },
    onError: () => {
      toast({ title: "ত্রুটি", description: "আপডেট করতে সমস্যা হয়েছে", variant: "destructive" });
    },
  });

  const sections = [
    { id: "hero", label: "হিরো সেকশন" },
    { id: "biography", label: "জীবনী" },
    { id: "vision", label: "ভিশন" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bengali text-2xl font-bold">কন্টেন্ট এডিটর</h2>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-background rounded-xl border border-border p-6">
            <h3 className="font-bengali font-semibold text-lg mb-4">{section.label}</h3>
            <div className="space-y-4">
              <div>
                <label className="font-bengali text-sm font-medium mb-2 block">শিরোনাম</label>
                <Input
                  value={editingContent[section.id]?.title || ""}
                  onChange={(e) =>
                    setEditingContent((prev) => ({
                      ...prev,
                      [section.id]: { ...prev[section.id], title: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className="font-bengali text-sm font-medium mb-2 block">বিষয়বস্তু</label>
                <Textarea
                  value={editingContent[section.id]?.content || ""}
                  onChange={(e) =>
                    setEditingContent((prev) => ({
                      ...prev,
                      [section.id]: { ...prev[section.id], content: e.target.value },
                    }))
                  }
                  rows={4}
                />
              </div>
              <Button
                onClick={() =>
                  updateMutation.mutate({
                    id: section.id,
                    title: editingContent[section.id]?.title || "",
                    content: editingContent[section.id]?.content || "",
                  })
                }
                disabled={updateMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                <span className="font-bengali">সংরক্ষণ করুন</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// News Manager Component
const NewsManager = ({ news }: { news: any[] | undefined }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newNews, setNewNews] = useState({ title: "", description: "", image: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  const addNewsMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; image_url: string | null }) => {
      const { error } = await supabase.from("news").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setNewNews({ title: "", description: "", image: null });
      toast({ title: "সফল", description: "সংবাদ যোগ করা হয়েছে" });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "সফল", description: "সংবাদ মুছে ফেলা হয়েছে" });
    },
  });

  const handleAddNews = async () => {
    setIsUploading(true);
    let imageUrl = null;

    if (newNews.image) {
      const fileExt = newNews.image.name.split(".").pop();
      const fileName = `news/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, newNews.image);

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
    }

    await addNewsMutation.mutateAsync({
      title: newNews.title,
      description: newNews.description,
      image_url: imageUrl,
    });
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bengali text-2xl font-bold">সংবাদ ম্যানেজার</h2>
      </div>

      {/* Add News Form */}
      <div className="bg-background rounded-xl border border-border p-6">
        <h3 className="font-bengali font-semibold text-lg mb-4">নতুন সংবাদ যোগ করুন</h3>
        <div className="grid gap-4">
          <Input
            placeholder="শিরোনাম"
            value={newNews.title}
            onChange={(e) => setNewNews((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Textarea
            placeholder="বিবরণ"
            value={newNews.description}
            onChange={(e) => setNewNews((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewNews((prev) => ({ ...prev, image: e.target.files?.[0] || null }))
              }
              className="text-sm"
            />
          </div>
          <Button onClick={handleAddNews} disabled={isUploading || !newNews.title}>
            <Upload className="w-4 h-4 mr-2" />
            <span className="font-bengali">{isUploading ? "আপলোড হচ্ছে..." : "যোগ করুন"}</span>
          </Button>
        </div>
      </div>

      {/* News List */}
      <div className="grid gap-4">
        {news?.map((item) => (
          <div key={item.id} className="bg-background rounded-xl border border-border p-4 flex gap-4">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
            )}
            <div className="flex-1">
              <h4 className="font-bengali font-semibold">{item.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(item.date), "d MMMM, yyyy", { locale: bn })}
              </p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteNewsMutation.mutate(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Gallery Manager Component
const GalleryManager = ({ gallery }: { gallery: any[] | undefined }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newImage, setNewImage] = useState<{ file: File | null; caption: string }>({
    file: null,
    caption: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const addImageMutation = useMutation({
    mutationFn: async (data: { image_url: string; caption: string }) => {
      const { error } = await supabase.from("gallery").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setNewImage({ file: null, caption: "" });
      toast({ title: "সফল", description: "ছবি যোগ করা হয়েছে" });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "সফল", description: "ছবি মুছে ফেলা হয়েছে" });
    },
  });

  const handleAddImage = async () => {
    if (!newImage.file) return;
    setIsUploading(true);

    const fileExt = newImage.file.name.split(".").pop();
    const fileName = `gallery/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, newImage.file);

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
      await addImageMutation.mutateAsync({
        image_url: urlData.publicUrl,
        caption: newImage.caption,
      });
    }
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bengali text-2xl font-bold">গ্যালারি ম্যানেজার</h2>
      </div>

      {/* Add Image Form */}
      <div className="bg-background rounded-xl border border-border p-6">
        <h3 className="font-bengali font-semibold text-lg mb-4">নতুন ছবি যোগ করুন</h3>
        <div className="grid gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewImage((prev) => ({ ...prev, file: e.target.files?.[0] || null }))
            }
          />
          <Input
            placeholder="ক্যাপশন (ঐচ্ছিক)"
            value={newImage.caption}
            onChange={(e) => setNewImage((prev) => ({ ...prev, caption: e.target.value }))}
          />
          <Button onClick={handleAddImage} disabled={isUploading || !newImage.file}>
            <Upload className="w-4 h-4 mr-2" />
            <span className="font-bengali">{isUploading ? "আপলোড হচ্ছে..." : "যোগ করুন"}</span>
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery?.map((item) => (
          <div key={item.id} className="relative group">
            <img
              src={item.image_url}
              alt={item.caption || "Gallery image"}
              className="aspect-square object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteImageMutation.mutate(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {item.caption && (
              <p className="mt-1 text-xs text-muted-foreground truncate">{item.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Complaints Viewer Component with Status Toggle
const ComplaintsViewer = ({ complaints, onUpdate }: { complaints: any[] | undefined; onUpdate: () => void }) => {
  const { toast } = useToast();
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("complaints")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      onUpdate();
      toast({ title: "সফল", description: "স্ট্যাটাস আপডেট করা হয়েছে" });
    },
    onError: () => {
      toast({ title: "ত্রুটি", description: "আপডেট করতে সমস্যা হয়েছে", variant: "destructive" });
    },
  });

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "resolved" : "pending";
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const pendingCount = complaints?.filter(c => c.status === "pending").length || 0;
  const resolvedCount = complaints?.filter(c => c.status === "resolved").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-bengali text-2xl font-bold">অভিযোগ / পরামর্শ</h2>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-bengali flex items-center gap-2">
            <Clock className="w-4 h-4" />
            পেন্ডিং: {pendingCount}
          </span>
          <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-bengali flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            সমাধান: {resolvedCount}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {complaints?.map((complaint) => (
          <div key={complaint.id} className="bg-background rounded-xl border border-border p-6">
            {/* Status Toggle */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                {complaint.status === "pending" ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="font-bengali text-sm">পেন্ডিং</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bengali text-sm">সমাধান হয়েছে</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bengali text-sm text-muted-foreground">সমাধান</span>
                <Switch
                  checked={complaint.status === "resolved"}
                  onCheckedChange={() => handleStatusToggle(complaint.id, complaint.status)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-bengali font-medium">{complaint.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{complaint.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-bengali">{complaint.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-bengali">
                  {format(new Date(complaint.created_at), "d MMMM, yyyy", { locale: bn })}
                </span>
              </div>
            </div>

            <div className="mb-2">
              <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-bengali">
                {complaint.category}
              </span>
            </div>

            <p className="font-bengali text-foreground">{complaint.description}</p>

            {complaint.attachment_url && (
              <div className="mt-4">
                <a
                  href={complaint.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  <span className="font-bengali text-sm">সংযুক্তি দেখুন</span>
                </a>
              </div>
            )}
          </div>
        ))}

        {(!complaints || complaints.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-bengali">কোনো অভিযোগ পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
