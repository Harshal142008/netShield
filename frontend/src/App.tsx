import { Route, Routes, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { AppLayout } from './layouts/AppLayout'
import { Landing } from './pages/Landing'
import { Login, Signup } from './pages/Auth'
import { About, ChecklistPage, Dashboard, FuturePage, InternetPage, ScorePage, Settings, WebsitePage, WifiPage } from './pages/AppPages'
import { ChecklistPage as SyncedChecklistPage } from './pages/ChecklistPage'
export default function App(){const {theme,toggleTheme}=useTheme();return <Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route element={<AppLayout theme={theme} toggleTheme={toggleTheme}/>}>{['/dashboard','/wifi','/internet','/website','/score','/checklist','/education','/about','/settings'].map(path=><Route key={path} path={path} element={path==='/dashboard'?<Dashboard/>:path==='/wifi'?<WifiPage/>:path==='/internet'?<InternetPage/>:path==='/website'?<WebsitePage/>:path==='/score'?<ScorePage/>:path==='/checklist'?<SyncedChecklistPage/>:path==='/about'?<About/>:path==='/settings'?<Settings/>:<FuturePage/>}/>)}</Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
