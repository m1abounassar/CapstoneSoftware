'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [email, setEmail] = useState('');
  const [gtid, setGtid] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState({ email: '', gtid: '' });

  const router = useRouter();


  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    let newErrors = { email: '', gtid: '' };
    
    const redirectPath = isAdmin ? '/admin' : '/student';

    // const params = new URLSearchParams({      // comment out this line to use local hosting
    //     email,      // comment out this line to use local hosting
    //     gtid,      // comment out this line to use local hosting
    //     redirect: redirectPath,      // comment out this line to use local hosting
    //     ...(isAdmin && { adminCode })      // comment out this line to use local hosting
    // });      // comment out this line to use local hosting

    // window.location.href = `/cas-login.php?${params.toString()}`;      // comment out this line to use local hosting

    // uncomment line below to use local hosting
    router.push(redirectPath); 


};


  return (
    <div className='min-h-screen bg-[url(../public/logBack.jpg)]'>
      <div className='bg-[url(../public/logHead.jpg)] grid'>
        <div className='pt-2 pb-0 pr-1 text-2xl font-sans font-normal text-[#003056] justify-self-center'>Junior Design</div>
        <span className='pt-0 pb-4 pl-1 text-5xl font-mono font-bold text-[#232323] justify-self-center'> Team Sync</span>
      </div>

      <div className="flex place-content-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className='bg-[#FFFEF8] w-auto opacity-70 border-[#6E5F33] border-4 rounded-2xl p-10 space-y-6'>
            <div className='text-center space-y-2'>
              <h1 className='text-2xl font-bold'>Select Your Account Type</h1>
              <hr className="rounded-sm border-[#6E5F33] border-1" />
            </div>

            <form className='space-y-4' onSubmit={handleSubmit}>
            <div className="text-center">
                <Button
                  type="submit"
                  className="bg-[#A5925A] text-white text-md rounded-lg hover:bg-[#002040] shadow-none"
                >
                  Student
                </Button>
              </div>
              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-[#A5925A] text-white text-md rounded-lg hover:bg-[#002040] shadow-none"
                  // value={isAdmin}
                  onClick={() => setIsAdmin(!isAdmin)}
                >
                  Admin
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
