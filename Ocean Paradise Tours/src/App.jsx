
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import ToursPage from './pages/ToursPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import DashboardPage from './admin/DashboardPage.jsx'
import ToursManagerPage from './admin/ToursManagerPage.jsx'
import GalleryManagerPage from './admin/GalleryManagerPage.jsx'
import BookingsManagerPage from './admin/BookingsManagerPage.jsx'
import TestimonialsManagerPage from './admin/TestimonialsManagerPage.jsx'
import FaqManagerPage from './admin/FaqManagerPage.jsx'
import ContentManagerPage from './admin/ContentManagerPage.jsx'
import SettingsPage from './admin/SettingsPage.jsx'

const transition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={transition}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/tours" element={<AnimatedPage><ToursPage /></AnimatedPage>} />
          <Route path="/gallery" element={<AnimatedPage><GalleryPage /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
          <Route path="/booking" element={<AnimatedPage><BookingPage /></AnimatedPage>} />
          <Route path="/admin/login" element={<AnimatedPage><AdminLoginPage /></AnimatedPage>} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
          <Route path="tours" element={<AnimatedPage><ToursManagerPage /></AnimatedPage>} />
          <Route path="gallery" element={<AnimatedPage><GalleryManagerPage /></AnimatedPage>} />
          <Route path="bookings" element={<AnimatedPage><BookingsManagerPage /></AnimatedPage>} />
          <Route path="testimonials" element={<AnimatedPage><TestimonialsManagerPage /></AnimatedPage>} />
          <Route path="faq" element={<AnimatedPage><FaqManagerPage /></AnimatedPage>} />
          <Route path="content" element={<AnimatedPage><ContentManagerPage /></AnimatedPage>} />
          <Route path="settings" element={<AnimatedPage><SettingsPage /></AnimatedPage>} />
          
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
