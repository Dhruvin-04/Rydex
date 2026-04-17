import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import connectDB from "@/lib/db";
import User from "@/models/user.model";

export default async function Home() {
  const session = await auth()
  await connectDB()
  const user = await User.findOne({ email: session?.user?.email })
  
  return (
    <div className="w-full min-h-screen bg-zinc-50 font-sans text-black">
      <Navbar/>
      {user?.role == "partner"?<PartnerDashboard/>:(user?.role == "admin"?<AdminDashboard/>:<PublicHome/>)}
      <Footer/>
    </div>
  );
}
