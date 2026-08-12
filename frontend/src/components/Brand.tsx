import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
export function Brand() { return <Link to="/" className="brand"><span className="brand-icon"><ShieldCheck size={21}/></span><span>NetShield<small>Security Analyzer</small></span></Link> }
