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

    const gtidPattern = /^90\d{7}$/;
    if (!gtidPattern.test(gtid)) {
      newErrors.gtid = "GTID must be exactly 9 digits and start with '90'.";
      valid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gatech\.edu$/;
    if (!emailPattern.test(email)) {
      newErrors.email = "Email must be a valid Georgia Tech email (@gatech.edu).";
      valid = false;
    }

    if (isAdmin && !adminCode.trim()) {
      valid = false;
      newErrors.adminCode = "Admin code is required.";
    }

    setError(newErrors);
    if (!valid) return;

    console.log("Submitted Email:", email);
    console.log("Submitted GTID:", gtid);
    if (isAdmin) console.log("Admin Code:", adminCode);

    alert(`Submitted!\nEmail: ${email}\nGTID: ${gtid}${isAdmin ? `\nAdmin Code: ${adminCode}` : ''}`);

    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/student');
    }
    
  };

  return (
    <div className='min-h-screen bg-[url(../public/logBack.jpg)] font-figtree'>
      <div className='bg-[url(../public/logHead.jpg)] grid'>
        <div className='pt-4 pb-0 pr-1 text-2xl font-normal text-[#003056] justify-self-center'>Junior Design</div>
        <span className='pt-2 pb-4 pl-1 text-5xl font-bold text-[#232323] justify-self-center'> Team Sync</span>
      </div>

      <div className="flex place-content-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className='bg-[#FFFEF8] w-auto opacity-70 border-[#6E5F33] border-4 rounded-2xl p-10 space-y-6'>
            <div className='text-center space-y-2'>
              <h1 className='text-2xl font-bold'>Enter your GT Email and ID</h1>
              <hr className="rounded-sm border-[#6E5F33] border-1" />
            </div>

            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <Label htmlFor="email">GT Email:</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="gburdell3@gatech.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#E5E2D3] border-[#A5925A] border-2 rounded-3xl pt-5 pb-5"
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor="gtid">GTID:</Label>
                <Input
                  id="gtid"
                  type="text"
                  placeholder="90XXXXXXX"
                  value={gtid}
                  onChange={(e) => setGtid(e.target.value)}
                  required
                  className="bg-[#E5E2D3] border-[#A5925A] border-2 rounded-3xl pt-5 pb-5"
                />
              </div>

              <div className='space-y-2'>
                <CheckBox
                  label="Admin"
                  value={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
  
                />
              </div>

              {isAdmin && (
                <div className='space-y-2'>
                  <Label htmlFor="adminCode">Admin Code:</Label>
                  <Input
                    id="adminCode"
                    type="text"
                    placeholder="123456"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                    className="bg-[#E5E2D3] border-[#A5925A] border-2 rounded-3xl pt-5 pb-5"
                  />
                </div>
              )}

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-[#003056] text-white text-md rounded-lg hover:bg-[#002040] shadow-none"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
