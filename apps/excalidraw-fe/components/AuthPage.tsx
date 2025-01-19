"use client";

import { Button } from "@repo/ui/button";
import React from "react";

const AuthPage = ({ isSignin }: { isSignin: boolean }) => {
  return (
    <div>
      <input type="text" placeholder="name" className=""/>
      <input type="text" placeholder="password " />
      <Button
        onClick={() => {
          console.log("first");
        }}
        className="py-8 px-10 bg-blue-600"
      >
        {isSignin ? "Sign in" : "Sign up"}
      </Button>
    </div>
  );
};

export default AuthPage;
