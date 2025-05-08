
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { UserRankBadge } from "@/components/user/UserRankBadge";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="flex min-h-screen flex-col">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-34 items-center">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            
          <div> 
  <img id="image"src="https://previews.123rf.com/images/mumut/mumut1612/mumut161200009/69253080-cartoon-dog-cat-for-frame-border-element.jpg" 
    width="100" />
</div> 
            
            <span className="font-bold">Αδέσποτα σε ανάγκη</span>
          </Link>

          <nav className="ml-auto flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {}}
                  asChild
                >
                  <Link to="/dashboard">Αρχική</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {}}
                  asChild
                >
                  <Link to="/report">Νέα αναφορά</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      {user.email?.split('@')[0] || "My Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div>{user.email}</div>
                      <div className="mt-1">
                        <UserRankBadge />
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Αρχική</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/report">Νέα αναφορά</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Αποσύνδεση
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                variant="default"
                className="bg-amber-500 hover:bg-amber-600"
                asChild
              >
                <Link to="/auth">Σύνδεση / Εγγραφή</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Architech©2025. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            Υπερσύνδεσμος
          </div>
        </div>
      </footer>
    </div>
  );
}
