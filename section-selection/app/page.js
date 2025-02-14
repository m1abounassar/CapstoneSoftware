'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [email, setEmail] = useState('');
  const [gtid, setGtid] = useState('');

  const [error, setError] = useState({ email: '', gtid: '' });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload

    let valid = true;
    let newErrors = { email: '', gtid: '' };

    // Validate GTID (Must start with "90" and be 9 digits)
    const gtidPattern = /^90\d{7}$/;
    if (!gtidPattern.test(gtid)) {
      newErrors.gtid = "GTID must be exactly 9 digits and start with '90'.";
      valid = false;
    }

    // Validate Email (Must end with "@gatech.edu")
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gatech\.edu$/;
    if (!emailPattern.test(email)) {
      newErrors.email = "Email must be a valid Georgia Tech email (@gatech.edu).";
      valid = false;
    }


    setError(newErrors);


    if (!valid) return; // Stop submission if there are errors

    console.log("Submitted Email:", email);
    console.log("Submitted GTID:", gtid);

    alert(`Submitted!\nEmail: ${email}\nGTID: ${gtid}${isAdmin ? `\nAdmin Code: ${adminCode}` : ''}`);

    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/student');
    }
    
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
            
            {/* Form with onSubmit */}
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
                {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
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
                {error.gtid && <p className="text-red-500 text-sm">{error.gtid}</p>}
              </div>

              {/* Submit Button inside Form */}
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

