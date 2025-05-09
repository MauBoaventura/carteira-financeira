import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Notifications = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-md border p-2 text-slate-600"
      aria-label="Notifications"
    >
      <Image
        className="dark:invert"
        src="/assets/logo-atlas.svg"
        alt="Next.js logo"
        width={50}
        height={38}
        priority
      />
    </Button>
  );
};
