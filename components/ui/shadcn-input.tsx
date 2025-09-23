export function Input({ className, ...props }:{ className?:string } & React.InputHTMLAttributes<HTMLInputElement>){ return <input className={`border rounded-xl p-2 ${className||""}`} {...props} /> }
