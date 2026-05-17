'use client'

// Mock implementation to prevent compilation errors.
// This hook was auto-generated but is unused because the project uses Sonner toast.
import * as React from 'react'

export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
}

export function useToast() {
  return {
    toasts: [] as ToastProps[],
    toast: (props: any) => ({ id: '', dismiss: () => {}, update: () => {} }),
    dismiss: (toastId?: string) => {},
  }
}

export const toast = (props: any) => ({ id: '', dismiss: () => {}, update: () => {} })
