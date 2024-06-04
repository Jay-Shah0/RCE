import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ReplsContext, ReplsContextState } from '@/context/ReplsContext';
import React, { useContext, useState } from 'react'

const Replspage : React.FC = () => {

    const { repls } = useContext<ReplsContextState>(ReplsContext);


    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="relative min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} />
        <div
            className={`transition-all duration-300 pt-16 ${
                isSidebarOpen ? "ml-64" : "ml-0"
            }`}
        >
            <div>
                Replspage
            </div>
        </div>
    </div>
  )
}

export default Replspage;