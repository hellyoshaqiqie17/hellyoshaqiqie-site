import React, { useState, useEffect, useRef, useId } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, CheckCircle } from './Icons'

const Hu = [0.23, 1, 0.32, 1]

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.985, y: 8, filter: 'blur(2px)' },
  visible: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.26, ease: Hu } },
  exit: { opacity: 0, scale: 0.985, y: -6, filter: 'blur(2px)', transition: { duration: 0.2, ease: Hu } }
}

const osOptions = [
  { value: 'mac', label: 'Mac' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' }
]

const ideOptions = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'vscode', label: 'VS Code' },
  { value: 'windsurf', label: 'Windsurf' },
  { value: 'other', label: 'Lainnya' }
]

const expOptions = [
  { value: 'beginner', label: 'Baru mulai' },
  { value: 'experienced', label: 'Udah sering vibe coding' },
  { value: 'optimize', label: 'Mau optimasi workflow' }
]

const lf = 'space-y-4'
const uf = 'text-[12px] font-semibold uppercase tracking-wide text-muted'
const sf = 'block text-[13px] font-medium text-foreground mb-1.5'
const cf = 'w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/10 disabled:opacity-60 theme-transition'

const initialForm = {
  name: '',
  email: '',
  contact: '',
  os: '',
  ide: '',
  ideOther: '',
  experience: '',
  about: '',
  goal: '',
  repoUrl: '',
  agreedToTerms: false
}

export default function CoachingDialog({ open, onClose }) {
  const dialogId = useId()
  const dialogRef = useRef(null)
  const firstInputRef = useRef(null)

  const [form, setForm] = useState(initialForm)
  const [hp, setHp] = useState('') // Honeypot field for spam prevention
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) {
        dialog.showModal()
      }
      setError(null)
      setSuccess(false)
      setForm(initialForm)
      setHp('')
      requestAnimationFrame(() => {
        firstInputRef.current?.focus()
      })
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (!loading) onClose()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => dialog.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, loading])

  function updateField(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  function validate() {
    if (!form.name.trim()) return 'Nama wajib diisi.'
    if (!form.email.trim()) return 'Email wajib diisi.'
    if (!form.os) return 'Pilih OS lo.'
    if (!form.ide) return 'Pilih IDE lo.'
    if (form.ide === 'other' && !form.ideOther.trim()) return 'Sebutin IDE lo.'
    if (!form.experience) return 'Pilih experience level lo.'
    if (!form.about.trim()) return 'Ceritain sedikit tentang lo.'
    if (!form.goal.trim()) return 'Isi dulu, mau build apa di sesi ini.'
    if (!form.agreedToTerms) return 'Lo harus menyetujui ketentuan sesi.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.contact.trim() || undefined,
          os: form.os,
          ide: form.ide,
          ideOther: form.ide === 'other' ? form.ideOther.trim() : undefined,
          experience: form.experience,
          about: form.about.trim(),
          goal: form.goal.trim(),
          repoUrl: form.repoUrl.trim() || undefined,
          agreedToTerms: true,
          company: hp || undefined // honeypot maps to Jd/company
        })
      })

      setLoading(false)
      if (response.ok) {
        setSuccess(true)
      } else {
        const errData = await response.json().catch(() => ({}))
        setError(errData.message || 'Terjadi kesalahan pada server. Coba lagi.')
      }
    } catch {
      setLoading(false)
      setError('Tidak bisa terhubung ke server. Periksa koneksi internet Anda.')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={dialogId}
      className="fixed inset-0 z-50 m-auto w-full max-w-lg rounded-3xl border border-border bg-card p-0 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col theme-transition"
      onCancel={(e) => {
        e.preventDefault()
        if (!loading) onClose()
      }}
    >
      <AnimatePresence>
        {open && (
          <m.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex max-h-[85vh] flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <h2 id={dialogId} className="text-lg font-semibold tracking-tight text-foreground">
                Vibe Coding Coaching with Hellyos Ageng Haqiqie
              </h2>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                aria-label="Close"
                className="-mr-1.5 -mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground disabled:opacity-50 theme-transition"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {success ? (
              /* Success View */
              <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                <CheckCircle size={48} weight="fill" className="text-emerald-500" aria-hidden />
                <p className="text-lg font-medium text-foreground">
                  Thanks for filling out the form!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-foreground px-6 py-2.5 text-[15px] font-medium text-canvas hover:bg-foreground/90 active:scale-[0.97] transition-transform theme-transition"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Form View */
              <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6">
                  {error && (
                    <div className="alert alert-error">
                      {error}
                    </div>
                  )}

                  {/* Honeypot field (hidden for spam prevention) */}
                  <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                    <label htmlFor="coaching-company">Company</label>
                    <input
                      id="coaching-company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      name="company"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                    />
                  </div>

                  {/* Personal Info */}
                  <section className={lf}>
                    <h3 className={uf}>Personal Info</h3>
                    <div>
                      <label htmlFor="coaching-name" className={sf}>
                        Nama <span className="text-alert-error">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        id="coaching-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={cf}
                      />
                    </div>
                    <div>
                      <label htmlFor="coaching-email" className={sf}>
                        Email <span className="text-alert-error">*</span>
                      </label>
                      <input
                        id="coaching-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={cf}
                        placeholder="buat kirim rekaman & reminder"
                      />
                    </div>
                    <div>
                      <label htmlFor="coaching-contact" className={sf}>
                        WhatsApp / Telegram <span className="font-normal text-muted">(opsional, recommended)</span>
                      </label>
                      <input
                        id="coaching-contact"
                        type="text"
                        value={form.contact}
                        onChange={(e) => updateField('contact', e.target.value)}
                        className={cf}
                      />
                    </div>
                  </section>

                  {/* Setup Check */}
                  <section className={lf}>
                    <h3 className={uf}>Setup Check</h3>
                    <div>
                      <label htmlFor="coaching-os" className={sf}>
                        OS <span className="text-alert-error">*</span>
                      </label>
                      <select
                        id="coaching-os"
                        required
                        value={form.os}
                        onChange={(e) => updateField('os', e.target.value)}
                        className={cf}
                      >
                        <option value="" disabled>Pilih OS</option>
                        {osOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="coaching-ide" className={sf}>
                        IDE <span className="text-alert-error">*</span>
                      </label>
                      <select
                        id="coaching-ide"
                        required
                        value={form.ide}
                        onChange={(e) => updateField('ide', e.target.value)}
                        className={cf}
                      >
                        <option value="" disabled>Pilih IDE</option>
                        {ideOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {form.ide === 'other' && (
                      <div>
                        <label htmlFor="coaching-ide-other" className={sf}>IDE lainnya</label>
                        <input
                          id="coaching-ide-other"
                          type="text"
                          required
                          value={form.ideOther}
                          onChange={(e) => updateField('ideOther', e.target.value)}
                          className={cf}
                          placeholder="Sebutin IDE lo"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="coaching-exp" className={sf}>
                        Experience level <span className="text-alert-error">*</span>
                      </label>
                      <select
                        id="coaching-exp"
                        required
                        value={form.experience}
                        onChange={(e) => updateField('experience', e.target.value)}
                        className={cf}
                      >
                        <option value="" disabled>Pilih experience level</option>
                        {expOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </section>

                  {/* Project / Goals */}
                  <section className={lf}>
                    <h3 className={uf}>Project / Goals</h3>
                    <div>
                      <label htmlFor="coaching-about" className={sf}>
                        Ceritain sedikit tentang lo <span className="text-alert-error">*</span>
                      </label>
                      <textarea
                        id="coaching-about"
                        required
                        rows={3}
                        value={form.about}
                        onChange={(e) => updateField('about', e.target.value)}
                        className={`${cf} resize-y`}
                      />
                    </div>
                    <div>
                      <label htmlFor="coaching-goal" className={sf}>
                        Mau build apa di sesi ini? <span className="text-alert-error">*</span>
                      </label>
                      <textarea
                        id="coaching-goal"
                        required
                        rows={3}
                        value={form.goal}
                        onChange={(e) => updateField('goal', e.target.value)}
                        className={`${cf} resize-y`}
                      />
                    </div>
                    <div>
                      <label htmlFor="coaching-repo" className={sf}>
                        Link repo GitHub <span className="font-normal text-muted">(opsional)</span>
                      </label>
                      <input
                        id="coaching-repo"
                        type="text"
                        value={form.repoUrl}
                        onChange={(e) => updateField('repoUrl', e.target.value)}
                        className={cf}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </section>

                  {/* Terms */}
                  <section className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer text-[14px] text-muted hover:text-foreground theme-transition">
                      <input
                        type="checkbox"
                        required
                        checked={form.agreedToTerms}
                        onChange={(e) => updateField('agreedToTerms', e.target.checked)}
                        className="mt-1 accent-foreground"
                      />
                      <span>
                        Gue bersedia sesinya direkam & dirilis di YouTube / media sosial Hellyos Ageng Haqiqie.
                      </span>
                    </label>
                  </section>
                </div>

                {/* Footer Submit */}
                <div className="border-t border-border px-6 py-4 bg-surface/30 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-foreground px-6 py-3 text-[15px] font-medium text-canvas hover:bg-foreground/90 disabled:opacity-50 active:scale-[0.98] transition-transform theme-transition"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}
