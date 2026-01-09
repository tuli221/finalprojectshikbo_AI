import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../config/api'

const AddProgram = () => {
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [image, setImage] = useState('')
	const [imageFile, setImageFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState(null)
	const [badge, setBadge] = useState('Free')
	const [features, setFeatures] = useState(['', '', '', ''])
	const [priceCurrent, setPriceCurrent] = useState('')
	const [priceOriginal, setPriceOriginal] = useState('')
	const [saving, setSaving] = useState(false)
	const [editingId, setEditingId] = useState(null)

	const updateFeature = (i, v) => {
		const next = [...features]
		next[i] = v
		setFeatures(next)
	}

	const addFeature = () => setFeatures(prev => [...prev, ''])
	const removeFeature = (i) => setFeatures(prev => prev.filter((_, idx) => idx !== i))

	const payloadFromState = () => ({
		title,
		image: image || '/assets/aipython.png',
		badge,
		features: features.filter(f => f && f.trim()),
		price_current: priceCurrent || null,
		price_original: priceOriginal || null
	})

	const fileToDataUrl = (file) => new Promise((res, rej) => {
		const reader = new FileReader()
		reader.onload = () => res(reader.result)
		reader.onerror = rej
		reader.readAsDataURL(file)
	})

	const saveProgram = async () => {
		setSaving(true)
		try {
			let res = null
			// if there's a file, send FormData
			if (imageFile) {
				const fd = new FormData()
				fd.append('title', title)
				fd.append('image', imageFile)
				fd.append('badge', badge)
				fd.append('features', JSON.stringify(features.filter(f => f && f.trim())))
				if (priceCurrent) fd.append('price_current', priceCurrent)
				if (priceOriginal) fd.append('price_original', priceOriginal)
				try {
					if (editingId) {
						res = await api.put(`/admin/programs/${editingId}`, fd)
					} else {
						res = await api.post('/admin/programs', fd)
					}
				} catch (e) { try { if (!res && !editingId) res = await api.post('/programs', fd) } catch(e) {} }
			} else {
				const payload = payloadFromState()
				try {
					if (editingId) {
						res = await api.put(`/admin/programs/${editingId}`, payload)
					} else {
						res = await api.post('/admin/programs', payload)
					}
				} catch (e) { try { if (!res && !editingId) res = await api.post('/programs', payload) } catch(e) {} }
			}

			if (res && res.data) {
				// success saved to backend
			} else {
				// fallback to localStorage; if file present, store base64 data URL
				const existing = JSON.parse(localStorage.getItem('learningPrograms') || '[]')
				let item = payloadFromState()
				if (imageFile) {
					try {
						const dataUrl = await fileToDataUrl(imageFile)
						item = { ...item, image: dataUrl }
					} catch (e) {
						item = { ...item, image: '/assets/aipython.png' }
					}
				}
				existing.push({ ...item, id: `local-${Date.now()}` })
				localStorage.setItem('learningPrograms', JSON.stringify(existing))
			}

			alert('Program added to Learning Center')
			navigate('/admin/programs')
		} catch (err) {
			console.error(err)
			alert('Failed to save program')
		} finally {
			setSaving(false)
		}
	}

	const handleSubmit = (e) => { e.preventDefault(); saveProgram() }

	const params = useParams()

	useEffect(() => {
		if (!params.id) return
		let mounted = true
		const load = async () => {
			try {
				const res = await api.get(`/programs/${params.id}`).catch(() => null)
				if (res && res.data && mounted) {
					const p = res.data
					setEditingId(p.id)
					setTitle(p.title || '')
					setImage(p.image || '')
					setBadge(p.badge || 'Free')
					setFeatures(Array.isArray(p.features) ? p.features : (p.features ? JSON.parse(p.features) : ['','','','']))
					setPriceCurrent(p.price_current || '')
					setPriceOriginal(p.price_original || '')
				}
			} catch (e) {
				// fallback to localStorage
				try {
					const stored = JSON.parse(localStorage.getItem('learningPrograms') || '[]')
					const found = stored.find(x => String(x.id) === String(params.id))
					if (found && mounted) {
						setEditingId(found.id)
						setTitle(found.title || '')
						setImage(found.image || '')
						setBadge(found.badge || 'Free')
						setFeatures(found.features || ['','','',''])
						setPriceCurrent(found.price_current || '')
						setPriceOriginal(found.price_original || '')
					}
				} catch (ee) {}
			}
		}
		load()
		return () => { mounted = false }
	}, [params.id])

	return (
		<div className="bg-white p-6 rounded-2xl shadow">
			<div className="grid grid-cols-1 gap-6">
				<div>
					<h3 className="text-2xl font-semibold mb-4">Add Workshop / Program</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Title</label>
							<input value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded border px-3 py-2" />
						</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Image (choose file)</label>
								<input type="file" accept="image/*" onChange={e => {
									const file = e.target.files && e.target.files[0]
									if (file) {
										if (previewUrl) { try { URL.revokeObjectURL(previewUrl) } catch (e) {} }
										setImageFile(file)
										setPreviewUrl(URL.createObjectURL(file))
									}
								}} className="mt-1 block w-full rounded border px-3 py-2" />
								{previewUrl && (
									<div className="mt-2">
										<img src={previewUrl} alt="preview" className="w-40 h-28 object-cover rounded" />
									</div>
								)}
								<div className="mt-2 text-xs text-gray-500">Or leave empty to use default image</div>
							</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Badge</label>
							<select value={badge} onChange={e => setBadge(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
								<option value="Free">Free</option>
								<option value="Premium">Premium</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Features (one per line)</label>
							<div className="space-y-2 mt-2">
								{features.map((f, i) => (
									<div key={i} className="flex gap-2">
										<input value={f} onChange={e => updateFeature(i, e.target.value)} className="flex-1 rounded border px-3 py-2" />
										<button type="button" onClick={() => removeFeature(i)} className="px-3 py-2 bg-red-100 rounded">Remove</button>
									</div>
								))}
								<button type="button" onClick={addFeature} className="mt-2 text-sm text-green-600">+ Add Feature</button>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">Current Price</label>
								<input value={priceCurrent} onChange={e => setPriceCurrent(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Original Price</label>
								<input value={priceOriginal} onChange={e => setPriceOriginal(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
							</div>
						</div>

						<div className="flex gap-2">
							<button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
							<button type="button" onClick={() => navigate('/admin/programs')} className="px-4 py-2 border rounded">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default AddProgram
