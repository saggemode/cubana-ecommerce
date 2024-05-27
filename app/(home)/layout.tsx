import ClientOnly from "@/components/ClientOnly";
 import { Navbar } from "./_components/navbar";
import Footer from "./_components/Footer";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <ClientOnly>
      <Navbar />
      <div className="px-[1.5rem] md:px-[4rem] lg:px-[4rem] xl:px-[6rem] 2xl:px-[10rem]">
        {children}
      </div>
      <Footer />
    </ClientOnly>
  );
};

export default ProtectedLayout;
