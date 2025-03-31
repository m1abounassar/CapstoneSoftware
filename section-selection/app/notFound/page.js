'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckBox } from '@/components/ui/checkbox';

export default function Home() {
  const [leadAdminName, setLeadAdminName] = useState("");
  const [leadAdminUsername, setLeadAdminUsername] = useState("");

    useEffect(() => {

      const adminRes = await fetch('https://jdregistration.sci.gatech.edu/admin.php');
      if (!adminRes.ok) throw new Error("Admin fetch failed");
          
      const adminData = await adminRes.json();
      if (!Array.isArray(adminData.adm)) {
        console.error("Unexpected data format:", adminData);
      return;
      }
          
      // Find the admin info
      const matchedAdmin = adminData.adm.find(admin => admin.isLead === '1');
      console.log('info: ');
      console.log(matchedAdmin);

      leadAdminName = matchedAdmin.name;
      setLeadAdminName(leadAdminName);
      leadAdminUsername = matchedAdmin.username;
      setLeadAdminUsername(leadAdminUsername);
      
  }, []);
              

  return (
    <div className='min-h-screen bg-[url(../public/logBack.jpg)] font-figtree'>
      <div className='bg-[url(../public/logHead.jpg)] grid'>
        <div className='pt-2 pb-0 pr-1 text-2xl text-[#003056] justify-self-center'>Junior Design</div>
        <span className='pt-0 pb-4 pl-1 text-5xl font-bold text-[#232323] justify-self-center'> Team Sync</span>
      </div>

      <div className="flex place-content-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className='bg-[#FFFEF8]/50 w-auto border-[#6E5F33] text-[#003056] border-4 rounded-2xl p-5 space-y-6'>
            <div className='text-center space-y-2 opacity-100'>
              <div className='text-3xl font-bold'>Your Account is Not Recognized</div>
              <hr className="rounded-sm border-[#6E5F33] border-1" />
            </div>

            <div className='space-y-2 opacity-100 flex flex-col m-0'>
              <div className="text-lg text-center"> Please contact </div>
              <div className="text-lg text-center font-bold"> {leadAdminName} ({leadAdminUsername}@gatech.edu) </div>
              <div className="text-lg text-center">to be added to Team Sync. </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
