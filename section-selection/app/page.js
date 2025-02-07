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
  const [email, setEmail] = useState('');
  const [gtid, setGtid] = useState('');
  return (
    <div className='min-h-screen bg-[url(../public/logBack.jpg)]' >


        <div className='bg-[url(../public/logHead.jpg)] grid'>

          <div className='p-8 text-5xl font-mono font-bold text-[#003056]'>Junior Design</div>

        
        </div>
      </motion.div>
    </div>



  );
}
