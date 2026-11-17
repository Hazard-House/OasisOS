import { cn } from "@/lib/utils";
import navyMark from "../../assets/brand/oasis-mark-navy.png";
import yellowMark from "../../assets/brand/oasis-mark-yellow.png";

// Navy on light surfaces, yellow on dark and navy surfaces. Both files are
// the official 20-ray mark with only the color changed.
export function OasisLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0", className)}>
      <img
        src={navyMark}
        alt="OasisOS"
        className="h-full w-full object-contain dark:hidden"
      />
      <img
        src={yellowMark}
        alt=""
        aria-hidden
        className="hidden h-full w-full object-contain dark:block"
      />
    </span>
  );
}
