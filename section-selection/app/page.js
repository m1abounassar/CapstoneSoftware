'use client'
import {useState} from 'react';
import {motion} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [email, setEmail] = useState(' ');
  const [gtid, setGtid] = useState(' ');
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4'>
      <motion.div
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="w-full max-w-md"
      >
        <div className='bg-white shadow-xl rounded-2xl p-8 space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-2xl font-bold'>Welcome to GT Section Selection</h1>
            <p className='text-gray-500'>Please enter your GTID and GT Email</p>
          </div>
          <form className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor="email">GT Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="gburdell3@gatech.edu"
                value={email}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor="gtid">GTID</Label>
              <Input
                id="gtid"
                placeholder="90XXXXXXX"
                value={gtid}
                required
              />
            </div>




          </form>



        </div>




      </motion.div>
    </div>
  );
}
