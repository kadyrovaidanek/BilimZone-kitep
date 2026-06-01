import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from '@/app/router/router';
import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from '@/widgets/Sidebar/model/SidebarContext'; // 👈 ДОБАВЬ

import './assets/styles/globals.css'
import '@/locale/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider> {/* 👈 ВОТ ЭТО ВАЖНО */}
        <Router />
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);