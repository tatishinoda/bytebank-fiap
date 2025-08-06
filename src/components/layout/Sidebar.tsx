"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
   const pathname = usePathname();

   const isActive = (path: string) => {
      return pathname === path;
   };

   return (
      <div className="bg-white rounded-lg shadow p-4">
         <nav>
            <ul className="space-y-2">
               <li>
                  <Link
                     href="/dashboard"
                     className={`block py-2 px-4 ${
                        isActive("/dashboard")
                           ? "text-[#004D61] font-medium border-l-4 border-[#004D61]"
                           : "text-gray-600 hover:text-[#004D61] hover:bg-gray-50"
                     }`}
                  >
                     Início
                  </Link>
               </li>
               <li>
                  <Link
                     href="#"
                     className="block py-2 px-4 text-gray-600 hover:text-[#004D61] hover:bg-gray-50"
                  >
                     Transferências
                  </Link>
               </li>
               <li>
                  <Link
                     href="#"
                     className="block py-2 px-4 text-gray-600 hover:text-[#004D61] hover:bg-gray-50"
                  >
                     Investimentos
                  </Link>
               </li>
               <li>
                  <Link
                     href="#"
                     className="block py-2 px-4 text-gray-600 hover:text-[#004D61] hover:bg-gray-50"
                  >
                     Outros serviços
                  </Link>
               </li>
            </ul>
         </nav>
      </div>
   );
};

export default Sidebar;
