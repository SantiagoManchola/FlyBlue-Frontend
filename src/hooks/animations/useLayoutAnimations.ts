import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export const useLayoutAnimations = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const brandTitleRef = useRef<HTMLHeadingElement>(null);
  const isAnimating = useRef(false);

  // Animación del sidebar (solo al montar)
  useGSAP(() => {
    const tl = gsap.timeline({ ease: "power1.out", duration: 0.4 });
    if (navRef.current) {
      tl.from(navRef.current, {
        scaleY: 0,
      }).from(
        navRef.current.children,
        {
          alpha: 0,
          scale: 1.2,
        },
        "-=0.1"
      );
    }
  });

  // Animación del título con hover
  useGSAP(() => {
    if (brandTitleRef.current) {
      const split = new SplitText(brandTitleRef.current, { type: "chars" });

      const handleMouseEnter = () => {
        // Si ya hay una animación en progreso, no hacer nada
        if (isAnimating.current) return;

        // Marcar que la animación está en progreso
        isAnimating.current = true;

        gsap.to(split.chars, {
          x: 7,
          duration: 0.3,
          stagger: 0.03,
          ease: "power1.out",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            isAnimating.current = false;
          },
        });
      };

      brandTitleRef.current.addEventListener("mouseenter", handleMouseEnter);

      // Cleanup
      return () => {
        if (brandTitleRef.current) {
          brandTitleRef.current.removeEventListener("mouseenter", handleMouseEnter);
        }
      };
    }
  });

  return {
    navRef,
    brandTitleRef,
  };
};
