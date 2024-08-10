import LoginForm from '@/components/forms/login-form'
import React from 'react'

export default function page() {
  return (
    <div className="hidden h-8 w-3 grow rounded-md bg-gray-500 md:block">
        <LoginForm />
    </div>
  )
}
