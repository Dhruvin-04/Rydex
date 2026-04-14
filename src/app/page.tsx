import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";

export default async function Home() {
  const session = await auth()
  return (
    <div className="w-full min-h-screen bg-zinc-50 font-sans text-black">
      <Navbar/>
      {session?.user?.role == "partner"?<PartnerDashboard/>:(session?.user?.role == "admin"?<AdminDashboard/>:<PublicHome/>)}
      <Footer/>
    </div>
  );
}
