import { Plane, X, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User } from "@/App";
import { useLayoutAnimations } from "@/hooks/animations/useLayoutAnimations";
import { useEffect, useRef, useState } from "react";

type LayoutDashboardProps = {
  user: User;
  onLogout: () => void;
  sidebarItems: Array<{ id: string; icon: React.ElementType; label: string; path: string }> ;
  children: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export default function LayoutDashboard({ user, onLogout, sidebarItems, children, currentPath, onNavigate }: LayoutDashboardProps) {
  const { navRef, brandTitleRef } = useLayoutAnimations();

  const isActive = (itemPath: string) => {
    if (currentPath) {
      return currentPath.startsWith(itemPath);
    }
    return false;
  };

  // Modal state & handlers
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarButtonRef = useRef<HTMLButtonElement | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const toggleMenu = () => {
    if (!menuOpen) {
      const rect = avatarButtonRef.current?.getBoundingClientRect() ?? null;
      setAnchorRect(rect);
      setMenuOpen(true);
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <aside ref={navRef} className="bg-gray-50 flex md:flex-col items-center px-5 md:px-0 md:py-6 m-5 rounded-full">
        <div className="md:mb-8 mb-0">
          <div className="hidden md:flex w-10 h-10 items-center justify-center">
            <Plane className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        <nav className="flex-1 flex md:flex-col items-center justify-start md:justify-center gap-6">
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

        {/* Avatar opens a small anchored modal */}
        <div className="mt-auto relative">
          <button
            ref={avatarButtonRef}
            onClick={toggleMenu}
            className="relative group p-3 rounded-lg cursor-pointer"
            title="Abrir menú de usuario"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-sky-100 text-sky-600">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </aside>

      {/* Small anchored modal near the avatar (to the right), lighter backdrop, styled like the dashboard */}
      {menuOpen && (
        <>
          {/* very subtle backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/5"
            onClick={() => setMenuOpen(false)}
          />

          {/* anchored modal: to the right of avatar, vertically centered on it; if no space, flip to left */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menú de usuario"
            className="fixed z-50 bg-white border border-gray-100 rounded-2xl shadow-lg p-6 w-80 text-sm"
            style={
              anchorRect
                ? (() => {
                    const modalWidth = 320; // w-80
                    const modalHeight = 152; // mayor alto estimado
                    const gap = 10;
                    // ideal: place to the right
                    let left = Math.round(anchorRect.right + gap);
                    // if would overflow right, try left side of avatar
                    if (left + modalWidth > window.innerWidth - 8) {
                      const leftCandidate = Math.round(anchorRect.left - modalWidth - gap);
                      if (leftCandidate >= 8) {
                        left = leftCandidate;
                      } else {
                        // clamp to fit
                        left = Math.max(8, window.innerWidth - modalWidth - 8);
                      }
                    }
                    // vertically center on avatar and nudge upward un poco más
                    const centerY = anchorRect.top + anchorRect.height / 2;
                    const top = Math.max(
                      8,
                      Math.min(
                        window.innerHeight - modalHeight - 8,
                        Math.round(centerY - modalHeight / 2) - 10 // subir 10px para separarlo del avatar
                      )
                    );
                    return {
                      left: `${left}px`,
                      top: `${top}px`,
                    } as React.CSSProperties;
                  })()
                : { left: '50%', top: '20%', transform: 'translateX(-50%)' }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 font-semibold text-slate-900 text-base">Mi Cuenta</div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  // Navegar a profile según el rol del usuario
                  const profilePath = user.role === 'admin' ? '/admin/profile' : '/client/profile';
                  onNavigate?.(profilePath);
                }}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-150 text-sky-600 font-medium transition-all duration-200 border border-sky-200"
                title="Ver perfil"
              >
                <UserIcon className="w-5 h-5" />
                <span>Perfil</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-150 text-red-600 font-medium transition-all duration-200 border border-red-200"
                title="Cerrar Sesión"
              >
                <X className="w-5 h-5" />
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 ref={brandTitleRef} className="text-sky-500 text-2xl font-bold cursor-pointer select-none">{`Flyblue ${user.role === 'admin' ? 'Admin' : ''}`}</h1>
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
