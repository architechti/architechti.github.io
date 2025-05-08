
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Share, Facebook, Twitter, Instagram } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Sample news data - in a real app, this would come from an API or database
const newsItems = [
  {
    id: 1,
    title: "Νέο πρόγραμμα στείρωσης αδέσποτων",
    date: "2025-05-01",
    content: "Ξεκινά νέο πρόγραμμα στείρωσης αδέσποτων ζώων στην πόλη μας. Το πρόγραμμα στοχεύει στον έλεγχο του πληθυσμού των αδέσποτων με ανθρωπιστικό τρόπο.",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Εκδήλωση υιοθεσίας το Σαββατοκύριακο",
    date: "2025-05-03",
    content: "Μεγάλη εκδήλωση υιοθεσίας αδέσποτων ζώων στην κεντρική πλατεία το Σάββατο και την Κυριακή. Ελάτε να γνωρίσετε τους τετράποδους φίλους που αναζητούν οικογένεια.",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Εθελοντές για περίθαλψη τραυματισμένων ζώων",
    date: "2025-05-06",
    content: "Αναζητούνται εθελοντές για τη φροντίδα τραυματισμένων αδέσποτων ζώων. Η εκπαίδευση θα πραγματοποιηθεί από έμπειρους κτηνιάτρους.",
    image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-4.0.3",
  },
];

interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
  image: string;
}

const NewsSection = () => {
  // State to track likes for each news item
  const [likes, setLikes] = useState<Record<number, number>>({
    1: 12,
    2: 8,
    3: 5,
  });
  
  // State to track if current user has liked each item
  const [userLiked, setUserLiked] = useState<Record<number, boolean>>({});

  const handleLike = (id: number) => {
    setUserLiked((prev) => {
      const hasLiked = !prev[id];
      
      // Update likes count
      setLikes((prevLikes) => ({
        ...prevLikes,
        [id]: prevLikes[id] + (hasLiked ? 1 : -1),
      }));
      
      // Show toast
      if (hasLiked) {
        toast.success("Σας αρέσει αυτό το άρθρο!");
      }
      
      return { ...prev, [id]: hasLiked };
    });
  };

  const handleShare = (platform: string, item: NewsItem) => {
    // URL to share - in a production app, this would be a proper URL
    const shareUrl = `https://www.adespotagr.org/news/${item.id}`;
    
    let shareLink = "";
    
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item.title)}`;
        break;
      case "instagram":
        // Instagram doesn't have a direct share URL, so we'll just show a toast
        toast.info("Ανοίξτε το Instagram και μοιραστείτε το link");
        return;
    }
    
    // Open share window
    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400");
      toast.success(`Μοιραστήκατε στο ${platform}!`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Νέα και Ενημερώσεις
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{formatDate(item.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{item.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(item.id)}
                  className={userLiked[item.id] ? "text-amber-500" : ""}
                >
                  <ThumbsUp className="mr-1" size={18} />
                  <span>{likes[item.id] || 0}</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share className="mr-1" size={18} />
                      Μοιραστείτε
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare("facebook", item)}>
                      <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                      <span>Facebook</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("twitter", item)}>
                      <Twitter className="mr-2 h-4 w-4 text-sky-500" />
                      <span>Twitter</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("instagram", item)}>
                      <Instagram className="mr-2 h-4 w-4 text-pink-600" />
                      <span>Instagram</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
