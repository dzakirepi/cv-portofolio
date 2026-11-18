
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/public/Home'
import About from './pages/public/About'
import Projects from './pages/public/Projects'
import Experience from './pages/public/Experience'
import Education from './pages/public/Education'
import Blog from './pages/public/Blog'
import Contact from './pages/public/Contact'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminProjects from './pages/admin/Projects'
import AdminProfile from './pages/admin/Profile'
import AdminSkills from './pages/admin/Skills'
import AdminExperience from './pages/admin/Experience'
import AdminEducation from './pages/admin/Education'
import AdminCertificates from './pages/admin/Certificates'
import AdminArticles from './pages/admin/Articles'
import AdminMessages from './pages/admin/Messages'
import AdminSettings from './pages/admin/Settings'

import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/education" element={<Education />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
