import { Route, Routes, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { AppLayout } from './layouts/AppLayout'
import { Landing } from './pages/Landing'
import { Login, Signup } from './pages/Auth'
import { About, Dashboard, FuturePage, Settings } from './pages/AppPages'
export default function App(){const {theme,toggleTheme}=useTheme();return <Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route element={<AppLayout theme={theme} toggleTheme={toggleTheme}/>}>{['/dashboard','/wifi','/internet','/website','/checklist','/education','/about','/settings'].map(path=><Route key={path} path={path} element={path==='/dashboard'?<Dashboard/>:path==='/about'?<About/>:path==='/settings'?<Settings/>:<FuturePage/>}/>)}</Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
