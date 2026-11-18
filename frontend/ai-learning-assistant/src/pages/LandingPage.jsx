import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Layers3,
  Menu,
  Puzzle,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Document Chat',
    description:
      'Ask questions directly about your uploaded material and get clear, cited answers in seconds.',
    badge: 'bg-[#EAF2F2] text-[#3D7F87]',
  },
  {
    icon: Sparkles,
    title: 'AI Summaries',
    description:
      'Turn dense chapters and lecture slides into concise, structured outlines built for retention.',
    badge: 'bg-[#EEF6F0] text-[#5C9468]',
  },
  {
    icon: Layers3,
    title: 'Smart Flashcards',
    description:
      'Automatically extract key terms and concepts into ready-to-review decks with one click.',
    badge: 'bg-[#F9EEF2] text-[#BD6482]',
  },
  {
    icon: Puzzle,
    title: 'Adaptive Quizzes',
    description:
      'Test your comprehension with custom practice questions tailored to your weak spots.',
    badge: 'bg-[#F1EFF9] text-[#8170B2]',
  },
]

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload your material',
    description: 'Drop in PDFs, lecture notes, textbooks, or slides in seconds.',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Let AI process it',
    description: 'Get instant summaries, flashcards, and practice quizzes generated automatically.',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Study and track progress',
    description: 'Review actively, measure mastery, and know exactly what to focus on next.',
  },
]

const previewTabs = [
  { id: 'summary', label: 'Summary', icon: Sparkles },
  { id: 'chat', label: 'Doc Chat', icon: FileText },
  { id: 'cards', label: 'Flashcards', icon: Layers3 },
]

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('summary')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className='min-h-screen bg-[#F9FBFB] text-[#17232B] antialiased selection:bg-[#4F9DA6]/20 selection:text-[#2E6970]'>
      {/* Sticky Header */}
      <header className='sticky top-0 z-40 border-b border-[#E3ECEE] bg-white/90 backdrop-blur-md'>
        <nav
          className='mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8'
          aria-label='Main navigation'
        >
          <Link
            to='/'
            className='flex items-center gap-2.5 font-bold tracking-tight text-[#17232B]'
            aria-label='AI Learning Assistant home'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F9DA6] text-white shadow-sm shadow-[#4F9DA6]/25'>
              <BrainCircuit size={20} strokeWidth={2} />
            </span>
            <span className='text-sm sm:text-base'>AI Learning Assistant</span>
          </Link>

          <div className='hidden items-center gap-8 text-sm font-medium text-[#5D6E73] md:flex'>
            <a href='#features' className='transition-colors duration-200 hover:text-[#4F9DA6]'>
              Features
            </a>
            <a href='#how-it-works' className='transition-colors duration-200 hover:text-[#4F9DA6]'>
              How It Works
            </a>
            <a href='#about' className='transition-colors duration-200 hover:text-[#4F9DA6]'>
              Get Started
            </a>
          </div>

          <div className='hidden items-center gap-3 sm:flex'>
            <Link
              to='/login'
              className='rounded-lg px-3.5 py-2 text-sm font-semibold text-[#334449] transition-colors duration-200 hover:bg-[#EAF2F2] hover:text-[#3D7F87]'
            >
              Sign in
            </Link>
            <Link
              to='/register'
              className='rounded-lg bg-[#4F9DA6] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#4F9DA6]/20 transition-all duration-200 hover:bg-[#3E848C]'
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className='inline-flex items-center justify-center rounded-lg p-2 text-[#9CB0B4] transition-colors duration-200 hover:bg-[#EAF2F2] hover:text-[#4F9DA6] focus:outline-none sm:hidden'
            aria-label='Toggle menu'
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </nav>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className='border-t border-[#E3ECEE] bg-white px-5 py-4 sm:hidden'>
            <div className='flex flex-col gap-3 text-sm font-medium text-[#5D6E73]'>
              <a
                href='#features'
                onClick={() => setMobileMenuOpen(false)}
                className='py-1 transition-colors duration-200 hover:text-[#4F9DA6]'
              >
                Features
              </a>
              <a
                href='#how-it-works'
                onClick={() => setMobileMenuOpen(false)}
                className='py-1 transition-colors duration-200 hover:text-[#4F9DA6]'
              >
                How It Works
              </a>
              <div className='mt-2 flex flex-col gap-2 border-t border-[#EAF2F2] pt-3'>
                <Link
                  to='/login'
                  className='rounded-lg border border-[#D4E2E4] py-2.5 text-center text-sm font-semibold text-[#17232B] transition-colors duration-200 hover:border-[#4F9DA6] hover:text-[#4F9DA6]'
                >
                  Sign in
                </Link>
                <Link
                  to='/register'
                  className='rounded-lg bg-[#4F9DA6] py-2.5 text-center text-sm font-bold text-white transition-colors duration-200 hover:bg-[#3E848C]'
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className='relative overflow-hidden border-b border-[#E3ECEE] bg-gradient-to-b from-white to-[#F2F7F8]'>
          <div className='mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:pb-24 lg:pt-20'>
            <div className='max-w-xl'>
              <span className='inline-flex items-center gap-2 rounded-full border border-[#CBE0E2] bg-[#EAF2F2] px-3.5 py-1.5 text-xs font-bold text-[#3D7F87]'>
                <span className='h-1.5 w-1.5 rounded-full bg-[#4F9DA6]' />
                AI-powered study workspace
              </span>

              <h1 className='mt-5 text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-[#17232B] sm:text-5xl lg:text-[56px]'>
                Study smarter.
                <span className='block text-[#4F9DA6]'>Learn faster.</span>
              </h1>

              <p className='mt-5 max-w-lg text-base leading-7 text-[#5D6E73]'>
                Turn your notes, PDFs, and textbooks into an interactive study session with instant AI summaries, document chat, flashcards, and quizzes.
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-3.5'>
                <Link
                  to='/register'
                  className='inline-flex items-center gap-2 rounded-xl bg-[#4F9DA6] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#4F9DA6]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3E848C]'
                >
                  Start learning free <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <a
                  href='#how-it-works'
                  className='rounded-xl border border-[#D4E2E4] bg-white px-5 py-3.5 text-sm font-bold text-[#334449] transition-colors duration-200 hover:border-[#4F9DA6] hover:text-[#3D7F87]'
                >
                  See how it works
                </a>
              </div>

              <div className='mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#6B7E83]'>
                <span className='inline-flex items-center gap-1.5'>
                  <CheckCircle2 size={15} strokeWidth={2} className='text-[#4F9DA6]' /> Free to get started
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <CheckCircle2 size={15} strokeWidth={2} className='text-[#4F9DA6]' /> PDF, DOCX &amp; notes support
                </span>
              </div>
            </div>

            {/* Interactive Product Preview */}
            <div className='relative mx-auto w-full max-w-[540px] lg:ml-auto'>
              <div className='absolute -inset-4 rounded-[28px] bg-gradient-to-tr from-[#4F9DA6]/12 via-[#EAF2F2] to-transparent blur-xl' />

              <div className='relative rounded-2xl border border-[#DCE7E9] bg-white p-3.5 shadow-[0_24px_60px_-20px_rgba(23,35,43,0.14)] sm:p-5'>
                {/* Window Bar */}
                <div className='flex items-center justify-between border-b border-[#ECF2F3] pb-3'>
                  <div className='flex items-center gap-1.5'>
                    <span className='h-2.5 w-2.5 rounded-full bg-[#9CB0B4]/60' />
                    <span className='h-2.5 w-2.5 rounded-full bg-[#9CB0B4]/60' />
                    <span className='h-2.5 w-2.5 rounded-full bg-[#9CB0B4]/60' />
                  </div>
                  <span className='rounded-md bg-[#F4F8F8] px-3 py-1 text-[11px] font-semibold text-[#5D6E73]'>
                    Biology — Cell Structure.pdf
                  </span>
                  <span className='rounded-full bg-[#EAF2F2] px-2.5 py-0.5 text-[10px] font-bold text-[#3D7F87]'>
                    AI Ready
                  </span>
                </div>

                {/* Interactive Mode Switcher */}
                <div className='mt-3.5 flex gap-1.5 rounded-xl bg-[#F2F7F8] p-1'>
                  {previewTabs.map(({ id, label, icon: TabIcon }) => {
                    const isActive = activeTab === id
                    return (
                      <button
                        key={id}
                        type='button'
                        onClick={() => setActiveTab(id)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all duration-200 focus:outline-none ${
                          isActive
                            ? 'bg-white text-[#3D7F87] shadow-sm'
                            : 'text-[#6B7E83] hover:text-[#4F9DA6]'
                        }`}
                      >
                        <TabIcon size={13} strokeWidth={2} />
                        {label}
                      </button>
                    )
                  })}
                </div>

                {/* Dynamic Tab Content */}
                <div className='mt-4 min-h-[215px]'>
                  {activeTab === 'summary' && (
                    <div className='space-y-3'>
                      <div className='rounded-xl border border-[#D4E5E7] bg-[#F4F9F9] p-4'>
                        <p className='text-xs font-bold text-[#3D7F87]'>Key Takeaways</p>
                        <ul className='mt-2.5 space-y-2 text-xs leading-5 text-[#334449]'>
                          <li className='flex items-start gap-2'>
                            <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4F9DA6]' />
                            <span>
                              <strong>Plasma Membrane:</strong> Selectively permeable lipid bilayer regulating transport.
                            </span>
                          </li>
                          <li className='flex items-start gap-2'>
                            <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4F9DA6]' />
                            <span>
                              <strong>Mitochondria:</strong> Generates cellular ATP through aerobic respiration.
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className='flex items-center justify-between rounded-xl border border-[#E6EFF0] bg-[#F9FBFB] px-4 py-3 text-xs'>
                        <span className='font-medium text-[#5D6E73]'>Reading time reduced by 72%</span>
                        <span className='font-bold text-[#3D7F87]'>12 concepts extracted</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'chat' && (
                    <div className='space-y-3'>
                      <div className='ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#4F9DA6] px-3.5 py-2.5 text-xs font-medium text-white'>
                        What is the main role of the cell membrane?
                      </div>
                      <div className='rounded-2xl rounded-bl-sm border border-[#E3ECEE] bg-[#F6FAFA] p-3.5 text-xs leading-5 text-[#2D3B42]'>
                        <p>
                          It acts as a selective barrier that controls which ions and molecules enter or exit the cell, maintaining homeostasis.
                        </p>
                        <span className='mt-2 inline-block rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#3D7F87] shadow-2xs'>
                          Source: Page 4, Section 2.1
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'cards' && (
                    <div className='flex h-[200px] flex-col justify-between rounded-xl border border-[#E3ECEE] bg-gradient-to-br from-white to-[#F2F7F8] p-5'>
                      <div className='flex items-center justify-between text-[11px] font-bold text-[#9CB0B4]'>
                        <span>CARD 01 / 12</span>
                        <span className='rounded-md bg-[#F1EFF9] px-2 py-0.5 text-[#8170B2]'>Biology</span>
                      </div>
                      <div className='my-auto text-center'>
                        <p className='text-[11px] font-semibold uppercase tracking-wider text-[#4F9DA6]'>Concept</p>
                        <p className='mt-1.5 text-base font-bold text-[#17232B]'>
                          Selective Permeability
                        </p>
                        <p className='mt-2 text-xs text-[#5D6E73]'>
                          Allows certain molecules to pass through the membrane while blocking others.
                        </p>
                      </div>
                      <div className='h-1.5 w-full overflow-hidden rounded-full bg-[#E3ECEE]'>
                        <div className='h-full w-1/3 rounded-full bg-[#4F9DA6]' />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Status Badges */}
              <div className='absolute -bottom-4 -left-3 hidden items-center gap-2.5 rounded-xl border border-[#E3ECEE] bg-white px-3.5 py-2.5 shadow-lg shadow-[#17232B]/5 sm:flex'>
                <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2F2] text-[#3D7F87]'>
                  <Sparkles size={15} strokeWidth={2} />
                </span>
                <div>
                  <span className='block text-xs font-bold text-[#17232B]'>Study guide ready</span>
                  <span className='text-[11px] text-[#6B7E83]'>Generated in 4 seconds</span>
                </div>
              </div>

              <div className='absolute -right-3 top-12 hidden items-center gap-2.5 rounded-xl border border-[#E3ECEE] bg-white px-3.5 py-2.5 shadow-lg shadow-[#17232B]/5 sm:flex'>
                <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1EFF9] text-[#8170B2]'>
                  <BookOpenCheck size={15} strokeWidth={2} />
                </span>
                <div>
                  <span className='block text-xs font-bold text-[#17232B]'>Quiz score: 92%</span>
                  <span className='text-[11px] text-[#6B7E83]'>+18% from last session</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='scroll-mt-16 px-5 py-16 sm:px-8 sm:py-20'>
          <div className='mx-auto max-w-6xl'>
            <div className='text-center'>
              <p className='text-xs font-extrabold uppercase tracking-[0.16em] text-[#4F9DA6]'>Features</p>
              <h2 className='mt-2.5 text-2xl font-extrabold tracking-tight text-[#17232B] sm:text-3xl'>
                Everything you need to learn faster
              </h2>
              <p className='mx-auto mt-3 max-w-lg text-sm leading-6 text-[#5D6E73]'>
                One unified workspace to turn passive reading into active recall.
              </p>
            </div>

            <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
              {features.map(({ icon: Icon, title, description, badge }) => (
                <article
                  key={title}
                  className='group rounded-2xl border border-[#E3ECEE] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#BFD5D8] hover:shadow-lg hover:shadow-[#17232B]/5'
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${badge}`}>
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className='mt-5 text-base font-bold text-[#17232B] transition-colors duration-200 group-hover:text-[#3D7F87]'>
                    {title}
                  </h3>
                  <p className='mt-2 text-sm leading-6 text-[#5D6E73]'>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id='how-it-works' className='scroll-mt-16 border-y border-[#E3ECEE] bg-white px-5 py-16 sm:px-8 sm:py-20'>
          <div className='mx-auto max-w-5xl'>
            <div className='text-center'>
              <p className='text-xs font-extrabold uppercase tracking-[0.16em] text-[#4F9DA6]'>How it works</p>
              <h2 className='mt-2.5 text-2xl font-extrabold tracking-tight text-[#17232B] sm:text-3xl'>
                Three steps to better retention
              </h2>
            </div>

            <div className='mt-10 grid gap-6 md:grid-cols-3'>
              {steps.map(({ step, icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className='relative rounded-2xl border border-[#E3ECEE] bg-[#F9FBFB] p-6 text-center'
                >
                  <span className='inline-block rounded-full bg-[#EAF2F2] px-2.5 py-0.5 text-[11px] font-extrabold text-[#3D7F87]'>
                    Step {step}
                  </span>
                  <span className='mx-auto mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4F9DA6] text-white shadow-sm shadow-[#4F9DA6]/20'>
                    <Icon size={19} strokeWidth={2} />
                  </span>
                  <h3 className='mt-4 text-base font-bold text-[#17232B]'>{title}</h3>
                  <p className='mx-auto mt-2 max-w-[240px] text-sm leading-6 text-[#5D6E73]'>
                    {description}
                  </p>

                  {index < steps.length - 1 && (
                    <span className='absolute -right-3.5 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#E3ECEE] bg-white text-[#9CB0B4] shadow-2xs md:flex'>
                      <ArrowRight size={13} strokeWidth={2} />
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section id='about' className='scroll-mt-16 px-5 py-14 sm:px-8 sm:py-16'>
          <div className='mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#4F9DA6] to-[#3B7D85] px-6 py-12 text-center text-white shadow-xl shadow-[#4F9DA6]/15 sm:px-12'>
            <h2 className='text-2xl font-extrabold tracking-tight sm:text-3xl'>
              Ready to study smarter?
            </h2>
            <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-white/90'>
              Upload your first document and turn hours of reading into focused, interactive learning.
            </p>
            <div className='mt-7 flex flex-wrap justify-center gap-3'>
              <Link
                to='/register'
                className='inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#3D7F87] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F2F7F8]'
              >
                Get Started — It&apos;s Free <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link
                to='/login'
                className='rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition-colors duration-200 hover:bg-white/20'
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-[#E3ECEE] bg-white px-5 py-8 sm:px-8'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-[#6B7E83] sm:flex-row'>
          <div className='flex items-center gap-2 font-bold text-[#17232B]'>
            <span className='flex h-6 w-6 items-center justify-center rounded-md bg-[#4F9DA6] text-white'>
              <BrainCircuit size={14} strokeWidth={2} />
            </span>
            <span>AI Learning Assistant</span>
          </div>
          <p>© {new Date().getFullYear()} AI Learning Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage