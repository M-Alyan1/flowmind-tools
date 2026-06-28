/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from './layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

import PromptWriter from './pages/PromptWriter';
import ColdOutreach from './pages/ColdOutreach';
import ObjectionHandler from './pages/ObjectionHandler';
import SalesConsultant from './pages/SalesConsultant';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PromptWriter />} />
              <Route path="/cold-outreach" element={<ColdOutreach />} />
              <Route path="/objection-handler" element={<ObjectionHandler />} />
              <Route path="/sales-consultant" element={<SalesConsultant />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </AppShell>
    </BrowserRouter>
  );
}
