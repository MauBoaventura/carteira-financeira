'use client'
import React from 'react';

import { useLocation } from '@/hooks/use-location';

const Home = () => {

  const { userRole } = useLocation();
  return <div className="flex flex-col">
    Menu Principal do Modulo: {userRole}
  </div>
}

export default Home;