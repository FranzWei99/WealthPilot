export const currency = (n:number)=> new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n||0);
export const percent = (n:number)=> `${(n*100).toFixed(0)}%`;
