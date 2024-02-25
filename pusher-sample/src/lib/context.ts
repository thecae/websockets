"use client";

import React from "react";

const UserContext = React.createContext({
    display: "",
    setDisplay: (dp: string) => {}, // Stub function for initial context value
  });

export default UserContext;
