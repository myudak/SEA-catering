"use client";
import { useTransitionRouter } from "next-view-transitions";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type TransitionLinkProps = {
  funcBeforeTransition?: () => void;
  funcAfterTransition?: () => void;
} & LinkProps &
  AnchorProps;

const TransitionLink = ({
  funcBeforeTransition,
  funcAfterTransition,
  href,
  children,
  ...props
}: TransitionLinkProps) => {
  const router = useTransitionRouter();
  const pathname = usePathname();

  const slideInOut = () => {
    document.documentElement.classList.add("enable-view-transition");

    const oldAnim = document.documentElement.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0.2, transform: "translateY(-35%)" },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    const newAnim = document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    // Wait for both animations + give browser time to flush rendering
    Promise.allSettled([oldAnim.finished, newAnim.finished]).then(() => {
      // Add a rendering safety buffer (at least 1-2 frames)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove("enable-view-transition");
        });
      });
    });

    // document.documentElement.classList.remove("enable-view-transition");
  };

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (funcBeforeTransition) funcBeforeTransition();
        e.preventDefault();
        if (href === pathname) return;
        router.push(href, {
          onTransitionReady: slideInOut,
        });
        if (funcAfterTransition) funcAfterTransition();
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;
