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
  return (
    <div className='min-h-screen bg-[#D3D0D0] font-mono' >


        <div className='bg-[#9B9B9B] grid grid-cols-3 w-screen'>


          <div className='p-4 text-lg lg:text-2xl font-bold w-max'>Junior Design Team Sync</div>

          <div></div>

          <div className='p-5 text-sm lg:text-lg justify-self-end'>Admin Name</div>


        
        </div>



        {/* panels */}
        <div className="grid grid-cols-2">

          {/* section panel + button */}
          <div className='m-10'>

            <div className='bg-[#757575] w-xs h-min rounded-3xl grid-rows-2'>

              <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Sections</div>
              <div className='bg-[#E6E6E6] h-full w-50 rounded-3xl px-5 py-3'>info</div>

            </div>
            <Button 
                  className="bg-[#757575] mt-5 text-white text-sm rounded-lg hover:bg-[#636363] shadow-none"
                >
                  Add Section
                </Button>

          </div>


          {/* team panel */}
          <div className='bg-[#757575] w-xs h-min rounded-3xl grid-rows-2 m-10'>
            
            
            <div className='px-8 py-2 lg:py-4 text-white text-lg lg:text-3xl font-bold'>Teams</div>
              <div className='bg-[#E6E6E6] h-full w-50 rounded-3xl px-5 py-3'>info</div>

            <div className='bg-[#E6E6E6] h-full w-full'></div>


          </div>


        </div>



      {/* Pop-up Modal 
      
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Add a New Section</h2>
            <Input placeholder="Section Name" className="mt-3 mb-5" />
            <div className="flex justify-end">
              <Button 
                className="bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 shadow-none"
                onClick={() => setIsPopupOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      
      
      */}
      



    </div>



  );
}
