'use client';

import React, { useState } from 'react';
import { usePromotorStore } from '@/store/usePromotorStore';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { DashboardView } from '@/components/DashboardView';
import { SurveyView } from '@/components/SurveyView';
import { DaftungView } from '@/components/DaftungView';
import { WorkOrderView } from '@/components/WorkOrderView';
import { WarehouseView } from '@/components/WarehouseView';
import { AuditView } from '@/components/AuditView';
import { StandardConstructionView } from '@/components/StandardConstructionView';

export default function Home() {
  const { currentPage } = usePromotorStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && <DashboardView />}
          {currentPage === 'survey' && <SurveyView />}
          {currentPage === 'daftung' && <DaftungView />}
          {currentPage === 'wo' && <WorkOrderView />}
          {currentPage === 'vendor' && <WorkOrderView />}
          {currentPage === 'monitoring' && <WorkOrderView />}
          {currentPage === 'warehouse' && <WarehouseView />}
          {currentPage === 'std' && <StandardConstructionView />}
          {currentPage === 'audit' && <AuditView />}

          {/* Fallback for other pages */}
          {['contract'].includes(currentPage) && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
              <h3 className="font-bold text-slate-800 text-base">Modul {currentPage.toUpperCase()} Tersedia</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Modul ini telah terhubung ke model Prisma ORM PostgreSQL (`Contract`).
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
