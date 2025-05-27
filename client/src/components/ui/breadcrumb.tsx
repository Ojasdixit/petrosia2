import * as React from "react";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { Link } from "wouter";

import { cn } from "@/lib/utils";

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode;
  children: React.ReactNode;
}

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {
  isCurrent?: boolean;
  children: React.ReactNode;
}

export interface BreadcrumbLinkProps {
  asChild?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Breadcrumb({
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  children,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex flex-wrap items-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {children}
      </ol>
    </nav>
  );
}

export function BreadcrumbItem({
  children,
  className,
  isCurrent = false,
  ...props
}: BreadcrumbItemProps) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-current={isCurrent ? "page" : undefined}
      {...props}
    >
      {children}
      {!isCurrent && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
    </li>
  );
}

export function BreadcrumbLink({
  asChild,
  href,
  className,
  children,
  ...props
}: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : Link;
  return (
    <Comp
      href={href}
      className={cn("transition-colors hover:text-foreground font-medium", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-4 w-4 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export function BreadcrumbHome({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn("flex h-4 w-4 items-center justify-center", className)}
      {...props}
    >
      <Home className="h-4 w-4" />
      <span className="sr-only">Home</span>
    </span>
  );
}