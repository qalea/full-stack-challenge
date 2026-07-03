'use client'

import React from 'react'
import { TwoColumnLayoutProps } from '@/utils/types'

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ sidebar, main, showMain = false }) => (
  <div className="flex h-full overflow-hidden">
    {/* Sidebar: always visible on md+, hidden on mobile when a note is open */}
    <div
      className={[
        'w-full shrink-0 flex-col overflow-hidden',
        'md:flex md:w-[280px]',
        showMain ? 'hidden' : 'flex',
      ].join(' ')}
    >
      {sidebar}
    </div>

    {/* Main panel: full screen on mobile when note open, flex-1 on md+ */}
    <div
      className={['flex-1 flex-col overflow-hidden', 'md:flex', showMain ? 'flex' : 'hidden'].join(
        ' ',
      )}
    >
      {main}
    </div>
  </div>
)

export default TwoColumnLayout
