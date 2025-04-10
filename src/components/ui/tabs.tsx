"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        setLocalValue(newValue);
        onValueChange?.(newValue);
      },
      [onValueChange]
    );

    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
        data-value={localValue}
      />
    );
  }
);
Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1",
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
          className
        )}
        {...props}
        data-value={value}
        onClick={(e) => {
          const tabs = e.currentTarget.closest("[data-value]");
          if (tabs) {
            const tabsValue = tabs.getAttribute("data-value");
            if (tabsValue !== value) {
              const changeEvent = new CustomEvent("tabs-value-change", {
                detail: { value },
                bubbles: true,
              });
              tabs.dispatchEvent(changeEvent);
            }
          }
          props.onClick?.(e);
        }}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const tabs = React.useRef<HTMLElement | null>(null);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
      let element = ref?.current?.closest("[data-value]");
      if (element) {
        tabs.current = element as HTMLElement;
        const tabsValue = element.getAttribute("data-value");
        setVisible(tabsValue === value);

        const handleValueChange = (event: Event) => {
          const detail = (event as CustomEvent).detail;
          setVisible(detail.value === value);
        };

        element.addEventListener("tabs-value-change", handleValueChange);
        return () => {
          element?.removeEventListener("tabs-value-change", handleValueChange);
        };
      }
    }, [ref, value]);

    return visible ? (
      <div
        ref={ref}
        className={cn(
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    ) : null;
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent }; 