import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BrainCircuit, Lock } from 'lucide-react'
import authService from '../../services/authService'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Your password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      setResetComplete(true)
    } catch (requestError) {
      setError(requestError.error || requestError.message || 'Could not reset your password. Please request a new link.')
    } finally {
      setLoading(false)
    }
  }

  const invalidLink = !token

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-[#F7FAFB] via-white to-[#EAF2F2] px-4 py-10'>
      <div className='absolute inset-0 bg-[radial-gradient(#DCE6E8_1px,transparent_1px)] bg-size-[16px_16px] opacity-40' />
      <main className='relative w-full max-w-md'>
        <div className='rounded-3xl border border-[#DCE6E8] bg-white/90 p-8 shadow-xl shadow-[#4F9DA6]/10 backdrop-blur-xl sm:p-10'>
          <div className='mb-8 text-center'>
            <div className='mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#4F9DA6] to-[#3D7F87] text-white shadow-lg shadow-[#4F9DA6]/25'>
              <BrainCircuit className='h-7 w-7' strokeWidth={2} />
            </div>
            <h1 className='text-2xl font-semibold tracking-tight text-[#2A3439]'>
              {resetComplete ? 'Password updated' : invalidLink ? 'Reset link is missing' : 'Create a new password'}
            </h1>
            <p className='mt-2 text-sm leading-6 text-[#647278]'>
              {resetComplete
                ? 'Your password has been changed. Sign in with your new password.'
                : invalidLink
                  ? 'This reset link is incomplete. Request a new link to continue.'
                  : 'Choose a new password with at least 6 characters.'}
            </p>
          </div>

          {resetComplete || invalidLink ? (
            <Link
              to={resetComplete ? '/login' : '/forgot-password'}
              className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#4F9DA6] to-[#3D7F87] text-sm font-semibold text-white shadow-lg shadow-[#4F9DA6]/20 transition hover:from-[#468D95] hover:to-[#356E75]'
            >
              {resetComplete ? 'Go to sign in' : 'Request a new link'} <ArrowRight size={16} />
            </Link>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-2'>
                <label htmlFor='password' className='block text-xs font-semibold uppercase tracking-wide text-[#2A3439]'>New password</label>
                <div className='relative'>
                  <Lock className='absolute inset-y-0 left-4 my-auto h-5 w-5 text-[#9CB0B4]' />
                  <input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    autoComplete='new-password'
                    className='h-12 w-full rounded-xl border-2 border-[#DCE6E8] bg-[#F7FAFB]/70 pl-12 pr-4 text-sm font-medium text-[#2A3439] transition-all focus:border-[#4F9DA6] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#4F9DA6]/10'
                    placeholder='At least 6 characters'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='confirm-password' className='block text-xs font-semibold uppercase tracking-wide text-[#2A3439]'>Confirm new password</label>
                <div className='relative'>
                  <Lock className='absolute inset-y-0 left-4 my-auto h-5 w-5 text-[#9CB0B4]' />
                  <input
                    id='confirm-password'
                    type='password'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    minLength={6}
                    autoComplete='new-password'
                    className='h-12 w-full rounded-xl border-2 border-[#DCE6E8] bg-[#F7FAFB]/70 pl-12 pr-4 text-sm font-medium text-[#2A3439] transition-all focus:border-[#4F9DA6] focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-[#4F9DA6]/10'
                    placeholder='Re-enter your new password'
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
                {loading ? 'Updating password...' : <>Reset password <ArrowRight size={16} /></>}
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

export default ResetPasswordPage
