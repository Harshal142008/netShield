import { AlertCircle, CheckCircle2, Construction, LoaderCircle } from 'lucide-react'
export const LoadingSpinner = () => <div className="state"><LoaderCircle className="spin" /> Loading securely…</div>
export const ErrorMessage = ({ message }: { message: string }) => <p className="notice error"><AlertCircle size={17}/>{message}</p>
export const SuccessNotification = ({ message }: { message: string }) => <p className="notice success"><CheckCircle2 size={17}/>{message}</p>
export const EmptyState = ({ message = 'Nothing to show yet.' }: { message?: string }) => <div className="state">{message}</div>
export function ComingSoon({ title = 'Coming soon', description = 'This part of NetShield is planned for a future phase.' }: { title?: string; description?: string }) { return <section className="coming"><Construction size={30}/><h2>{title}</h2><p>{description}</p></section> }
