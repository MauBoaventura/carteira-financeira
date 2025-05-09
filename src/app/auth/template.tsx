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
              src="/assets/icon-atlas.svg"
              width={222.83}
              height={35}
              alt="logo"
            />
            <Image
              className="hidden dark:block"
              src="/assets/foxgreen-logo-dark.svg"
              width={222.83}
              height={35}
              alt="company-logo"
            />
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
    </main>
  );
}