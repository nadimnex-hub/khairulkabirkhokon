import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const complaintSchema = z.object({
  name: z.string().min(2, "নাম অবশ্যই দিতে হবে").max(100),
  phone: z.string().min(11, "সঠিক মোবাইল নম্বর দিন").max(15),
  address: z.string().min(5, "ঠিকানা অবশ্যই দিতে হবে").max(500),
  category: z.string().min(1, "বিভাগ নির্বাচন করুন"),
  description: z.string().min(10, "বিস্তারিত বিবরণ দিন").max(2000),
});

type ComplaintForm = z.infer<typeof complaintSchema>;

interface ComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComplaintDialog = ({ open, onOpenChange }: ComplaintDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<ComplaintForm>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      category: "",
      description: "",
    },
  });

  const categories = [
    "রাস্তা ও যোগাযোগ",
    "বিদ্যুৎ",
    "পানি সরবরাহ",
    "শিক্ষা",
    "স্বাস্থ্য",
    "কৃষি",
    "অন্যান্য",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "ফাইল অনেক বড়",
          description: "সর্বোচ্চ ৫ MB ফাইল আপলোড করা যাবে",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmit = async (data: ComplaintForm) => {
    setIsSubmitting(true);
    try {
      let attachmentUrl = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `complaints/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(fileName);
        attachmentUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("complaints").insert({
        name: data.name,
        phone: data.phone,
        address: data.address,
        category: data.category,
        description: data.description,
        attachment_url: attachmentUrl,
      });

      if (error) throw error;

      toast({
        title: "সফলভাবে জমা হয়েছে",
        description: "আপনার অভিযোগ/পরামর্শ গ্রহণ করা হয়েছে। শীঘ্রই যোগাযোগ করা হবে।",
      });

      form.reset();
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "ত্রুটি",
        description: "জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bengali text-2xl text-center">
            অভিযোগ / পরামর্শ ফর্ম
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bengali">নাম</FormLabel>
                  <FormControl>
                    <Input placeholder="আপনার পূর্ণ নাম" {...field} />
                  </FormControl>
                  <FormMessage className="font-bengali" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bengali">মোবাইল নম্বর</FormLabel>
                  <FormControl>
                    <Input placeholder="01XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage className="font-bengali" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bengali">ঠিকানা</FormLabel>
                  <FormControl>
                    <Input placeholder="গ্রাম, উপজেলা, জেলা" {...field} />
                  </FormControl>
                  <FormMessage className="font-bengali" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bengali">বিভাগ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="font-bengali">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-bengali" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bengali">বিস্তারিত বিবরণ</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="আপনার সমস্যা বা পরামর্শ বিস্তারিত লিখুন..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bengali" />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <div className="space-y-2">
              <label className="font-bengali text-sm font-medium">
                সংযুক্তি (ছবি/পিডিএফ)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="font-bengali text-sm text-muted-foreground">
                    {file ? file.name : "ফাইল নির্বাচন করুন (সর্বোচ্চ ৫ MB)"}
                  </span>
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="font-bengali">জমা হচ্ছে...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  <span className="font-bengali">জমা দিন</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDialog;
