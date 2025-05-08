
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import NewsSection from "@/components/news/NewsSection";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <MainLayout>
      <section className="relative">
        {/* Hero background with gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1415369629372-26f2fe60c467')",
          }}
        >
          </div>

        {/* Hero content */}
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Βοήθησε τα αδέσποτα της πόλης σου
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Μπορείς να αναφέρεις αδέσποτα που βρίσκονται σε κίνδυνο. Μαζί, μπορούμε να κάνουμε την διαφορά.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate(user ? "/report" : "/auth")}
                  size="lg"
                  className="bg-amber-500 text-white hover:bg-amber-600"
                >
                  {user ? "Ανάφερε ένα αδέσποτο" : "Κάνε εγγραφή"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                 Μάθε περισσότερα
                </Button>
              </div>
            </div>
            <div className="p-6 bg-white/95 backdrop-blur rounded-lg shadow-xl">
              {user ? (
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Καλώς ήρθες!</h2>
                  <p>Είσαι ήδη συνδεδεμένος/η ως {user.email}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      Δες το ταμπλό σου
                    </Button>
                    <Button
                      onClick={() => navigate("/report")}
                      variant="outline"
                    >
                      Ανάφερε ένα αδέσποτο
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Ξεκίνα τώρα</h2>
                  <p>Κάνε σύνδεση ή εγγραφή για να αναφέρεις ένα αδέσποτο</p>
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={() => navigate("/auth")}
                      className="w-full bg-amber-500 hover:bg-amber-600"
                    >
                      Σύνδεση / Εγγραφή
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News Section - Added */}
      <NewsSection />

      {/* Features section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Πως λειτουργεί το πρόγραμμα
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Ανάφερε ένα αδέσποτο</h3>
            <p className="text-muted-foreground">
              Ανέφερε απευθείας αδέσποτα που χρειάζονται βοήθεια. Πρόσθεσε φωτογραφία και συντεταγμένες τοποθεσίας.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Ενημέρωσε τους διασώστες</h3>
            <p className="text-muted-foreground">
              Οι τοπικές φιλοζωικές και ο δήμος ενημερώνονται αυτόματα.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Σώσε ζωές</h3>
            <p className="text-muted-foreground">
              Οι αναφορές σου βοηθάν να σωθουν ζωές, δίνοντας τους μια δεύτερη ευκαιρία.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
