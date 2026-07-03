'use client'

import React from 'react'
import { EmptyStateProps } from '@/utils/types'

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    {icon ? (
      <div className="bg-surface-muted text-text-muted flex h-14 w-14 items-center justify-center rounded-full">
        {icon}
      </div>
    ) : null}
    <div className="flex flex-col gap-1">
      <p className="text-text-primary text-sm font-semibold">{title}</p>
      {description ? <p className="text-text-muted text-xs">{description}</p> : null}
    </div>
    {action ? <div className="mt-1">{action}</div> : null}
  </div>
)

export default EmptyState
