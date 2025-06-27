import React from 'react';
import { Outlet } from "react-router-dom";
import { NavBar } from '../components/Navigation/Navbar';
import { SideNav } from '../components/Navigation/SideNav';
import Notification from './Notification/Notification';
import Bot from '../components/Chatobot/Bot'; 

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <NavBar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '250px', overflowY: 'auto', borderLeft: '1px solid #e0e0e0' }}>
          <SideNav />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          <Outlet /> {/* Renders child pages */}
        </div>
      </div>
      <Notification />
      
      {/* 🟢 Add chatbot component globally here */}
      <Bot context="You are a helpful assistant. Reply politely and with clarity." />
    </div>
  );
};

export default Layout;

