'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";

export default function Home() {
  const [choice, setChoice] = React.useState("");
  const [customInput, setCustomInput] = React.useState("");
  const [isCustom, setIsCustom] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    setIsCustom(choice === "cus");
  }, [choice]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[url(../public/logBack.jpg)]">
      <div className="bg-[url(../public/logHead.jpg)] grid">
        <div className="p-8 text-5xl font-mono font-bold text-[#003056] justify-self-center">
          Junior Design
        </div>
      </div>

      <div className="flex place-content-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#FFFEF8] w-auto opacity-70 border-[#6E5F33] border-4 rounded-2xl p-10 mt-10 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Select Your Team From Part One</h1>
              <hr className="rounded-sm border-[#6E5F33] border-1" />
            </div>

            <Dropdown 
                value={choice} 
                onChange={setChoice}
                className="bg-[#E5E2D3] border-[#A5925A] border-2 rounded-3xl px-3 py-2">
            </Dropdown>

            {isCustom && (
              <input
                type="text"
                placeholder="Enter custom value"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300"
              />
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
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
