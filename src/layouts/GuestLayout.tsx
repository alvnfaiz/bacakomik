import { PropsWithChildren } from "react";
import Header from "../components/Header";

const GuestLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white">
            <Header />

            <main className="p-4 mx-auto max-w-7xl">
                {children}
            </main>
        </div>
    )
}

export default GuestLayout