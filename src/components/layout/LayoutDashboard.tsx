import { Plane } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User } from "@/App";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { SplitText } from "gsap/SplitText";

type LayoutDashboardProps = {
  user: User;
  onLogout: () => void;
  sidebarItems: Array<{ id: string; icon: React.ElementType; label: string; path: string }>;
  children: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

gsap.registerPlugin(SplitText)

export default function LayoutDashboard({ user, onLogout, sidebarItems, children, currentPath, onNavigate }: LayoutDashboardProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const brandTitleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ ease: "power1.out", duration: .4 })
    if (navRef.current) {
      tl.from(navRef.current, {
        scaleY: 0,
      })
      .from(navRef.current.children, {
        alpha: 0,
        scale: 1.2,
      }, "-=0.1")
    }
  })

  useGSAP(() => {
    if (brandTitleRef.current) {
      const split = new SplitText(brandTitleRef.current, { type: "chars" });
      gsap.from(split.chars, {
        duration: 0.5,
        y: 20,
        alpha: 0,
        stagger: 0.05,
        ease: "back.out(1.7)",
      });
    }
  })

  const isActive = (itemPath: string) => {
    if (currentPath) {
      return currentPath.startsWith(itemPath);
    }
    return false;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside ref={navRef} className="bg-gray-50 flex flex-col items-center py-6 m-5 rounded-full">
        <div className="mb-8">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center gap-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.path)}
                className={`p-3 rounded-lg transition-colors group relative cursor-pointer ${
                  active ? 'bg-sky-500 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            onClick={onLogout}
            className="relative group p-3 rounded-lg cursor-pointer"
            title="Cerrar Sesión"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-sky-100 text-sky-600">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 ref={brandTitleRef} className="text-sky-500 text-2xl font-bold">{`Flyblue ${user.role === 'admin' ? 'Admin' : ''}`}</h1>
            <div className="text-sm text-gray-600">
              Bienvenido, {user.name}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}