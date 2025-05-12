import { ThemeToggle } from "@/components/global/theme-toggle";
import Image from "next/image";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <main className="dark:bg-background flex h-screen bg-slate-50 md:overflow-hidden">
      <div className="relative hidden w-1/2 items-center justify-center bg-[#0F172A] md:flex">
        <div className="absolute bottom-0 right-0 ">
          <Image
            src="/assets/rgray.svg"
            width={1711}
            height={1888}
            alt="raposa-cinza"
            className="h-lvh opacity-5"
          />
        </div>
        <div className="absolute right-0 h-lvh ">
          <Image
            src="/assets/raposa.svg"
            width={702}
            height={700}
            alt="raposa-verde"
            className="bottom-0 right-0 h-lvh"
          />
        </div>
      </div>
      <div className={"flex size-full flex-col md:w-1/2"}>
        <div className="sticky flex w-full justify-end p-4">
          {/* <ChangeLanguage /> */}
        </div>

        <div className="flex size-full flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center">
            <Image
              className="block dark:hidden"
              src="/assets/logo-carteira.svg"
              width={222.83}
              height={35}
              alt="logo"
            />
            <div className="hidden dark:block">
              <div className="flex flex-row gap-2 leading-5 content-center self-center justify-center">
                <Image
                  src="/assets/icon-carteira.svg"
                  alt="Next.js logo"
                  width={60}
                  height={38}
                  priority
                />
                <div className="flex flex-col content-center self-center justify-center text-lg">
                  <span className="text-gray-800 font-bold">Carteira</span>
                  <span className="text-gray-800 font-bold">VirtuALL</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "flex w-full items-center justify-center overflow-y-auto"
            }
          >
            {children}
          </div>
        </div>
      </div>
      <ThemeToggle />
    </main>
  );
}