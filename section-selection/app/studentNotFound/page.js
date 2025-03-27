'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckBox } from '@/components/ui/checkbox';

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
    
    // Determine the redirect path based on role
    const redirectPath = isAdmin ? '/admin' : '/student';

    // Build query params (can also send adminCode if needed for future logic)
    const params = new URLSearchParams({
        email,
        gtid,
        redirect: redirectPath,
        ...(isAdmin && { adminCode }) // optional, if you want to pass adminCode too
    });

    // Redirect to the PHP CAS login handler
    window.location.href = `/app/api/auth/cas-login.php?${params.toString()}`;
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
          <div className='bg-[#FFFEF8] w-auto opacity-70 border-[#6E5F33] border-4 rounded-2xl p-5 space-y-6'>
            <div className='text-center space-y-2'>
              <h1 className='text-2xl font-bold'>Your Account is Not Recognized</h1>
              <hr className="rounded-sm border-[#6E5F33] border-1" />
            </div>

            <div className='space-y-2'>
              <p className="text - l font-sans"> Please contact Ronnie Howard (rhoward46@gatech.edu) to be added to Team Sync. </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
