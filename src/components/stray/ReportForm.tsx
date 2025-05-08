import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckboxWithText } from "../ui/custom/CheckboxWithText";
import { toast } from "sonner";
import { MapPinIcon, Camera, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ReportFormProps = {
  onReportComplete: (reportData: ReportData) => void;
};

export type ReportData = {
  id: string;
  type: "Σκύλος" | "Γάτα" | "Πτηνό" | "Κουνέλι" | "άλλο";
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  imageUrl: string;
  urgency: "Χαμηλή" | "Μεσαία" | "Υψηλή";
  timestamp: string;
  tags: string[];
};

export function ReportForm({ onReportComplete }: ReportFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    animalType: "Σκύλος" | "Γάτα" | "Πτηνό" | "Κουνέλι" | "άλλο";
    description: string;
    urgency: "Χαμηλή" | "Μεσαία" | "Υψηλή";
    tags: string[];
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
  }>({
    animalType: "Σκύλος",
    description: "",
    urgency: "Μεσαία",
    tags: [],
    location: {
      latitude: 0,
      longitude: 0,
      address: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      toast("Getting your location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Usually we would do reverse geocoding here, but for demo we'll use a mock address
          setFormData({
            ...formData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: "123 Main Street, Anytown, USA", // Mock address
            },
          });
          toast.success("Location captured!");
        },
        (error) => {
          toast.error(`Error getting location: ${error.message}`);
        }
      );
    } else {
      toast.error("Ο γεωεντοπισμός δεν υποστηρίζετε στον πλοηγό αυτό.");
    }
  };

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((t) => t !== tag),
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview) {
      toast.error("Πρόσθεσε φωτογραφία του αδέσποτου");
      return;
    }
    
    if (!formData.location.latitude || !formData.location.longitude) {
      toast.error("Εντόπισε την γεωγραφική σου θέση");
      return;
    }

    if (!user) {
      toast.error("Πρέπει να συνδεθείς για να αναφέρεις αδέσποτα");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      console.log("Submitting report with user_id:", user.id);
      
      // Create a report object for the database
      const reportData = {
        user_id: user.id,
        type: formData.animalType,
        description: formData.description,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        address: formData.location.address,
        image_url: imagePreview,
        urgency: formData.urgency,
        tags: formData.tags,
      };
      
      console.log("Report data being submitted:", reportData);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('stray_reports')
        .insert(reportData)
        .select('id, created_at')
        .single();
        
      if (error) {
        console.error("Error from Supabase:", error);
        throw error;
      }
      
      console.log("Report submitted successfully:", data);
      
      // Format the data for the onReportComplete callback
      const formattedReportData: ReportData = {
        id: data.id,
        type: formData.animalType,
        description: formData.description,
        location: formData.location,
        imageUrl: imagePreview,
        urgency: formData.urgency,
        timestamp: data.created_at,
        tags: formData.tags,
      };
      
      toast.success("Η αναφορά καταχωρήθηκε! Κέρδισες πόντους για την συνεισφορά σου.");
      onReportComplete(formattedReportData);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Υπήρξε πρόβλημα με την αναφορά σου. Παρακαλώ προσπάθησε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {step === 1 && (
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Ανάφερε ένα αδέσποτο</h2>
            <div className="text-sm text-muted-foreground">
              Step 1 of 2
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/40 relative">
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                
                {imagePreview ? (
                  <div className="relative w-full aspect-square max-w-xs">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Αλλαγή φωτογραφίας
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Προσθήκη φωτογραφίας</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Πάτησε εδώ για να ανεβάσεις φωτογραφία
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Label htmlFor="animal-type">Τύπος αδέσποτου</Label>
            <RadioGroup
              id="animal-type"
              value={formData.animalType}
              onValueChange={(value) => setFormData({ ...formData, animalType: value as "Σκύλος" | "Γάτα" | "Πτηνό" | "Κουνέλι" | "άλλο" })}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Σκύλος" id="dog" />
                <Label htmlFor="dog" className="cursor-pointer">Σκύλος</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Γάτα" id="cat" />
                <Label htmlFor="cat" className="cursor-pointer">Γάτα</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Πτηνό" id="Πτηνό" />
                <Label htmlFor="Πτηνό" className="cursor-pointer">Πτηνό</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Κουνέλι" id="Κουνέλι" />
                <Label htmlFor="Κουνέλι" className="cursor-pointer">Κουνέλι</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="άλλο" id="άλλο" />
                <Label htmlFor="άλλο" className="cursor-pointer">Άλλο</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Λεπτομέρειες</Label>
            <Textarea
              id="description"
              placeholder="Περιέγραψε το αδέσποτο (χρώμα, μέγεθος, αγριότητα, κτλπ.)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>Ετικέτες κατάστασης</Label>
            <div className="flex flex-wrap gap-2">
              {["Χτυπημένο", "Πεινασμένο", "Έγκυο", "Με κουτάβια/γατάκια", "Επιθετικό", "Φιλικό"].map((tag) => (
                <CheckboxWithText
                  key={tag}
                  checked={formData.tags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                  label={tag}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Τοποθεσία και λεπτομέρειες</h2>
            <div className="text-sm text-muted-foreground">
              Βήμα 2 απο τα 2
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location">Τωρινή τοποθεσία</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleLocationCapture}
                    className="flex items-center"
                  >
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    Πρόσθεσε την τοποθεσία σου 
                  </Button>
                </div>

                {formData.location.latitude !== 0 && formData.location.longitude !== 0 ? (
                  <div className="rounded-md border p-4 bg-muted/30">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Η τοποθεσία σου εντοπίστηκε</p>
                        <p className="text-sm text-muted-foreground">{formData.location.address}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground text-center">
                      Πρόσθεσε την τωρινή σου τοποθεσία
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Label>Επίπεδο κρισημότητας</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value as "Χαμηλή" | "Μεσαία" | "Υψηλή" })}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex flex-col">
                <Button
                  type="button"
                  variant={formData.urgency === "Χαμηλή" ? "default" : "outline"}
                  className={`w-full h-20 ${formData.urgency === "Χαμηλή" ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
                  onClick={() => setFormData({ ...formData, urgency: "Χαμηλή" })}
                >
                  Χαμηλή
                </Button>
                <span className="text-xs text-center mt-1 text-muted-foreground">
                  Μαλλον υγειές
                </span>
              </div>
              <div className="flex flex-col">
                <Button
                  type="button"
                  variant={formData.urgency === "Μεσαία" ? "default" : "outline"}
                  className={`w-full h-20 ${formData.urgency === "Μεσαία" ? "bg-amber-500 text-white hover:bg-amber-600" : ""}`}
                  onClick={() => setFormData({ ...formData, urgency: "Μεσαία" })}
                >
                  Μεσαία
                </Button>
                <span className="text-xs text-center mt-1 text-muted-foreground">
                  Χρειάζεται βοήθεια σύντομα
                </span>
              </div>
              <div className="flex flex-col">
                <Button
                  type="button"
                  variant={formData.urgency === "Υψηλή" ? "default" : "outline"}
                  className={`w-full h-20 ${formData.urgency === "Υψηλή" ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
                  onClick={() => setFormData({ ...formData, urgency: "Υψηλή" })}
                >
                  Υψηλή
                </Button>
                <span className="text-xs text-center mt-1 text-muted-foreground">
                  Άμεση ανάγκη
                </span>
              </div>
            </RadioGroup>
          </div>

          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Πίσω
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Αποστολή..." : "Στείλε την αναφορά σου"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
