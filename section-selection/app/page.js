'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [email, setEmail] = useState('');
  const [gtid, setGtid] = useState('');
  const [adminCode, setAdminCode] = useState('');
  return (
    <div className='min-h-screen bg-[url(../public/logBack.jpg)]' >


    setError(newErrors);


    if (!valid) return; // Stop submission if there are errors

    console.log("Submitted Email:", email);
    console.log("Submitted GTID:", gtid);

    alert(`Submitted!\nEmail: ${email}\nGTID: ${gtid}`);
  };

  return (
    <div className='min-h-screen bg-[url(../public/logBack.jpg)]'>
      <div className='bg-[url(../public/logHead.jpg)] grid'>
        <div className='p-8 text-5xl font-mono font-bold text-[#003056]'>Junior Design</div>
      </div>

      <div className="flex place-content-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
          >
              <div className='bg-[#FFFEF8] w-auto opacity-70 border-[#6E5F33] border-4 rounded-2xl p-10 space-y-6'>
                <div className='text-center space-y-2'>
                  <h1 className='text-2xl font-bold'>Enter your GT Account and Password</h1>
                  <hr className="rounded-sm border-[#6E5F33] border-1"></hr>
                </div>
                <form className='space-y-4'>
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
                      type="default"
                      placeholder="90XXXXXXX"
                      value={gtid}
                      onChange={(e) => setGtid(e.target.value)}
                      required
                      className="bg-[#E5E2D3] border-[#A5925A] border-2 rounded-3xl pt-5 pb-5"
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="adminCode">Admin Code:</Label>
                    <Input
                      id="adminCode"
                      type="default"
                      placeholder="123456"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      required
                      className="bg-[#E5E2D3] border-[#A5925A] border-2 rounded-3xl pt-5 pb-5"
                    />
                  </div>
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

