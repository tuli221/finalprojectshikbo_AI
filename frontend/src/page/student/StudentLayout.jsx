import React, { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import { useAuth } from '../../context/AuthContext'

const links = [
	{ to: '/student', label: 'Dashboard', icon: 'fa-solid fa-house', end: true },
	{ to: '/student/my-courses', label: 'My Courses', icon: 'fa-solid fa-book' },
	{ to: '/student/leaderboard', label: 'Leaderboard', icon: 'fa-solid fa-trophy' },
	{ to: '/student/report', label: 'Report', icon: 'fa-solid fa-chart-line' },
	{ to: '/student/settings', label: 'Settings', icon: 'fa-solid fa-gear' }
]

export default function StudentLayout() {
	const navigate = useNavigate()
	const { logout, user } = useAuth()
	const [searchQuery, setSearchQuery] = useState('')
	return (
		<div className="min-h-screen flex bg-gray-50">
			{/* left sidebar */}
			<aside
				className={`w-64 bg-white border-r shadow-lg p-6 space-y-6 fixed inset-y-0 left-0 z-30 md:translate-x-0`}
				aria-hidden={false}
			>
				<div className="flex items-center justify-between">
					<Link to="/" className="flex items-center gap-3">
						<img src="/assets/downloadShikbo.png" alt="Shikbo.AI" className="h-10 rounded-md" />
					</Link>
				</div>

				<nav className="space-y-1 text-black font-medium">
					{links.map((l) => (
						<NavLink
							key={l.to}
							to={l.to}
							end={l.end}
							className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition ${isActive ? 'bg-green-100 text-green-600' : 'hover:bg-green-100 hover:text-green-600'}`}
						>
							<i className={l.icon}></i>
							{l.label}
						</NavLink>
					))}
				</nav>

			</aside>

			{/* main content (space for sidebar) */}
			<div className="flex-1 ml-64">
								<TopBar
									title={`Welcome back, ${user?.name || 'Student'}!`}
									showSidebarToggle={false}
									searchValue={searchQuery}
									onSearchChange={setSearchQuery}
									profile={{
										name: user?.name || 'Student',
										avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${user?.name || 'Student'}`,
										actions: [
											{ label: 'My Profile', onClick: () => navigate('/student/settings') },
											{ label: 'Logout', onClick: async () => { await logout(); navigate('/') } }
										]
									}}
								/>

				<main className="max-w-7xl mx-auto p-6">
					<Outlet context={{ searchQuery }} />
				</main>
			</div>
		</div>
	)
}