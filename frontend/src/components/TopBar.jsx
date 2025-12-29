import React, { useState } from 'react'

export default function TopBar({ title, showSidebarToggle = false, onToggleSidebar, profile = {}, showSearch = true }) {
  const [open, setOpen] = useState(false)

  const name = profile.name || 'Profile'
  const avatar = profile.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${name.replace(/\s+/g, '')}`

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showSidebarToggle ? (
            <button onClick={onToggleSidebar} className="md:hidden text-gray-600 text-2xl">
              ☰
            </button>
          ) : (
            <div className="md:hidden text-2xl opacity-0 pointer-events-none">☰</div>
          )}

          <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {showSearch && (
            <input
              className="hidden md:block border rounded px-3 py-2 text-sm"
              placeholder="Search courses..."
            />
          )}

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="bg-white shadow px-4 py-2 rounded-full flex items-center gap-3"
            >
              <span className="hidden sm:block text-sm font-medium">{name}</span>
              <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                {Array.isArray(profile.actions) && profile.actions.map((a, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setOpen(false); a.onClick && a.onClick() }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-left"
                  >
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
