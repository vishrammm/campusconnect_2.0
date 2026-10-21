import { useState } from "react";
import { api, clearToken, setToken } from "@/lib/api";
import type { ReactNode } from "react";
import {
  Search, Bell, Package, Megaphone, Calendar, ShoppingBag, LogOut, User, Home,
  Menu, X, Plus, Upload, ArrowLeft, Check, Download, Eye, Trash2, Pencil, Clock,
  MapPin, Send, AlertCircle, Briefcase, Shield, Building2, CheckCircle, Image,
  Phone, Mail, Settings, Users, ChevronRight, BarChart3, Sun, Moon, Sparkles,
  GraduationCap,
} from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";
// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "student" | "co-admin" | "admin" | "staff";
 type View =
    | "login" | "signup-student" | "signup-coadmin" | "signup-staff"
  | "student-dashboard" | "lost-found" | "notice-board"
  | "event-hub" | "marketplace" | "co-admin-dashboard"
  | "admin-dashboard" | "notifications" | "profile"
  | "staff-dashboard";

interface AppUser { name: string; email: string; role: Role; year?: string; branch?: string; club?: string; mobile?: string; title?: string; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const LOST_ITEMS = [
  { id: 1, name: "Black Leather Wallet", category: "Accessories", location: "Near Central Library", date: "Jan 15, 2024", description: "Black leather wallet with student ID and transit card inside. Last seen near the library entrance gate.", reporter: "Rahul Sharma", color: "#1e3a5f" },
  { id: 2, name: "Blue Steel Water Bottle", category: "Personal Items", location: "Canteen Area", date: "Jan 17, 2024", description: "Blue 1L steel water bottle with 'SK' initials etched on the side. Has a small dent at the bottom.", reporter: "Sneha Kumar", color: "#1e4d6e" },
  { id: 3, name: "Casio fx-991ES Plus", category: "Electronics", location: "Lab 301, Block A", date: "Jan 18, 2024", description: "Scientific calculator with a red sticker on the back panel. Found on the lab bench after afternoon session.", reporter: "Arjun Mehta", color: "#2d3748" },
  { id: 4, name: "Purple Floral Umbrella", category: "Accessories", location: "Main Gate Security", date: "Jan 19, 2024", description: "Medium-sized purple umbrella with floral print. Handed over to main gate security on Jan 19.", reporter: "Priya Nair", color: "#553c9a" },
  { id: 5, name: "Engineering Drawing Notebook", category: "Stationery", location: "Workshop Block", date: "Jan 20, 2024", description: "A4 drawing notebook with the name 'Vivek' on the cover. Contains completed semester assignments.", reporter: "Vivek Reddy", color: "#1a4a2e" },
  { id: 6, name: "USB-C Phone Charger", category: "Electronics", location: "Seminar Hall 2", date: "Jan 21, 2024", description: "White USB-C charging cable with a yellow cable tag. Left behind after the technical symposium.", reporter: "Kavya S.", color: "#3d2d4e" },
  { id: 7, name: "Single Wireless Earbud", category: "Electronics", location: "Main Building Courtyard", date: "Jan 22, 2024", description: "A single white wireless earbud found near the main building courtyard. Please contact the reporter if it belongs to you.", reporter: "Rohan Joshi — Peon", color: "#25324a" },
];


const NOTICES = [
  { id: 1, title: "Mid-Semester Examination Schedule Released", category: "Examination", description: "Mid-semester examinations will be conducted from February 10–20, 2024. Students must carry valid ID cards. Hall tickets downloadable from the student portal.", postedBy: "Academic Office", date: "Jan 18, 2024", attachment: "PDF", important: true },
  { id: 2, title: "Campus Cleanliness Drive — Volunteers Needed", category: "General", description: "The NSS unit is organizing a campus cleanliness drive on January 27th. All interested students can register using the form in the attachment.", postedBy: "NSS Unit", date: "Jan 17, 2024", attachment: "PDF", important: false },
  { id: 3, title: "Updated Anti-Ragging Committee Guidelines 2024", category: "Guidelines", description: "All students must read and acknowledge the updated anti-ragging guidelines. Strict action will be taken against violators per UGC regulations.", postedBy: "Student Welfare", date: "Jan 16, 2024", attachment: "PDF", important: true },
  { id: 4, title: "Placement Drive: TCS Smartpath — Register Now", category: "Academic", description: "TCS will conduct a placement drive on February 5, 2024. Eligible students (CGPA 7+, 2025 batch) must register by January 28. Pre-placement talk on February 3.", postedBy: "Training & Placement Cell", date: "Jan 15, 2024", attachment: "PDF", important: true },
  { id: 5, title: "Republic Day Celebration — Program Schedule", category: "Events", description: "The college will celebrate Republic Day on January 26th with a cultural program at 9:00 AM in the Main Auditorium. All students and staff are invited.", postedBy: "College Office", date: "Jan 14, 2024", attachment: null, important: false },
  { id: 6, title: "Library Loan Policy Update Effective February 1", category: "Academic", description: "The loan period is being reduced to 10 days from February 1. Late returns incur ₹2/day fine. Online renewals are now available via the library portal.", postedBy: "Central Library", date: "Jan 13, 2024", attachment: null, important: false },
];

const CLUBS = [
  { id: 1, name: "Coding Club", shortDesc: "Build, collaborate, and innovate with code.", description: "A community of passionate developers and problem-solvers. We host hackathons, coding contests, workshops, and tech talks all year round. Open to all branches.", color: "#2563eb", members: 120, lead: "Arjun Mehta" },
  { id: 2, name: "Robotics Club", shortDesc: "Engineering meets imagination — build and compete.", description: "Students passionate about automation and mechatronics. From line-followers to autonomous robots, we build, test, and compete at national-level events.", color: "#7c3aed", members: 85, lead: "Kavya Sharma" },
  { id: 3, name: "IEEE Student Branch", shortDesc: "Connecting engineers to the global IEEE network.", description: "Organizes technical seminars, workshops, and networking events. Connects students with global IEEE resources, research publications, and industry professionals.", color: "#0891b2", members: 200, lead: "Rahul Verma" },
  { id: 4, name: "Cultural Club", shortDesc: "Celebrate art, music, dance, and campus culture.", description: "The heartbeat of campus life. We organize annual fests, music nights, art exhibitions, drama performances, and inter-college cultural competitions.", color: "#e11d48", members: 150, lead: "Priya Nair" },
  { id: 5, name: "Sports Club", shortDesc: "Play hard. Train harder. Win together.", description: "Manages all inter-college and intra-college sports events. Supporting cricket, football, basketball, badminton, chess, and more with professional coaching.", color: "#16a34a", members: 180, lead: "Vikram Rao" },
  { id: 6, name: "E-Cell", shortDesc: "Where campus entrepreneurs are made.", description: "The Entrepreneurship Cell fosters an entrepreneurial mindset. Hosts startup competitions, mentorship sessions, and investor meet-and-greets throughout the year.", color: "#d97706", members: 95, lead: "Sneha Kulkarni" },
];

const EVENTS = [
  { id: 1, clubId: 1, name: "HackSprint 2024", date: "Feb 10, 2024", time: "9:00 AM", venue: "Computer Lab Block A", description: "24-hour hackathon open to all students. Build innovative solutions to real problems. Prizes worth ₹50,000. Form teams of 2–4 members.", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=480&h=240&fit=crop&auto=format", open: true },
  { id: 2, clubId: 1, name: "React & Next.js Deep Dive", date: "Jan 28, 2024", time: "2:00 PM", venue: "Seminar Hall", description: "Hands-on workshop building modern web apps with React 18 and Next.js 14. Bring your laptop. Prior JavaScript knowledge recommended.", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480&h=240&fit=crop&auto=format", open: true },
  { id: 3, clubId: 2, name: "Robowar Championship 2024", date: "Feb 15, 2024", time: "10:00 AM", venue: "Engineering Ground", description: "Annual robot combat competition. Design, build, and battle your robot. Open to all years. Prizes up to ₹30,000 with certificates.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=480&h=240&fit=crop&auto=format", open: true },
  { id: 4, clubId: 4, name: "Kaleidoscope Cultural Fest 2024", date: "Feb 20–22, 2024", time: "8:00 AM", venue: "Main Auditorium", description: "Three-day cultural extravaganza with music, dance, drama, and fine arts. Over 1,000 participants expected from 8 colleges statewide.", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=480&h=240&fit=crop&auto=format", open: true },
  { id: 5, clubId: 5, name: "Inter-College Cricket Tournament", date: "Feb 5–8, 2024", time: "7:00 AM", venue: "College Cricket Ground", description: "Four-day cricket tournament with 12 participating colleges. Day/night matches scheduled. Come support our team in their home games!", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=480&h=240&fit=crop&auto=format", open: false },
  { id: 6, clubId: 6, name: "Startup Pitch Day", date: "Jan 30, 2024", time: "3:00 PM", venue: "Conference Room B", description: "Present your startup idea to a panel of investors and mentors. Cash prizes and incubation opportunities for the top 3 pitches selected.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=480&h=240&fit=crop&auto=format", open: true },
];

const PRODUCTS = [
  { id: 1, name: "Engineering Mathematics Vol. 1 & 2", price: 350, condition: "Like New", seller: "Vishram Patel", location: "Near Central Library", category: "Books", description: "B.S. Grewal Higher Engineering Mathematics, 44th edition. Both volumes, no highlights or markings. Bought this semester.", color: "#1e3a5f" },
  { id: 2, name: "Casio fx-991ES Plus Scientific Calculator", price: 550, condition: "Good", seller: "Meena R.", location: "Hostel Block C", category: "Calculators", description: "Working condition, minor cosmetic scratches on the back. New battery installed last month.", color: "#2d4a3e" },
  { id: 3, name: "Arduino Uno Starter Kit", price: 800, condition: "Good", seller: "Karan Singh", location: "Electronics Department", category: "Electronics", description: "Arduino Uno + full breadboard + jumper wire pack + sensor set. Everything tested and working post-project submission.", color: "#1a3a4a" },
  { id: 4, name: "White Lab Coat (Size M)", price: 150, condition: "Fair", seller: "Divya M.", location: "Near Canteen Block", category: "Lab Equipment", description: "Standard white lab coat size medium. Minor stain on the right sleeve. Functional and clean otherwise.", color: "#3d3d3d" },
  { id: 5, name: "Atlas Bicycle — Campus Ready", price: 2500, condition: "Good", seller: "Rohan D.", location: "Main Gate Area", category: "Cycles", description: "Atlas cycle in solid working condition. New tyres installed last month. Minor surface rust on stand only.", color: "#1a3a2e" },
  { id: 6, name: "Staedtler Drawing Instruments Set", price: 200, condition: "Like New", seller: "Aisha Khan", location: "Workshop Block", category: "Stationery", description: "Complete Staedtler engineering drawing set — compass, protractor, set squares. Used one semester only.", color: "#2a3a5e" },
];

const NOTIFS = [
  { id: 1, type: "notice", text: "New notice: Mid-Semester Examination Schedule has been released", time: "2 hours ago", read: false },
  { id: 2, type: "event", text: "HackSprint 2024 registration closes in 3 days — register now", time: "5 hours ago", read: false },
  { id: 3, type: "lost", text: "A student may have found your reported item: Black Leather Wallet", time: "1 day ago", read: true },
  { id: 4, type: "marketplace", text: "Your listing 'Engineering Maths Book' received a buyer inquiry", time: "2 days ago", read: true },
  { id: 5, type: "general", text: "Welcome to Campus Connect! Explore all four core modules.", time: "3 days ago", read: true },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────
const NOTICECAT: Record<string, string> = {
  Examination: "bg-red-50 text-red-600 border-red-200",
  Academic: "bg-blue-50 text-blue-600 border-blue-200",
  General: "bg-slate-50 text-slate-600 border-slate-200",
  Guidelines: "bg-orange-50 text-orange-600 border-orange-200",
  Events: "bg-purple-50 text-purple-600 border-purple-200",
};

const ITEMCAT: Record<string, string> = {
  Accessories: "bg-purple-50 text-purple-600 border-purple-200",
  Electronics: "bg-blue-50 text-blue-600 border-blue-200",
  "Personal Items": "bg-teal-50 text-teal-600 border-teal-200",
  Stationery: "bg-amber-50 text-amber-700 border-amber-200",
  Books: "bg-green-50 text-green-600 border-green-200",
};

const COND: Record<string, string> = {
  "Like New": "bg-green-50 text-green-700 border-green-200",
  Good: "bg-blue-50 text-blue-700 border-blue-200",
  Fair: "bg-amber-50 text-amber-700 border-amber-200",
  Used: "bg-slate-50 text-slate-600 border-slate-200",
};

// ─── Primitives ───────────────────────────────────────────────────────────────
function Av({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const letters = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base" };
  return (
    <div className={`${sz[size]} rounded-full bg-gradient-to-br from-[#497060] to-[#173f35] flex items-center justify-center text-white font-bold flex-shrink-0 select-none`}>
      {letters}
    </div>
  );
}

function CampusMark({ size = "md" }: { size?: "sm" | "md" }) {
  const dimensions = size === "sm" ? "w-9 h-9" : "w-12 h-12";
  return (
    <div className={`${dimensions} rounded-2xl bg-[#173f35] text-[#f6efe2] flex items-center justify-center shadow-sm ring-1 ring-[#f6efe2]/20`} aria-hidden="true">
      <GraduationCap className={size === "sm" ? "w-5 h-5" : "w-6 h-6"} strokeWidth={1.8} />
    </div>
  );
}

function Chip({ label, className = "" }: { label: string; className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}>{label}</span>;
}

function Btn({ children, onClick, v = "blue", sz = "md", full = false, cls = "", type = "button", disabled = false }: {
  children: ReactNode; onClick?: () => void; v?: "blue" | "violet" | "ghost" | "red" | "outline" | "dark";
  sz?: "xs" | "sm" | "md" | "lg"; full?: boolean; cls?: string; type?: "button" | "submit"; disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const V = {
    blue: "bg-[#173f35] hover:bg-[#0e3027] text-white focus:ring-[#497060] shadow-sm hover:shadow-md",
    violet: "bg-[#a75e3a] hover:bg-[#874727] text-white focus:ring-[#a75e3a] shadow-sm",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300",
    red: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    outline: "bg-white border border-[#b9cdbf] hover:border-[#497060] hover:bg-[#eef3ed] text-[#173f35] focus:ring-[#b9cdbf]",
    dark: "bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-500",
  };
  const S = { xs: "px-2.5 py-1 text-xs", sm: "px-3.5 py-2 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3 text-sm" };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${V[v]} ${S[sz]} ${full ? "w-full" : ""} ${cls}`}>
      {children}
    </button>
  );
}

const fld = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

function Inp({ label, type = "text", ph, val, set, req, cls = "" }: {
  label?: string; type?: string; ph?: string; val: string; set: (v: string) => void; req?: boolean; cls?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${cls}`}>
      {label && <label className="text-sm font-semibold text-slate-700">{label}{req && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <input type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)} required={req} className={fld} />
    </div>
  );
}

function Sel({ label, val, set, opts, req, cls = "" }: {
  label?: string; val: string; set: (v: string) => void; opts: string[]; req?: boolean; cls?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${cls}`}>
      {label && <label className="text-sm font-semibold text-slate-700">{label}{req && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select value={val} onChange={e => set(e.target.value)} required={req} className={`${fld} appearance-none`}>
        <option value="">Select…</option>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Txta({ label, ph, val, set, rows = 4, req }: {
  label?: string; ph?: string; val: string; set: (v: string) => void; rows?: number; req?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}{req && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <textarea placeholder={ph} value={val} onChange={e => set(e.target.value)} rows={rows} required={req} className={`${fld} resize-none`} />
    </div>
  );
}

function UpBox({ label = "Click to upload", sub = "PNG, JPG or PDF up to 5MB" }: { label?: string; sub?: string }) {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
      <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-blue-400 transition-colors" />
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

function WinCard({ title, message, cta }: { title: string; message: string; cta: ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm max-w-md w-full text-center">
        <div className="w-18 h-18 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 w-16 h-16">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-8">{message}</p>
        {cta}
      </div>
    </div>
  );
}

function Empty({ icon: Icon, title, sub }: { icon: typeof Package; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-300" />
      </div>
      <p className="font-semibold text-slate-500">{title}</p>
      {sub && <p className="text-sm text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, gotoSignup }: { onLogin: (u: AppUser) => void; gotoSignup: (r: "student" | "co-admin" | "staff") => void }) {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [err, setErr] = useState("");

  const [busy, setBusy] = useState(false);
  const submit = async () => {
    const identifier = role === "staff" ? mobile.trim() : email.trim();
    if (!identifier || !pw) { setErr(role === "staff" ? "Staff login requires your mobile number and password." : "Enter your email/username and password."); return; }
    setBusy(true); setErr("");
    try {
      const result = await api<{ token: string; user: AppUser }>("/auth/login", { method: "POST", body: JSON.stringify({ identifier, password: pw, role }) });
      setToken(result.token);
      onLogin(result.user);
    } catch (e) { setErr(e instanceof Error ? e.message : "Unable to sign in."); }
    finally { setBusy(false); }
  };

  const features = [
    { title: "Lost & Found", detail: "Help items find their way home", Icon: Package },
    { title: "Notice Board", detail: "Stay informed instantly", Icon: Megaphone },
    { title: "Event Hub", detail: "Discover clubs and campus events", Icon: Calendar },
    { title: "Marketplace", detail: "Buy and sell within campus", Icon: ShoppingBag },
  ];
  const roleLabels: Record<Role, string> = { student: "Student", "co-admin": "Co-Admin", admin: "Admin", staff: "Staff" };
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#16251f] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#173f35] lg:flex lg:items-center lg:justify-center lg:p-8 xl:p-12">
        <img src="/login-image.jpg" alt="Anjuman-I-Islam's M. H. Saboo Siddik College of Engineering campus" className="absolute inset-0 h-full w-full object-contain object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102b24]/80 via-[#102b24]/18 to-transparent" />
        <div className="relative z-10 mt-auto w-full px-7 pb-8 xl:px-10 xl:pb-10">
          <div className="max-w-[500px] mb-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f0d695]">MHSSCE campus network</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Your campus, in one place.</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">Everything you need to stay connected, informed, and involved—without searching across separate groups.</p>
          </div>
          <div className="grid max-w-[500px] grid-cols-2 gap-2.5">
            {features.map(({ title, detail, Icon }, index) => (
              <button key={title} onMouseEnter={() => setActiveFeature(index)} onFocus={() => setActiveFeature(index)} onClick={() => setActiveFeature(index)}
                className={`flex items-center gap-3 rounded-sm border px-4 py-3 text-left text-sm font-semibold text-white transition-all ${activeFeature === index ? "border-[#e6c883] bg-[#173f35]/70" : "border-white/60 bg-[#102b24]/45 hover:bg-[#102b24]/70"}`}>
                <Icon className={`h-4 w-4 ${activeFeature === index ? "text-[#e6c883]" : "text-white/85"}`} />
                <span><span className="block">{title}</span><span className="block text-[10px] font-medium text-white/70">{detail}</span></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-[380px]">
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <CampusMark size="sm" />
            <div>
              <span className="block font-extrabold text-lg">Campus Connect</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#64756d]">MHSSCE campus network</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#d8d0c2] bg-[#fffdf8] p-5 sm:p-6 shadow-[0_14px_35px_rgba(39,58,47,0.10)]">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a75e3a]">Secure sign in</span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#497060]"><span className="w-1.5 h-1.5 rounded-full bg-[#497060]" />MHSSCE access</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#16251f]">Welcome back.</h1>
              <p className="text-[#64756d] text-xs mt-1.5">Choose your role, then continue to your campus space.</p>
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#64756d]">Sign in as</label>
              <select value={role} onChange={e => { setRole(e.target.value as Role); setErr(""); }}
                className="w-full appearance-none rounded-lg border border-[#d8d0c2] bg-[#edf0e9] px-3 py-2.5 text-xs font-bold text-[#173f35] outline-none transition focus:border-[#a75e3a] focus:ring-2 focus:ring-[#a75e3a]/20">
                {(["student", "co-admin", "admin", "staff"] as Role[]).map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64756d]">
                  {role === "staff" ? "Mobile Number" : "Email / Username"}
                </label>
                <div className="relative group">
                  {role === "staff"
                    ? <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#839088] group-focus-within:text-[#a75e3a] transition-colors" />
                    : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#839088] group-focus-within:text-[#a75e3a] transition-colors" />}
                  <input
                    type={role === "staff" ? "tel" : "email"}
                    placeholder={role === "staff" ? "e.g., +91 98765 43210" : "you@mhssce.ac.in"}
                    value={role === "staff" ? mobile : email}
                    onChange={e => {
                      if (role === "staff") setMobile(e.target.value);
                      else setEmail(e.target.value);
                      setErr("");
                    }}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#d8d0c2] bg-[#fffdf8] text-[#16251f] placeholder:text-[#99a199] focus:outline-none focus:ring-2 focus:ring-[#a75e3a]/25 focus:border-[#a75e3a] transition-all text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64756d]">Password</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#839088] group-focus-within:text-[#a75e3a] transition-colors" />
                  <input type={showPw ? "text" : "password"} placeholder="Enter your password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} required
                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-[#d8d0c2] bg-[#fffdf8] text-[#16251f] placeholder:text-[#99a199] focus:outline-none focus:ring-2 focus:ring-[#a75e3a]/25 focus:border-[#a75e3a] transition-all text-xs" />
                  <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#839088] hover:text-[#173f35] hover:bg-[#edf0e9] transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-[#64756d] cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-[#b9c3b7] text-[#173f35] focus:ring-[#173f35]/40" />
                  Remember me
                </label>
                <button type="button" className="text-xs text-[#a75e3a] hover:text-[#7f4328] font-bold transition-colors">Forgot password?</button>
              </div>

              {err && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
                </div>
              )}

              <ParticleButton type="button" onClick={submit}
                className="w-full rounded-lg bg-[#173f35] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#0e3027] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:ring-[#a75e3a]">
                {busy ? "Signing in…" : "Enter Campus Connect"} <ChevronRight className="w-4 h-4" />
              </ParticleButton>
            </div>

            {role !== "admin" && (
              <p className="mt-4 text-center text-xs text-[#64756d]">
                New to the network?{" "}
                <button onClick={() => gotoSignup(role as "student" | "co-admin" | "staff")}
                  className="text-[#a75e3a] hover:text-[#7f4328] font-bold transition-colors">Create an account</button>
              </p>
            )}
          </div>
          <p className="text-center text-[11px] text-[#758078] mt-5">Use your official MHSSCE credentials to continue.</p>
        </div>
    </section>
  </main>
  );
}

// ─── Signup ───────────────────────────────────────────────────────────────────
function SignupPage({ role, back }: { role: "student" | "co-admin" | "staff"; back: () => void }) {
  const [f, setF] = useState({ name: "", email: "", mobile: "", title: "", user: "", pw: "", confirm: "", year: "", branch: "", club: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const s = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const roleName = role === "student" ? "Student" : role === "co-admin" ? "Co-Admin" : "Staff";
  const requiredMessage = role === "staff" ? "Please fill in your name, mobile number, and position." : "Please fill all required fields.";

  if (done) return (
    <div className="cc-auth min-h-screen flex items-center justify-center bg-[#070b17] text-white p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="relative z-10 bg-slate-900/80 rounded-[2rem] shadow-2xl border border-white/10 p-10 max-w-md w-full text-center backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-400/15 border border-emerald-300/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-emerald-300" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Account Created<span className="text-cyan-300">.</span></h2>
        <p className="text-slate-400 mb-8 text-sm">Your {roleName.toLowerCase()} account is ready. You can now sign in.</p>
        <button onClick={back} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all">Go to Login <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className="cc-auth min-h-screen bg-[#070b17] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        .cc-auth .text-slate-700 { color: #cbd5e1 !important; }
        .cc-auth .text-slate-500 { color: #94a3b8 !important; }
        .cc-auth input, .cc-auth select, .cc-auth textarea { background: rgba(255,255,255,.06) !important; color: #f8fafc !important; border-color: rgba(255,255,255,.10) !important; color-scheme: dark; }
        .cc-auth input::placeholder { color: #64748b !important; }
        .cc-auth select option { background: #0f172a; color: #f8fafc; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 -left-32 w-[34rem] h-[34rem] rounded-full bg-blue-600/15 blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 right-0 w-[38rem] h-[38rem] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.12) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-500/30 rotate-3 hover:rotate-0 transition-transform mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <p className="text-cyan-300 text-[10px] font-bold uppercase tracking-[0.28em] mb-2">MHSSCE campus network</p>
          <h1 className="text-3xl font-black text-white">Create your account<span className="text-cyan-300">.</span></h1>
          <p className="text-slate-400 text-sm mt-2">{roleName} registration for Campus Connect</p>
        </div>

        <div className="bg-slate-900/80 rounded-[2rem] shadow-2xl shadow-black/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-7">
            <button onClick={back} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Registration</p><h2 className="font-bold text-white mt-1">Tell us about you</h2></div>
          </div>

          <div className="space-y-4">
            <Inp label="Full Name" ph={role === "staff" ? "e.g., Dr. Neha Sharma" : "e.g., Arjun Mehta"} val={f.name} set={s("name")} req />
            <Inp
              label={role === "staff" ? "College Email (optional)" : "College Email"}
              type="email"
              ph="you@mhssce.ac.in"
              val={f.email}
              set={s("email")}
              req={role !== "staff"}
            />

            {role === "staff" && (
              <>
                <Inp label="Mobile Number" type="tel" ph="e.g., +91 98765 43210" val={f.mobile} set={s("mobile")} req />
                <Inp label="Title / Position" ph="e.g., Assistant Professor" val={f.title} set={s("title")} req />
                <Inp label="Branch (optional)" ph="e.g., Computer Engineering" val={f.branch} set={s("branch")} />
              </>
            )}

            {role === "student" && (
              <div className="grid grid-cols-2 gap-3">
                <Sel label="Year" val={f.year} set={s("year")} opts={["First Year", "Second Year", "Third Year", "Fourth Year"]} req />
                <Sel label="Branch" val={f.branch} set={s("branch")} opts={["CSE", "ECE", "EEE", "Mechanical", "Civil", "IT", "Chemical"]} req />
              </div>
            )}
            {role === "co-admin" && <Sel label="Club / Department" val={f.club} set={s("club")} opts={["Coding Club", "Robotics Club", "IEEE", "Cultural Club", "Sports Club", "E-Cell", "NSS", "Academic Office"]} req />}

            <Inp label="Username" ph="Choose a username" val={f.user} set={s("user")} req />
            <Inp label="Password" type="password" ph="Create a strong password" val={f.pw} set={s("pw")} req />
            <Inp label="Confirm Password" type="password" ph="Re-enter your password" val={f.confirm} set={s("confirm")} req />

            {err && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/20 rounded-xl text-red-300 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{err}</div>}
            <button type="button" disabled={busy} onClick={async () => {
              const valid = role === "staff" ? f.name && f.mobile && f.title && f.pw && f.user : f.name && f.email && f.pw && f.user;
              if (!valid) { setErr(requiredMessage); return; }
              if (f.pw.length < 8) { setErr("Password must contain at least 8 characters."); return; }
              if (f.pw !== f.confirm) { setErr("Passwords do not match."); return; }
              setBusy(true); setErr("");
              try {
                await api("/auth/register", { method: "POST", body: JSON.stringify({ name: f.name, email: f.email || undefined, username: f.user, password: f.pw, role, mobile: f.mobile || undefined, title: f.title || undefined, year: f.year || undefined, branch: f.branch || undefined, club: f.club || undefined }) });
                setDone(true);
              } catch (e) { setErr(e instanceof Error ? e.message : "Unable to create account."); }
              finally { setBusy(false); }
            }} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-blue-500/20 hover:shadow-cyan-400/20 hover:-translate-y-0.5 transition-all disabled:opacity-60">
              {busy ? "Creating account…" : `Create ${roleName} Account`} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <button onClick={back} className="text-cyan-300 hover:text-cyan-200 font-bold transition-colors">Sign In</button></p>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ user, active, nav, setView, onLogout, open, setOpen }: {
  user: AppUser; active: View; nav: { id: View; label: string; Icon: typeof Home }[];
  setView: (v: View) => void; onLogout: () => void; open: boolean; setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#102b24] flex flex-col transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 flex-shrink-0">
          <CampusMark size="sm" />
          <div>
            <div className="font-extrabold text-white text-sm leading-none">Campus Connect</div>
            <div className="text-xs text-slate-500 mt-0.5 capitalize">{user.role === "co-admin" ? "Co-Admin" : user.role === "staff" ? "Staff" : user.role} Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {nav.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setView(id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${active === id ? "bg-[#497060] text-white" : "text-slate-400 hover:text-white hover:bg-white/10"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 px-1 mb-3">
            <Av name={user.name} size="sm" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user.role}</div>
            </div>
          </div>
          <button onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ user, onMenu, search, onSearch, onBell, dark, onToggleTheme }: {
  user: AppUser; onMenu: () => void; search: string; onSearch: (v: string) => void; onBell: () => void;
  dark: boolean; onToggleTheme: () => void;
}) {
  return (
    <header className="h-16 bg-white dark:bg-slate-900/90 border-b border-slate-100 dark:border-white/10 flex items-center gap-4 px-4 lg:px-6 flex-shrink-0 backdrop-blur-xl transition-colors duration-300">
      <button onClick={onMenu} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors lg:hidden">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 max-w-xs">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#a75e3a] transition-colors" />
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search campus…"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a75e3a]/30 focus:border-[#a75e3a]/50 transition-all" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button onClick={onToggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:rotate-12">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button onClick={onBell} className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>
        <div className="flex items-center gap-2.5 pl-1 border-l border-slate-100 dark:border-white/10">
          <Av name={user.name} size="sm" />
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 dark:text-white leading-none">{user.name.split(" ")[0]}</div>
            <div className="text-xs text-slate-400 mt-0.5 capitalize">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
function StudentDashboard({ user, setView }: { user: AppUser; setView: (v: View) => void }) {
  

  const modules = [
    { id: "lost-found" as View, title: "Lost & Found", desc: "Find what's lost. Return what's found.", Icon: Package, grad: "from-blue-500 to-blue-700", bg: "bg-blue-50", text: "text-blue-700", count: `${LOST_ITEMS.length} active reports` },
    { id: "notice-board" as View, title: "Notice Board", desc: "Stay updated with important campus information.", Icon: Megaphone, grad: "from-violet-500 to-violet-700", bg: "bg-violet-50", text: "text-violet-700", count: `${NOTICES.length} notices posted` },
    { id: "event-hub" as View, title: "Event Hub", desc: "Discover clubs and upcoming campus events.", Icon: Calendar, grad: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50", text: "text-emerald-700", count: `${EVENTS.length} upcoming events` },
    { id: "marketplace" as View, title: "Marketplace", desc: "Buy and sell useful items within campus.", Icon: ShoppingBag, grad: "from-amber-500 to-orange-600", bg: "bg-amber-50", text: "text-amber-700", count: `${PRODUCTS.length} active listings` },
  ];

  const updates = [
    { dot: "bg-red-500", label: "Latest Notice", title: NOTICES[0].title, meta: NOTICES[0].date, extra: NOTICES[0].postedBy },
    { dot: "bg-emerald-500", label: "Upcoming Event", title: EVENTS[0].name, meta: EVENTS[0].date, extra: EVENTS[0].venue },
    { dot: "bg-blue-500", label: "Lost Item", title: LOST_ITEMS[0].name, meta: LOST_ITEMS[0].location, extra: `Reported by ${LOST_ITEMS[0].reporter}` },
    { dot: "bg-amber-500", label: "Marketplace", title: PRODUCTS[0].name, meta: `₹${PRODUCTS[0].price} · ${PRODUCTS[0].condition}`, extra: `Seller: ${PRODUCTS[0].seller}` },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Campus image hero */}
      <div className="bg-[#173f35] min-h-64 px-6 py-8 lg:px-10 lg:py-10 text-white relative overflow-hidden flex-shrink-0 group flex items-center">
        <img
          src="/campus-hero.jpg"
          alt="MHSSCE campus building"
          className="absolute inset-0 w-full h-full object-cover object-[36%_center] opacity-80 group-hover:scale-[1.03] transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#173f35]/10 via-[#173f35]/35 to-[#102b24]/95" />

        <div className="relative z-10 ml-auto w-full max-w-lg text-right">
          <p className="text-[#e6c883] text-xs font-bold uppercase tracking-[0.22em] mb-3">
            MHSSCE campus network
          </p>

          <h1 className="text-2xl lg:text-3xl font-black mb-2 leading-tight">
            Your campus, in one place<span className="text-[#e6c883]">.</span>
          </h1>

          <p className="text-[#e2ebe5] text-sm lg:text-base">
            Everything you need to stay connected, informed, and involved.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {/* Modules */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {modules.map(({ id, title, desc, Icon, grad, bg, text, count }) => (
            <button key={id} onClick={() => setView(id)}
              className="group text-left bg-white rounded-2xl border border-slate-100 p-5 lg:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-slate-900 mb-1 text-sm leading-snug">{title}</div>
              <div className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2 hidden sm:block">{desc}</div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${bg} ${text}`}>{count}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>

        {/* Latest Updates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Latest Updates</h2>
            <span className="text-xs text-slate-400">Live campus feed</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {updates.map(({ dot, label, title, meta, extra }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all hover:border-blue-100 cursor-pointer">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm line-clamp-2 mb-2 leading-snug">{title}</p>
                <p className="text-xs text-slate-500 mb-1">{meta}</p>
                <p className="text-xs text-slate-400 truncate">{extra}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lost & Found ─────────────────────────────────────────────────────────────
function LostFoundPage() {
  const [tab, setTab] = useState<"browse" | "report">("browse");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("latest");
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", cat: "", loc: "", date: "", desc: "" });
  const sf = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));

  const items = LOST_ITEMS
    .filter(i => (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase())) && (!cat || i.category === cat))
    .sort((a, b) => sort === "latest" ? b.id - a.id : a.id - b.id);

  const cats = [...new Set(LOST_ITEMS.map(i => i.category))];

  if (tab === "report") {
    if (done) return <WinCard title="Item Reported!" message="Your item has been reported successfully. Other students will be notified and can reach out to you directly." cta={<Btn v="blue" sz="lg" full onClick={() => { setDone(false); setF({ name: "", cat: "", loc: "", date: "", desc: "" }); }}>Report Another Item</Btn>} />;
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Lost & Found</h1>
          <p className="text-slate-500 mt-1 text-sm">Help items find their way back home.</p>
        </div>
        <div className="flex gap-3 mb-7">
          <Btn v="outline" sz="sm" onClick={() => setTab("browse")}><Search className="w-3.5 h-3.5" />Browse Items</Btn>
          <Btn v="blue" sz="sm"><Plus className="w-3.5 h-3.5" />Report Item</Btn>
        </div>
        <div className="max-w-lg bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-5">Report Lost / Found Item</h2>
          <div className="space-y-4">
            <UpBox label="Click to upload item image" />
            <Inp label="Item Name" ph="e.g., Black Leather Wallet" val={f.name} set={sf("name")} req />
            <Sel label="Category" val={f.cat} set={sf("cat")} opts={["Accessories", "Electronics", "Books", "Stationery", "Personal Items", "Clothing", "Other"]} req />
            <Inp label="Location Found / Last Seen" ph="e.g., Near Central Library" val={f.loc} set={sf("loc")} req />
            <Inp label="Date" type="date" val={f.date} set={sf("date")} req />
            <Txta label="Description" ph="Describe the item in detail — color, size, markings…" val={f.desc} set={sf("desc")} req />
            <Btn v="blue" sz="lg" full onClick={() => setDone(true)} disabled={!f.name || !f.cat}>Report Item</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Lost & Found</h1>
        <p className="text-slate-500 mt-1 text-sm">Help items find their way back home.</p>
      </div>
      <div className="flex gap-3 mb-6">
        <Btn v="blue" sz="sm"><Search className="w-3.5 h-3.5" />Browse Items</Btn>
        <Btn v="outline" sz="sm" onClick={() => { setTab("report"); setDone(false); }}><Plus className="w-3.5 h-3.5" />Report an Item</Btn>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by item name or location…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Categories</option>
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {items.length === 0
        ? <Empty icon={Package} title="No lost items found." sub="Try adjusting your search or category filter." />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="h-36 flex items-center justify-center relative" style={{ backgroundColor: item.color }}>
                  <Package className="w-12 h-12 text-white/40" />
                  <div className="absolute top-3 right-3">
                    <Chip label={item.category} className={ITEMCAT[item.category] ?? "bg-slate-50 text-slate-600 border-slate-200"} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{item.name}</h3>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5 flex-shrink-0" />{item.location}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="w-3.5 h-3.5 flex-shrink-0" />{item.date}</div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-xs text-slate-400">By <span className="font-semibold text-slate-600">{item.reporter}</span></span>
                    <Btn sz="xs" v="outline"><Phone className="w-3 h-3" />Contact</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

// ─── Notice Board ─────────────────────────────────────────────────────────────
function NoticeBoardPage({ user }: { user: AppUser }) {
  const [cat, setCat] = useState("");
  const [create, setCreate] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ title: "", cat: "", desc: "" });
  const sf = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));

  const cats = [...new Set(NOTICES.map(n => n.category))];
  const filtered = NOTICES.filter(n => !cat || n.category === cat);

  if (create && user.role === "co-admin") {
    if (done) return <WinCard title="Notice Published!" message="Your notice is now live on the Notice Board. All students have been notified." cta={<Btn v="blue" sz="lg" full onClick={() => { setCreate(false); setDone(false); setF({ title: "", cat: "", desc: "" }); }}>Back to Notice Board</Btn>} />;
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setCreate(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Create Notice</h1>
              <p className="text-sm text-slate-500">Publish a notice for all students</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <Inp label="Notice Title" ph="e.g., Exam Schedule Released" val={f.title} set={sf("title")} req />
            <Sel label="Category" val={f.cat} set={sf("cat")} opts={["General", "Academic", "Guidelines", "Examination", "Events", "Important"]} req />
            <Txta label="Description / Notice Text" ph="Write the full notice content here…" val={f.desc} set={sf("desc")} rows={5} req />
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all group">
                <Upload className="w-5 h-5 text-slate-300 mx-auto mb-1.5 group-hover:text-blue-400 transition-colors" />
                <p className="text-xs text-slate-500 font-medium">Upload PDF</p>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all group">
                <Image className="w-5 h-5 text-slate-300 mx-auto mb-1.5 group-hover:text-blue-400 transition-colors" />
                <p className="text-xs text-slate-500 font-medium">Upload Image</p>
              </div>
            </div>
            <Btn v="blue" sz="lg" full onClick={() => setDone(true)} disabled={!f.title || !f.cat}>
              <Send className="w-4 h-4" />Publish Notice
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notice Board</h1>
          <p className="text-slate-500 mt-1 text-sm">Important updates and guidelines from your college.</p>
        </div>
        {user.role === "co-admin" && (
          <Btn v="blue" sz="sm" onClick={() => { setCreate(true); setDone(false); }}>
            <Plus className="w-3.5 h-3.5" />Create Notice
          </Btn>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["", ...cats].map(c => (
          <button key={c || "all"} onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${cat === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}>
            {c || "All"}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-w-4xl">
        {filtered.map(n => (
          <div key={n.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all ${n.important ? "border-l-4 border-l-red-500 border-slate-100" : "border-slate-100"}`}>
            <div className="p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Chip label={n.category} className={NOTICECAT[n.category] ?? "bg-slate-50 text-slate-600 border-slate-200"} />
                  {n.important && <Chip label="Important" className="bg-red-50 text-red-600 border-red-200" />}
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 leading-snug">{n.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">{n.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Posted by <span className="font-semibold text-slate-600">{n.postedBy}</span></span>
                  <span>·</span>
                  <span>{n.date}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {n.attachment && <Btn sz="xs" v="outline"><Download className="w-3 h-3" />{n.attachment}</Btn>}
                <Btn sz="xs" v="ghost"><Eye className="w-3 h-3" />View</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Event Hub ────────────────────────────────────────────────────────────────
function EventHubPage({ user }: { user: AppUser }) {
  const [club, setClub] = useState<typeof CLUBS[0] | null>(null);
  const [regs, setRegs] = useState<number[]>([]);
  const [addEv, setAddEv] = useState(false);
  const [evDone, setEvDone] = useState(false);
  const [ef, setEf] = useState({ name: "", date: "", time: "", venue: "", desc: "" });
  const sef = (k: string) => (v: string) => setEf(p => ({ ...p, [k]: v }));
  const [delConfirm, setDelConfirm] = useState<number | null>(null);

  if (addEv && user.role === "co-admin") {
    if (evDone) return <WinCard title="Event Created!" message="Your event is live on the Event Hub. Students can now discover and register for it." cta={<Btn v="blue" sz="lg" full onClick={() => { setAddEv(false); setEvDone(false); }}>Back to Event Hub</Btn>} />;
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setAddEv(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-4 h-4" /></button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Add New Event</h1>
              <p className="text-sm text-slate-500">Create an event for your club</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <UpBox label="Upload event image" sub="PNG or JPG up to 5MB" />
            <Inp label="Event Name" ph="e.g., Annual Hackathon 2024" val={ef.name} set={sef("name")} req />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Date" type="date" val={ef.date} set={sef("date")} req />
              <Inp label="Time" type="time" val={ef.time} set={sef("time")} req />
            </div>
            <Inp label="Venue" ph="e.g., Seminar Hall" val={ef.venue} set={sef("venue")} req />
            <Txta label="Description" ph="Describe the event for students…" val={ef.desc} set={sef("desc")} />
            <Btn v="blue" sz="lg" full onClick={() => setEvDone(true)} disabled={!ef.name || !ef.date}>
              <Plus className="w-4 h-4" />Create Event
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  if (club) {
    const clubEvs = EVENTS.filter(e => e.clubId === club.id);
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Club banner */}
        <div className="rounded-2xl overflow-hidden mb-6 relative" style={{ height: 192 }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${club.color}cc, ${club.color})` }} />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <div className="flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-2xl font-extrabold shadow-lg">
                {club.name.slice(0, 1)}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold leading-tight">{club.name}</h2>
                <p className="text-white/70 text-sm">{club.members} members · Lead: {club.lead}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setClub(null)} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />All Clubs
          </button>
          {user.role === "co-admin" && <Btn v="blue" sz="sm" onClick={() => { setAddEv(true); setEvDone(false); }}><Plus className="w-3.5 h-3.5" />Add Event</Btn>}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1.5 text-sm">About {club.name}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{club.description}</p>
        </div>

        <h3 className="font-bold text-slate-900 mb-4 text-sm">Upcoming Events <span className="text-slate-400 font-normal">({clubEvs.length})</span></h3>
        {clubEvs.length === 0
          ? <Empty icon={Calendar} title="No upcoming events." sub={user.role === "co-admin" ? 'Click "Add Event" to create your first event.' : undefined} />
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clubEvs.map(ev => (
                <div key={ev.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <img src={ev.image} alt={ev.name} className="w-full h-40 object-cover bg-slate-100" />
                  <div className="p-4">
                    <h4 className="font-bold text-slate-900 mb-2 leading-snug">{ev.name}</h4>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500"><Calendar className="w-3.5 h-3.5" />{ev.date} · {ev.time}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" />{ev.venue}</div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{ev.description}</p>
                    <div className="flex gap-2">
                      {ev.open
                        ? <Btn sz="sm" v={regs.includes(ev.id) ? "violet" : "blue"} cls="flex-1"
                            onClick={() => setRegs(r => r.includes(ev.id) ? r.filter(i => i !== ev.id) : [...r, ev.id])}>
                            {regs.includes(ev.id) ? <><Check className="w-3.5 h-3.5" />Registered</> : "Register Now"}
                          </Btn>
                        : <span className="flex-1 text-center text-xs text-slate-400 py-2">Registration Closed</span>}
                      {user.role === "co-admin" && <>
                        <Btn sz="sm" v="ghost"><Pencil className="w-3.5 h-3.5" /></Btn>
                        <Btn sz="sm" v="ghost" cls="!text-red-400 hover:!bg-red-50" onClick={() => setDelConfirm(ev.id)}><Trash2 className="w-3.5 h-3.5" /></Btn>
                      </>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Delete confirm */}
        {delConfirm !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
              <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Event?</h3>
              <p className="text-slate-500 text-center text-sm mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Btn v="ghost" cls="flex-1" onClick={() => setDelConfirm(null)}>Cancel</Btn>
                <Btn v="red" cls="flex-1" onClick={() => setDelConfirm(null)}>Delete Event</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Event Hub</h1>
        <p className="text-slate-500 mt-1 text-sm">Discover what's happening around campus.</p>
      </div>

      {/* Upcoming events strip */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Upcoming Events</h2>
          <span className="text-xs text-slate-400">{EVENTS.filter(e => e.open).length} registration open</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENTS.slice(0, 3).map(ev => {
            const cl = CLUBS.find(c => c.id === ev.clubId);
            return (
              <div key={ev.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <img src={ev.image} alt={ev.name} className="w-full h-36 object-cover bg-slate-100" />
                <div className="p-4">
                  {cl && <span className="text-xs font-semibold mb-1.5 block" style={{ color: cl.color }}>{cl.name}</span>}
                  <h4 className="font-bold text-slate-900 text-sm mb-2 leading-snug">{ev.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3"><Calendar className="w-3.5 h-3.5" />{ev.date} · {ev.venue}</div>
                  <Btn v={ev.open ? "blue" : "ghost"} sz="sm" disabled={!ev.open} cls="w-full">
                    {ev.open ? "Register Now" : "Registration Closed"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Clubs grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Clubs & Organizations</h2>
          <span className="text-xs text-slate-400">{CLUBS.length} clubs active</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLUBS.map(cl => (
            <div key={cl.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0 shadow-sm" style={{ backgroundColor: cl.color }}>
                  {cl.name.slice(0, 1)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-none">{cl.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{cl.members} members</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{cl.shortDesc}</p>
              <Btn v="outline" sz="sm" cls="w-full group-hover:border-blue-400" onClick={() => setClub(cl)}>View Club →</Btn>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Marketplace ──────────────────────────────────────────────────────────────
function MarketplacePage() {
  const [sell, setSell] = useState(false);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("recent");
  const [done, setDone] = useState(false);
  const [contact, setContact] = useState<typeof PRODUCTS[0] | null>(null);
  const [f, setF] = useState({ name: "", cat: "", price: "", cond: "", desc: "", loc: "" });
  const sf = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));

  const cats = [...new Set(PRODUCTS.map(p => p.category))];
  const items = PRODUCTS
    .filter(p => (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase())) && (!cat || p.category === cat))
    .sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : b.id - a.id);

  if (sell) {
    if (done) return (
      <WinCard title="Listing Published!" message="Your item is now live on the Campus Marketplace. Interested buyers can contact you directly." cta={
        <div className="flex gap-3 justify-center">
          <Btn v="outline" sz="md" onClick={() => { setDone(false); setF({ name: "", cat: "", price: "", cond: "", desc: "", loc: "" }); }}>Sell Another</Btn>
          <Btn v="blue" sz="md" onClick={() => setSell(false)}>Browse Marketplace</Btn>
        </div>
      } />
    );
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSell(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Create a Listing</h1>
            <p className="text-sm text-slate-500">List an item for campus students to buy</p>
          </div>
        </div>
        <div className="max-w-lg bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <UpBox label="Upload product images (up to 4)" sub="PNG, JPG up to 5MB each" />
          <Inp label="Product Name" ph="e.g., Engineering Maths Vol. 1 & 2" val={f.name} set={sf("name")} req />
          <div className="grid grid-cols-2 gap-3">
            <Sel label="Category" val={f.cat} set={sf("cat")} opts={["Books", "Calculators", "Electronics", "Lab Equipment", "Stationery", "Cycles", "Other"]} req />
            <Sel label="Condition" val={f.cond} set={sf("cond")} opts={["Like New", "Good", "Fair", "Used"]} req />
          </div>
          <Inp label="Asking Price (₹)" type="number" ph="e.g., 350" val={f.price} set={sf("price")} req />
          <Txta label="Description" ph="Describe the item — condition details, why selling, anything important…" val={f.desc} set={sf("desc")} />
          <Inp label="Pickup / Meeting Location" ph="e.g., Near Central Library" val={f.loc} set={sf("loc")} req />
          <Btn v="blue" sz="lg" full onClick={() => setDone(true)} disabled={!f.name || !f.price}>Publish Listing</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Campus Marketplace</h1>
          <p className="text-slate-500 mt-1 text-sm">Buy, sell and exchange useful items within your campus.</p>
        </div>
        <Btn v="blue" sz="sm" onClick={() => { setSell(true); setDone(false); }}><Plus className="w-3.5 h-3.5" />Sell an Item</Btn>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or sellers…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Categories</option>
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="recent">Recent First</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>

      {items.length === 0
        ? <Empty icon={ShoppingBag} title="No items found." sub="Try adjusting your search or category filter." />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="h-40 flex items-center justify-center relative" style={{ backgroundColor: p.color }}>
                  <ShoppingBag className="w-12 h-12 text-white/40" />
                  <div className="absolute top-3 right-3">
                    <Chip label={p.condition} className={COND[p.condition] ?? "bg-slate-50 text-slate-600 border-slate-200"} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">{p.name}</h3>
                  <div className="text-2xl font-extrabold text-blue-600 mb-2">₹{p.price}</div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{p.description}</p>
                  <div className="space-y-1 mb-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 flex-shrink-0" />{p.seller}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 flex-shrink-0" />{p.location}</div>
                  </div>
                  <Btn v="blue" sz="sm" cls="w-full" onClick={() => setContact(p)}>
                    <Phone className="w-3.5 h-3.5" />Contact Seller
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Contact modal */}
      {contact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setContact(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900">Contact Seller</h3>
              <button onClick={() => setContact(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
              <p className="font-semibold text-slate-800 text-sm leading-snug">{contact.name}</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">₹{contact.price}</p>
              <Chip label={contact.condition} className={`mt-2 ${COND[contact.condition] ?? "bg-slate-50 text-slate-600 border-slate-200"}`} />
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Av name={contact.seller} size="sm" />
                <div>
                  <p className="font-semibold text-sm text-slate-800">{contact.seller}</p>
                  <p className="text-xs text-slate-400">Campus Marketplace Seller</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                Pickup: <span className="font-medium">{contact.location}</span>
              </div>
            </div>
            <Btn v="blue" sz="lg" full onClick={() => setContact(null)}><Mail className="w-4 h-4" />Send Message</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Co-Admin Dashboard ───────────────────────────────────────────────────────
function CoAdminDashboard({ user, setView }: { user: AppUser; setView: (v: View) => void }) {
  const stats = [
    { label: "My Club", val: user.club || "Coding Club", ibg: "bg-blue-100", ic: "text-blue-600", Icon: Building2 },
    { label: "Published Notices", val: "4", ibg: "bg-violet-100", ic: "text-violet-600", Icon: Megaphone },
    { label: "Upcoming Events", val: "2", ibg: "bg-emerald-100", ic: "text-emerald-600", Icon: Calendar },
    { label: "Total Registrations", val: "87", ibg: "bg-amber-100", ic: "text-amber-700", Icon: Users },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Mini hero */}
      <div className="bg-gradient-to-br from-violet-600 to-blue-700 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="relative z-10">
          <p className="text-violet-200 text-sm font-medium mb-1">Co-Admin Dashboard</p>
          <h1 className="text-2xl font-extrabold">Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-violet-100 text-sm mt-1">Manage your club notices, events, and content.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map(({ label, val, ibg, ic, Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${ibg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${ic}`} />
            </div>
            <div className="text-xl font-extrabold text-slate-900 leading-none">{val}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: "Create Notice", sub: "Publish a notice for all students", ibg: "bg-violet-100", ic: "text-violet-600", Icon: Plus, target: "notice-board" as View },
          { label: "Manage Events", sub: "Add, edit, or remove club events", ibg: "bg-emerald-100", ic: "text-emerald-600", Icon: Calendar, target: "event-hub" as View },
        ].map(({ label, sub, ibg, ic, Icon, target }) => (
          <button key={label} onClick={() => setView(target)}
            className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className={`w-12 h-12 rounded-xl ${ibg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${ic}`} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-900">{label}</div>
              <div className="text-sm text-slate-500">{sub}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Recent Notices</h3>
          <button onClick={() => setView("notice-board")} className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">View All →</button>
        </div>
        <div className="divide-y divide-slate-50">
          {NOTICES.slice(0, 4).map(n => (
            <div key={n.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.date} · <span className="text-slate-500">{n.category}</span></p>
              </div>
              <div className="flex gap-1 ml-3">
                <Btn sz="xs" v="ghost"><Pencil className="w-3 h-3" /></Btn>
                <Btn sz="xs" v="ghost" cls="!text-red-400 hover:!bg-red-50"><Trash2 className="w-3 h-3" /></Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const [delName, setDelName] = useState<string | null>(null);

  const stats = [
    { label: "Total Students", val: "1,248", change: "+12 this week", ibg: "bg-blue-100", ic: "text-blue-600", cc: "text-blue-600", Icon: Users },
    { label: "Co-Admins", val: "18", change: "+2 this month", ibg: "bg-violet-100", ic: "text-violet-600", cc: "text-violet-600", Icon: Briefcase },
    { label: "Notices", val: "34", change: "6 this week", ibg: "bg-amber-100", ic: "text-amber-600", cc: "text-amber-600", Icon: Megaphone },
    { label: "Events", val: "12", change: "3 upcoming", ibg: "bg-emerald-100", ic: "text-emerald-600", cc: "text-emerald-600", Icon: Calendar },
    { label: "Lost Reports", val: "47", change: "8 resolved", ibg: "bg-cyan-100", ic: "text-cyan-600", cc: "text-cyan-600", Icon: Package },
    { label: "Listings", val: "91", change: "15 new today", ibg: "bg-rose-100", ic: "text-rose-600", cc: "text-rose-600", Icon: ShoppingBag },
  ];

  const students = [
    { id: 1, name: "Arjun Mehta", branch: "CSE", year: "3rd Year", email: "arjun@college.edu" },
    { id: 2, name: "Priya Nair", branch: "ECE", year: "2nd Year", email: "priya@college.edu" },
    { id: 3, name: "Rahul Sharma", branch: "Mechanical", year: "4th Year", email: "rahul@college.edu" },
    { id: 4, name: "Sneha Kumar", branch: "IT", year: "1st Year", email: "sneha@college.edu" },
    { id: 5, name: "Vivek Reddy", branch: "Civil", year: "3rd Year", email: "vivek@college.edu" },
  ];

  const manage = [
    { label: "Manage Co-Admins", Icon: Briefcase, count: "18 active" },
    { label: "Manage Notices", Icon: Megaphone, count: "34 published" },
    { label: "Manage Events", Icon: Calendar, count: "12 events" },
    { label: "Manage Marketplace", Icon: ShoppingBag, count: "91 listings" },
    { label: "Manage Lost & Found", Icon: Package, count: "47 reports" },
    { label: "Platform Analytics", Icon: BarChart3, count: "View reports" },
    { label: "System Settings", Icon: Settings, count: "Configure" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Admin hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 mb-7 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">System Administrator</p>
            <h1 className="text-xl font-extrabold">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">Full platform oversight and management.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, val, change, ibg, ic, cc, Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${ibg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${ic}`} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 leading-none">{val}</div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
            <div className={`text-xs mt-1.5 font-semibold ${cc}`}>{change}</div>
          </div>
        ))}
      </div>

      {/* Students table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Manage Students</h3>
          <Btn v="outline" sz="xs"><Plus className="w-3 h-3" />Add Student</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="bg-slate-50">
                {["Name", "Branch", "Year", "Email", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(st => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Av name={st.name} size="sm" />
                      <span className="text-sm font-semibold text-slate-800">{st.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{st.branch}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{st.year}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{st.email}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <Btn sz="xs" v="ghost"><Pencil className="w-3 h-3" /></Btn>
                      <Btn sz="xs" v="ghost" cls="!text-red-400 hover:!bg-red-50" onClick={() => setDelName(st.name)}><Trash2 className="w-3 h-3" /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick manage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {manage.map(({ label, Icon, count }) => (
          <button key={label} className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
              <Icon className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400">{count}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>

      {/* Delete confirm */}
      {delName && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Student?</h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              Are you sure you want to remove <span className="font-bold text-slate-800">{delName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Btn v="ghost" cls="flex-1" onClick={() => setDelName(null)}>Cancel</Btn>
              <Btn v="red" cls="flex-1" onClick={() => setDelName(null)}>Delete</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function NotificationsPage() {
  const [items, setItems] = useState(NOTIFS);
  const markAll = () => setItems(n => n.map(i => ({ ...i, read: true })));
  const icons: Record<string, typeof Bell> = { notice: Megaphone, event: Calendar, lost: Package, marketplace: ShoppingBag, general: Bell };
  const colors: Record<string, string> = { notice: "bg-violet-100 text-violet-600", event: "bg-emerald-100 text-emerald-600", lost: "bg-blue-100 text-blue-600", marketplace: "bg-amber-100 text-amber-700", general: "bg-slate-100 text-slate-500" };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1 text-sm">{items.filter(n => !n.read).length} unread</p>
        </div>
        <Btn v="ghost" sz="sm" onClick={markAll}><Check className="w-3.5 h-3.5" />Mark all read</Btn>
      </div>

      <div className="space-y-2 max-w-2xl">
        {items.map(n => {
          const Icon = icons[n.type] ?? Bell;
          return (
            <div key={n.id} onClick={() => setItems(p => p.map(i => i.id === n.id ? { ...i, read: true } : i))}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${n.read ? "bg-white border-slate-100 hover:bg-slate-50" : "bg-blue-50/60 border-blue-200 hover:bg-blue-50"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[n.type] ?? "bg-slate-100 text-slate-500"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${n.read ? "text-slate-600" : "text-slate-900 font-semibold"}`}>{n.text}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Staff Dashboard ──────────────────────────────────────────────────────────
function StaffDashboard({ user }: { user: AppUser }) {
  const [tab, setTab] = useState<"report" | "history">("report");
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    name: "",
    cat: "Accessories",
    loc: "",
    date: new Date().toISOString().split("T")[0],
    desc: "",
    status: "Handed over to Security Desk (Main Gate)",
  });
  const [staffReports, setStaffReports] = useState([
    {
      id: 7,
      name: "Single Wireless Earbud",
      category: "Electronics",
      location: "Main Building Courtyard",
      date: "Jan 22, 2024",
      description: "A single white wireless earbud found near the main building courtyard. Handed over to main gate security desk.",
      reporter: user.name || "MHSSCE Staff",
      status: "At Security Desk",
    },
    {
      id: 101,
      name: "Student ID Card (CSE Batch)",
      category: "Personal Items",
      location: "Central Library Entrance",
      date: "Jan 20, 2024",
      description: "Student identity card found on the table near the library reading section.",
      reporter: user.name || "MHSSCE Staff",
      status: "At Security Desk",
    },
    {
      id: 102,
      name: "Set of 3 Keys with Red Keychain",
      category: "Accessories",
      location: "Workshop Corridor",
      date: "Jan 18, 2024",
      description: "Three metallic cabinet/locker keys with a red keychain.",
      reporter: user.name || "MHSSCE Staff",
      status: "Claimed by Student",
    },
  ]);

  const sf = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));

  const handleReportSubmit = () => {
    if (!f.name || !f.loc) return;
    const newReport = {
      id: Date.now(),
      name: f.name,
      category: f.cat,
      location: f.loc,
      date: f.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: f.desc || "Item reported by staff to campus lost & found registry.",
      reporter: user.name || "MHSSCE Staff",
      status: f.status || "At Security Desk",
    };
    setStaffReports(prev => [newReport, ...prev]);
    setDone(true);
  };

  const upcomingFeatures = [
    {
      title: "Campus Maintenance Helpdesk",
      desc: "Log facility repairs, electrical, plumbing, and cleaning requests directly.",
      badge: "In Development",
      icon: Sparkles,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
    },
    {
      title: "Duty & Shift Rosters",
      desc: "Check exam duty allocations, floor supervision rosters, and campus schedules.",
      badge: "Coming Soon",
      icon: Clock,
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400",
    },
    {
      title: "Facility & Hall Reservation",
      desc: "Request and track reservations for seminar halls, auditoriums, and labs.",
      badge: "Coming Soon",
      icon: Building2,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Staff Official Notices",
      desc: "Internal staff circulars, administrative memos, and department updates.",
      badge: "Planned",
      icon: Megaphone,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
      {/* Staff Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0d1c38] to-[#142347] rounded-3xl p-6 lg:p-8 border border-white/10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wide uppercase">
              <Shield className="w-3.5 h-3.5" /> Staff Portal
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Use the official staff desk to report lost and found items on campus. Reported items are immediately updated in the campus network.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Designation / Role</p>
              <p className="text-sm font-bold text-white">{user.title || "Campus Staff"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent 'More features coming soon' Message Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 p-6 lg:p-7 relative overflow-hidden backdrop-blur-xl shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-slate-950">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg lg:text-xl font-black text-white">More features coming soon</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-400 text-slate-950 animate-pulse">
                Under Development
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              We are actively developing dedicated staff capabilities for Campus Connect. In this release, your account is configured for reporting found and lost campus items. Additional staff utilities will be unlocked soon!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
              {upcomingFeatures.map(({ title, desc, badge, icon: Icon, color }) => (
                <div key={title} className={`rounded-2xl border bg-slate-900/60 p-3.5 flex flex-col justify-between ${color}`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-4 h-4 text-cyan-300" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-200">
                        {badge}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white leading-snug">{title}</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Item Desk Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Report Item Desk</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Submit newly found items to the campus registry or review your reported history.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-200/60 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 w-fit">
            <button
              type="button"
              onClick={() => { setTab("report"); setDone(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === "report" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <Plus className="w-3.5 h-3.5" /> Report New Item
            </button>
            <button
              type="button"
              onClick={() => setTab("history")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === "history" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <Clock className="w-3.5 h-3.5" /> My Reported Items ({staffReports.length})
            </button>
          </div>
        </div>

        {tab === "report" ? (
          done ? (
            <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-white/10 p-8 lg:p-12 text-center max-w-xl mx-auto shadow-sm backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Item Reported Successfully!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                The item has been recorded in the Lost & Found database under your staff account. Campus students and administrators can view this report to claim the item.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Btn
                  v="blue"
                  sz="md"
                  onClick={() => {
                    setDone(false);
                    setF({
                      name: "",
                      cat: "Accessories",
                      loc: "",
                      date: new Date().toISOString().split("T")[0],
                      desc: "",
                      status: "Handed over to Security Desk (Main Gate)",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" /> Report Another Item
                </Btn>
                <Btn v="outline" sz="md" onClick={() => setTab("history")}>
                  View All Reported Items
                </Btn>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-white/10 p-6 lg:p-7 shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-500">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Item Information Form</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Fill in the details of the item found on campus</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Inp
                    label="Item Name / Title"
                    ph="e.g., Black Leather Wallet / Casio Calculator / Keys"
                    val={f.name}
                    set={sf("name")}
                    req
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Sel
                      label="Category"
                      val={f.cat}
                      set={sf("cat")}
                      opts={["Accessories", "Electronics", "Personal Items", "Stationery", "Books", "Clothing", "ID & Documents", "Other"]}
                      req
                    />
                    <Inp
                      label="Date Found"
                      type="date"
                      val={f.date}
                      set={sf("date")}
                      req
                    />
                  </div>

                  <Inp
                    label="Location Found / Collected"
                    ph="e.g., Main Building Courtyard / Lab 301 / Canteen Desk"
                    val={f.loc}
                    set={sf("loc")}
                    req
                  />

                  <Sel
                    label="Current Holding Location / Status"
                    val={f.status}
                    set={sf("status")}
                    opts={[
                      "Handed over to Security Desk (Main Gate)",
                      "Kept at Staff Room / Lab",
                      "At Central Library Counter",
                      "At Dean / Admin Office",
                    ]}
                    req
                  />

                  <Txta
                    label="Item Description & Distinguishing Marks"
                    ph="Describe color, brand, condition, tags, or any identifiable marks…"
                    val={f.desc}
                    set={sf("desc")}
                    rows={3}
                  />

                  <UpBox label="Attach Item Photo (Optional)" sub="PNG or JPG up to 5MB" />

                  <Btn
                    v="blue"
                    sz="lg"
                    full
                    onClick={handleReportSubmit}
                    disabled={!f.name || !f.loc}
                  >
                    <Send className="w-4 h-4" /> Submit Item Report
                  </Btn>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-white/10 p-6 shadow-sm backdrop-blur-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Staff Reporting Instructions</h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span>Always mention the exact location where the item was found.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span>Valuable items (wallets, calculators, phones) must be deposited with Main Gate Security.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span>Students will reach out to security or staff with verification before reclaiming.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-3xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-6 h-6 text-cyan-300" />
                    <h4 className="font-extrabold text-base">Quick Summary</h4>
                  </div>
                  <p className="text-xs text-blue-100 mb-4">Staff Lost & Found desk stats</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                      <div className="text-2xl font-black">{staffReports.length}</div>
                      <div className="text-[11px] text-blue-100">Total Items Logged</div>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                      <div className="text-2xl font-black text-emerald-300">
                        {staffReports.filter(i => i.status.includes("Security") || i.status.includes("Desk")).length}
                      </div>
                      <div className="text-[11px] text-blue-100">At Security Desk</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-white/10 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Reported Items History</h3>
              <Btn sz="sm" v="blue" onClick={() => { setTab("report"); setDone(false); }}>
                <Plus className="w-3.5 h-3.5" /> Report Another Item
              </Btn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffReports.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] overflow-hidden p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Chip label={item.category} className={ITEMCAT[item.category] ?? "bg-blue-50 text-blue-600 border-blue-200"} />
                      <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {item.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfilePage({ user }: { user: AppUser }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">My Profile</h1>
      <div className="max-w-lg space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-br from-blue-600 to-violet-700 h-24 relative">
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              <div className="ring-4 ring-white rounded-full">
                <Av name={user.name} size="lg" />
              </div>
            </div>
          </div>
          <div className="pt-10 pb-5 px-6">
            <h2 className="text-xl font-bold text-slate-900 leading-none">{user.name}</h2>
            <p className="text-sm text-slate-500 capitalize mt-1">
              {user.role === "co-admin" ? "Co-Admin" : user.role === "staff" ? "Staff Member" : user.role}
            </p>
            <p className="text-sm text-slate-400">{user.email || user.mobile}</p>
            {(user.year || user.branch || user.club || user.title || user.mobile) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.title && <Chip label={user.title} className="bg-emerald-50 text-emerald-600 border-emerald-200" />}
                {user.mobile && <Chip label={`📱 ${user.mobile}`} className="bg-cyan-50 text-cyan-600 border-cyan-200" />}
                {user.year && <Chip label={user.year} className="bg-blue-50 text-blue-600 border-blue-200" />}
                {user.branch && <Chip label={user.branch} className="bg-violet-50 text-violet-600 border-violet-200" />}
                {user.club && <Chip label={user.club} className="bg-amber-50 text-amber-600 border-amber-200" />}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Activity Summary</h3>
          <div className="grid grid-cols-3 gap-3">
            {user.role === "staff" ? (
              <>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold text-blue-600">3</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">Items Logged</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold text-emerald-600">2</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">Security Handed</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold text-violet-600">1</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">Claimed</div>
                </div>
              </>
            ) : (
              [{ v: "3", l: "Items Listed" }, { v: "1", l: "Items Reported" }, { v: "5", l: "Events Joined" }].map(({ v, l }) => (
                <div key={l} className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold text-blue-600">{v}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">{l}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <Btn v="outline" sz="md" full><Pencil className="w-4 h-4" />Edit Profile</Btn>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [view, setView] = useState<View>("login");
  const [sidebar, setSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const login = (u: AppUser) => {
    setUser(u);
    setView(
      u.role === "admin"
        ? "admin-dashboard"
        : u.role === "student"
        ? "student-dashboard"
        : u.role === "staff"
        ? "staff-dashboard"
        : "co-admin-dashboard"
    );
    setIsEntering(true);
    window.setTimeout(() => setIsEntering(false), 700);
  };

  const logout = () => { clearToken(); setUser(null); setView("login"); setSidebar(false); setIsEntering(false); };

  const studentNav: { id: View; label: string; Icon: typeof Home }[] = [
    { id: "student-dashboard", label: "Dashboard", Icon: Home },
    { id: "lost-found", label: "Lost & Found", Icon: Package },
    { id: "notice-board", label: "Notice Board", Icon: Megaphone },
    { id: "event-hub", label: "Event Hub", Icon: Calendar },
    { id: "marketplace", label: "Marketplace", Icon: ShoppingBag },
    { id: "notifications", label: "Notifications", Icon: Bell },
    { id: "profile", label: "Profile", Icon: User },
  ];
  const coAdminNav: typeof studentNav = [
    { id: "co-admin-dashboard", label: "Dashboard", Icon: Home },
    { id: "notice-board", label: "Notice Board", Icon: Megaphone },
    { id: "event-hub", label: "Event Hub", Icon: Calendar },
    { id: "notifications", label: "Notifications", Icon: Bell },
    { id: "profile", label: "Profile", Icon: User },
  ];
  const staffNav: typeof studentNav = [
    { id: "staff-dashboard", label: "Report Item", Icon: Package },
    { id: "notifications", label: "Notifications", Icon: Bell },
    { id: "profile", label: "Profile", Icon: User },
  ];
  const adminNav: typeof studentNav = [
    { id: "admin-dashboard", label: "Admin Panel", Icon: Shield },
    { id: "notifications", label: "Notifications", Icon: Bell },
    { id: "profile", label: "Profile", Icon: User },
  ];

  if (!user) {
    if (view === "signup-student") return <SignupPage role="student" back={() => setView("login")} />;
    if (view === "signup-coadmin") return <SignupPage role="co-admin" back={() => setView("login")} />;
    if (view === "signup-staff") return <SignupPage role="staff" back={() => setView("login")} />;
    return <LoginPage onLogin={login} gotoSignup={r => setView(r === "student" ? "signup-student" : r === "co-admin" ? "signup-coadmin" : "signup-staff")} />;
  }

  const nav =
    user.role === "admin"
      ? adminNav
      : user.role === "staff"
      ? staffNav
      : user.role === "co-admin"
      ? coAdminNav
      : studentNav;

  const page = () => {
    if (user.role === "staff" && view !== "notifications" && view !== "profile") {
      return <StaffDashboard user={user} />;
    }
    switch (view) {
      case "student-dashboard": return <StudentDashboard user={user} setView={setView} />;
      case "lost-found": return <LostFoundPage />;
      case "notice-board": return <NoticeBoardPage user={user} />;
      case "event-hub": return <EventHubPage user={user} />;
      case "marketplace": return <MarketplacePage />;
      case "co-admin-dashboard": return <CoAdminDashboard user={user} setView={setView} />;
      case "admin-dashboard": return <AdminDashboard />;
      case "staff-dashboard": return <StaffDashboard user={user} />;
      case "notifications": return <NotificationsPage />;
      case "profile": return <ProfilePage user={user} />;
      default: return user.role === "staff" ? <StaffDashboard user={user} /> : <StudentDashboard user={user} setView={setView} />;
    }
  };

  return (
    <div className={`cc-app ${dark ? "cc-dark dark" : "cc-light"} flex h-screen overflow-hidden font-sans transition-colors duration-500 ${isEntering ? "opacity-0 scale-[0.985]" : "opacity-100 scale-100"}`}>
      <style>{`
        .cc-app { background: #f8fafc; color: #0f172a; }
        .cc-app.cc-dark { background: #070b17; color: #e2e8f0; }
        .cc-app.cc-dark .bg-slate-50 { background-color: #0f172a !important; }
        .cc-app.cc-dark .bg-slate-100 { background-color: #111827 !important; }
        .cc-app.cc-dark .bg-white { background-color: rgba(15, 23, 42, .82) !important; }
        .cc-app.cc-dark .border-slate-100, .cc-app.cc-dark .border-slate-200 { border-color: rgba(255,255,255,.10) !important; }
        .cc-app.cc-dark .text-slate-900, .cc-app.cc-dark .text-slate-800 { color: #f8fafc !important; }
        .cc-app.cc-dark .text-slate-700 { color: #e2e8f0 !important; }
        .cc-app.cc-dark .text-slate-600 { color: #cbd5e1 !important; }
        .cc-app.cc-dark .text-slate-500, .cc-app.cc-dark .text-slate-400 { color: #94a3b8 !important; }
        .cc-app.cc-dark .text-slate-300 { color: #cbd5e1 !important; }
        .cc-app.cc-dark .hover\\:bg-slate-100:hover { background-color: rgba(255,255,255,.08) !important; }
        .cc-app.cc-dark .hover\\:bg-blue-50:hover { background-color: rgba(34,211,238,.08) !important; }
        .cc-app.cc-dark input, .cc-app.cc-dark select, .cc-app.cc-dark textarea { color-scheme: dark; }
        .cc-app button, .cc-app input, .cc-app select, .cc-app textarea { transition-property: color, background-color, border-color, box-shadow, transform, opacity; transition-duration: 200ms; }
      `}</style>
      <Sidebar user={user} active={view} nav={nav} setView={setView} onLogout={logout} open={sidebar} setOpen={setSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} onMenu={() => setSidebar(true)} search={search} onSearch={setSearch} onBell={() => setView("notifications")} dark={dark} onToggleTheme={() => setDark(v => !v)} />
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 transition-colors duration-500">
          {page()}
        </div>
      </div>
      {isEntering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b17]/95 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5 animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 rotate-3">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-center"><p className="text-white font-black tracking-tight">Entering Campus Connect</p><p className="text-slate-400 text-xs mt-1">Preparing your campus space…</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
