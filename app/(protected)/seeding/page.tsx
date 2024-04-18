"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";

const SeedingPage = () => {
  const handleSeeding = () => {
    fetch("/api/seeding").then((res) => {
      if (res.ok) {
        alert("Seeding successful!");
      } else {
        alert("Seeding failed!");
      }
    });
  };
  return (
    <div>
      <h1>Seeding Page</h1>
      <p>Click the button below to seed the database with some data</p>

      <div className="mt-2">
        <Button onClick={handleSeeding}>Seeding</Button>
      </div>
    </div>
  );
};

export default SeedingPage;
