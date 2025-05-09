import { Button } from "@/components/ui/button";

export const SearchInput = () => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="2lg:hidden flex size-[40px] rounded-md border-slate-300 bg-slate-100 p-2 text-sm font-bold text-slate-500"
      >
        /
      </Button>
      <div className="2lg:flex hidden size-full max-w-[350px] items-center space-x-2">
        <div className="relative size-full flex-1">
          <input
            placeholder={("placeholder")}
            className="size-full truncate rounded-lg border-slate-300 pl-3 placeholder:text-sm placeholder:text-slate-600"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute right-1 top-1 size-8 rounded-md border border-slate-200 bg-slate-100 text-sm font-bold text-slate-500"
          >
            /
          </Button>
        </div>
      </div>
    </>
  );
};
