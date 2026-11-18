import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BrainCircuit, Mail, MailCheck } from 'lucide-react'
import authService from '../../services/authService'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (requestError) {
      setError(requestError.error || requestError.message || 'Could not send the reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-[#F7FAFB] via-white to-[#EAF2F2] px-4 py-10'>
      <div className='absolute inset-0 bg-[radial-gradient(#DCE6E8_1px,transparent_1px)] bg-size-[16px_16px] opacity-40' />
      <main className='relative w-full max-w-md'>
        <div className='rounded-3xl border border-[#DCE6E8] bg-white/90 p-8 shadow-xl shadow-[#4F9DA6]/10 backdrop-blur-xl sm:p-10'>
          <div className='mb-8 text-center'>
            <div className='mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#4F9DA6] to-[#3D7F87] text-white shadow-lg shadow-[#4F9DA6]/25'>
              <BrainCircuit className='h-7 w-7' strokeWidth={2} />
            </div>
            {sent ? (
              <>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2F2] text-[#3D7F87]'>
                  <MailCheck size={23} />
                </div>
                <h1 className='text-2xl font-semibold tracking-tight text-[#2A3439]'>Check your email</h1>
                <p className='mt-2 text-sm leading-6 text-[#647278]'>
                  If an account exists for <span className='font-semibold text-[#2A3439]'>{email}</span>, you&apos;ll receive a link to reset your password. The link expires in 10 minutes.
                </p>
              </>
            ) : (
              <>
                <h1 className='text-2xl font-semibold tracking-tight text-[#2A3439]'>Forgot your password?</h1>
                <p className='mt-2 text-sm leading-6 text-[#647278]'>Enter the email address linked to your account and we&apos;ll send you a reset link.</p>
              </>
            )}
          </div>

          {sent ? (
            <Link to='/login' className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#4F9DA6] to-[#3D7F87] text-sm font-semibold text-white shadow-lg shadow-[#4F9DA6]/20 transition hover:from-[#468D95] hover:to-[#356E75]'>
              Back to sign in <ArrowRight size={16} />
            </Link>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-2'>
                <label htmlFor='email' className='block text-xs font-semibold uppercase tracking-wide text-[#2A3439]'>Email</label>
                <div className='relative'>
                  <Mail className='absolute inset-y-0 left-4 my-auto h-5 w-5 text-[#9CB0B4]' />
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete='email'
                    className='h-12 w-full rounded-xl border-2 border-[#DCE6E8] bg-[#F7FAFB]/70 pl-12 pr-4 text-sm font-medium text-[#2A3439] transition-all focus:border-[#4F9DA6] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#4F9DA6]/10'
                    placeholder='you@example.com'
                  />
                </div>
              </div>

              {error && (
                <div role='alert' className='rounded-lg border border-[#F0CFC8] bg-[#FBEEEC] p-3'>
                  <p className='text-center text-xs font-medium text-[#B8543F]'>{error}</p>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#4F9DA6] to-[#3D7F87] text-sm font-semibold text-white shadow-lg shadow-[#4F9DA6]/20 transition hover:from-[#468D95] hover:to-[#356E75] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Sending link...' : <>Send reset link <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          <div className='mt-7 border-t border-[#DCE6E8] pt-5 text-center'>
            <Link to='/login' className='inline-flex items-center gap-2 text-sm font-semibold text-[#3D7F87] transition-colors hover:text-[#2E6167]'>
              <ArrowLeft size={15} /> Back to sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage
