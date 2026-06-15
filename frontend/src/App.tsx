import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'
import Chatbot from './components/Chatbot'
import OfflineBanner from './components/OfflineBanner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MaterialsPage from './pages/Materials'
import AboutPage from './pages/About'
import ContactPage from './pages/Contact'

import AdminLayout from './admin/components/AdminLayout'
import LoginPage from './admin/pages/LoginPage'
import DashboardHome from './admin/pages/DashboardHome'
import HeroEditor from './admin/pages/HeroEditor'
import AboutEditor from './admin/pages/AboutEditor'
import StatsEditor from './admin/pages/StatsEditor'
import MaterialsEditor from './admin/pages/MaterialsEditor'
import TestimonialsEditor from './admin/pages/TestimonialsEditor'
import ContactInfoEditor from './admin/pages/ContactInfoEditor'
import InboxPage from './admin/pages/InboxPage'
import SettingsEditor from './admin/pages/SettingsEditor'
import BrandingEditor from './admin/pages/BrandingEditor'
import BannersEditor from './admin/pages/BannersEditor'
import AboutBulletsEditor from './admin/pages/AboutBulletsEditor'
import BlogPage from './pages/Blog'
import BlogPostPage from './pages/BlogPost'
import BlogEditor from './admin/pages/BlogEditor'
import FAQEditor from './admin/pages/FAQEditor'

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#0d1424', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <OfflineBanner />
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/about"     element={<><Navbar /><AboutPage /><Footer /></>} />
        <Route path="/materials" element={<><Navbar /><MaterialsPage /><Footer /></>} />
        <Route path="/contact"   element={<><Navbar /><ContactPage /><Footer /></>} />
        <Route path="/blog"      element={<><Navbar /><BlogPage /><Footer /></>} />
        <Route path="/blog/:slug" element={<><Navbar /><BlogPostPage /><Footer /></>} />

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index              element={<DashboardHome />} />
          <Route path="branding"    element={<BrandingEditor />} />
          <Route path="hero"        element={<HeroEditor />} />
          <Route path="banners"     element={<BannersEditor />} />
          <Route path="about"           element={<AboutEditor />} />
          <Route path="about-bullets"   element={<AboutBulletsEditor />} />
          <Route path="stats"       element={<StatsEditor />} />
          <Route path="materials"   element={<MaterialsEditor />} />
          <Route path="testimonials"element={<TestimonialsEditor />} />
          <Route path="contact-info"element={<ContactInfoEditor />} />
          <Route path="inbox"       element={<InboxPage />} />
          <Route path="settings"    element={<SettingsEditor />} />
          <Route path="blog"        element={<BlogEditor />} />
          <Route path="faq"         element={<FAQEditor />} />
        </Route>
      </Routes>
      <Chatbot />
    </>
  )
}
