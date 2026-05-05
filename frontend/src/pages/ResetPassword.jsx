import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { authApi } from '../lib/api'

const CSS = `
@keyframes rpFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes rpFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes rpShimmer {
  0%,100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@keyframes rpFloat {
  0%,100% { transform: translateY(0px) rotate(-1deg); }
  50%      { transform: translateY(-12px) rotate(-1deg); }
}
@keyframes rpFloatB {
  0%,100% { transform: translateY(0px) rotate(2deg); }
  50%      { transform: translateY(-8px) rotate(2deg); }
}
@keyframes rpSpin {
  to { transform: rotate(360deg); }
}
@keyframes rpTicker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes rpGlow {
  0%,100% { box-shadow: 0 0 20px rgba(168,85,247,0.3); }
  50%      { box-shadow: 0 0 40px rgba(99,102,241,0.45); }
}
@keyframes rpProgressFill {
  from { width: 0%; }
  to   { width: var(--tw, 100%); }
}
@keyframes rpShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.rp-fade-up   { animation: rpFadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
.rp-fade-in   { animation: rpFadeIn 0.5s ease both; }
.rp-float-a   { animation: rpFloat 5s ease-in-out infinite; }
.rp-float-b   { animation: rpFloatB 6.5s ease-in-out infinite 1s; }
.rp-glow      { animation: rpGlow 3s ease-in-out infinite; }
.rp-shake     { animation: rpShake 0.45s cubic-bezier(.36,.07,.19,.97) both; }

.rp-d-100 { animation-delay: 0.1s; }
.rp-d-200 { animation-delay: 0.2s; }
.rp-d-300 { animation-delay: 0.3s; }
.rp-d-400 { animation-delay: 0.4s; }
.rp-d-500 { animation-delay: 0.5s; }

.rp-hero-gradient {
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #0ea5e9 100%);
  background-size: 200% 200%;
  animation: rpShimmer 8s ease infinite;
}

.rp-input {
  width: 100%;
  border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.05);
  padding: 12px 44px 12px 16px;
  font-size: 14px;
  color: #fff;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.rp-input::placeholder { color: rgba(148,163,184,0.6); }
.rp-input:focus {
  border-color: rgba(168,85,247,0.5);
  background: rgba(255,255,255,0.08);
  box-shadow: 0 0 0 3px rgba(168,85,247,0.12);
}
.rp-input.err {
  border-color: rgba(244,63,94,0.5);
}
.rp-input.err:focus {
  box-shadow: 0 0 0 3px rgba(244,63,94,0.15);
}

.rp-ticker-track {
  animation: rpTicker 30s linear infinite;
  display: flex;
  width: max-content;
  gap: 32px;
}
`

const TICKER_ITEMS = ['Concerts', 'Festivals', 'Sports', 'Theatre', 'Exhibitions', 'Workshops', 'Music Events', 'Art Shows']
const BG_IMG = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=80'
const FESTIVAL_IMG = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80'

// ─── Password strength ────────────────────────────────────────────────────────
function pwStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const STR_LABEL = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh']
const STR_COLOR = ['#475569', '#f43f5e', '#f59e0b', '#38bdf8', '#10b981']

// ─── Eye icon ─────────────────────────────────────────────────────────────────
function EyeIcon({ show }) {
  return show ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const strength = pwStrength(password)
  const cpwMismatch = confirmPassword && confirmPassword !== password
  const checks = {
    len: password.length >= 8,
    case: /[A-Z]/.test(password) && /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.')
      triggerShake()
      return
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      triggerShake()
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword({ reset_token: token, new_password: password })
      navigate('/', { state: { message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' } })
    } catch (err) {
      setError(err.message || 'Link đặt lại không hợp lệ hoặc đã hết hạn.')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="display-font relative flex min-h-screen overflow-hidden"
        style={{ background: '#0a0e1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ── Background image + overlay ── */}
        <div className="absolute inset-0">
          <img src={BG_IMG} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(120deg, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.78) 50%, rgba(20,15,40,0.6) 100%)'
          }} />
        </div>

        {/* ── Ticker top ── */}
        <div className="absolute left-0 right-0 top-0 z-20 overflow-hidden border-b border-slate-800/60 bg-slate-900/70 py-3 backdrop-blur-md">
          <div className="rp-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-1 w-1 rounded-full bg-purple-500" />{t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Floating cards (decorative) ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="rp-float-a absolute right-12 top-24 hidden w-44 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 lg:block">
            <img src={FESTIVAL_IMG} alt="" className="h-28 w-full object-cover" />
            <div className="bg-white/10 px-3 py-2.5 backdrop-blur-md">
              <p className="text-[11px] font-bold text-white">Bảo mật tài khoản</p>
              <p className="text-[9px] text-white/50">Mã hoá đầu cuối</p>
            </div>
          </div>
          <div className="rp-float-b absolute bottom-32 right-20 hidden w-40 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/60 backdrop-blur-md lg:block">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 8l3 3 7-7" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-bold text-white">Mật khẩu mới</p>
                <p className="text-[8px] text-white/40">An toàn 100%</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full bg-gradient-to-r from-purple-400 to-sky-400" />
              ))}
            </div>
          </div>
        </div>

        {/* ── Main centered card ── */}
        <div className="relative z-10 flex w-full items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="rp-fade-up mb-8 flex flex-col items-center gap-3">
              <div className="rp-glow flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500">
                <img src="/ticketrush.png" alt="TicketRush" className="h-7 w-7 object-contain" />
              </div>
              <p className="text-sm font-extrabold tracking-[0.2em] text-white">
                TICKET<span className="text-purple-400">RUSH</span>
              </p>
            </div>

            {/* Card */}
            <div className={`rp-fade-up rp-d-100 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 ${shake ? 'rp-shake' : ''}`}
              style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(24px)' }}>

              {/* Card header gradient bar */}
              <div className="rp-hero-gradient h-1 w-full" />

              <div className="p-8">
                {/* Header */}
                <div className="rp-fade-up rp-d-200 mb-6 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 ring-1 ring-purple-400/20">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      <circle cx="12" cy="16" r="1" />
                    </svg>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-purple-400">Bảo mật</p>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Tạo mật khẩu mới</h1>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      Chọn mật khẩu mạnh để bảo vệ tài khoản của bạn.
                    </p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rp-fade-up mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" stroke="currentColor" strokeWidth="1.7">
                      <circle cx="8" cy="8" r="6.5" /><path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Password */}
                  <div className="rp-fade-up rp-d-300">
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError('') }}
                        placeholder="Tối thiểu 8 ký tự"
                        required autoFocus
                        className="rp-input"
                      />
                      <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300">
                        <EyeIcon show={showPw} />
                      </button>
                    </div>

                    {/* Strength meter */}
                    {password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex flex-1 gap-1">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                              <div className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: strength >= i ? '100%' : '0%',
                                  backgroundColor: STR_COLOR[strength],
                                }} />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold tabular-nums" style={{ color: STR_COLOR[strength] }}>
                          {STR_LABEL[strength]}
                        </span>
                      </div>
                    )}

                    {/* Checklist */}
                    {password && (
                      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                        {[
                          { ok: checks.len, label: 'Tối thiểu 8 ký tự' },
                          { ok: checks.case, label: 'Hoa & thường' },
                          { ok: checks.digit, label: 'Có chữ số' },
                          { ok: checks.special, label: 'Ký tự đặc biệt' },
                        ].map((c, i) => (
                          <div key={i} className={`flex items-center gap-1.5 text-[10px] transition ${c.ok ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <div className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full transition ${c.ok ? 'bg-emerald-400/20' : 'bg-white/8'}`}>
                              {c.ok ? (
                                <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                  <path d="M3 8l3 3 7-7" />
                                </svg>
                              ) : (
                                <span className="h-1 w-1 rounded-full bg-slate-600" />
                              )}
                            </div>
                            {c.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div className="rp-fade-up rp-d-400">
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showCpw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                        placeholder="Nhập lại mật khẩu mới"
                        required
                        className={`rp-input ${cpwMismatch ? 'err' : ''}`}
                      />
                      <button type="button" tabIndex={-1} onClick={() => setShowCpw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300">
                        <EyeIcon show={showCpw} />
                      </button>
                    </div>
                    {cpwMismatch && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400">
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l10 10M13 3L3 13" /></svg>
                        Mật khẩu chưa khớp
                      </p>
                    )}
                    {confirmPassword && !cpwMismatch && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-400">
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Mật khẩu khớp
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="rp-fade-up rp-d-500 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0"
                      style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1, #0ea5e9)', backgroundSize: '200% 100%', animation: loading ? 'none' : 'rpShimmer 4s ease infinite' }}
                    >
                      {loading ? (
                        <>
                          <svg className="h-4 w-4" style={{ animation: 'rpSpin 0.8s linear infinite' }}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" />
                          </svg>
                          Đang cập nhật…
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8l3 3 7-7" />
                          </svg>
                          Đặt lại mật khẩu
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Back link */}
            <div className="rp-fade-up rp-d-500 mt-6 text-center">
              <Link to="/"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-300">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M13 8H3M7 4L3 8l4 4" />
                </svg>
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>

        {/* ── Ticker bottom ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-slate-800/60 bg-slate-900/70 py-3 backdrop-blur-md">
          <div className="rp-ticker-track" style={{ animationDirection: 'reverse' }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                <span className="h-1 w-1 rounded-full bg-indigo-500" />{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword