import { useState, useEffect } from 'react'

interface Letter {
  id: string
  content: string
  author: string
  location: string
  date: string
  isPublic: boolean
}

const sampleLetters: Letter[] = [
  {
    id: '1',
    content: "Dear Me,\n\nIt's been one of those days where everything feels heavier than it should. The world outside was so bright and loud today, but inside, it felt so quiet. Too quiet.\n\nI don't know why, but I kept thinking about Dad. It's been so many years since he passed, yet days like today, the memories feel so fresh it hurts. I was only eight when he died, but I remember the way he used to lift me up like I weighed nothing. I remember sitting on his shoulders while he pointed out constellations, telling me stories about each one as if he had named them himself.\n\nI miss that. Not just him, but the feeling of being someone's little universe.\n\nAfter he passed, everything changed so quickly. Mom couldn't handle it... or maybe she didn't want to. I don't know anymore. She left, and it was just me and Grandma and Grandpa. They did their best, I know they did, but there's always been this quiet space in me that no one ever filled again.",
    author: 'Lora Wilson',
    location: 'Australia',
    date: 'Sunday, 12th May, 2025',
    isPublic: true
  },
  {
    id: '2',
    content: "Dear Universe,\n\nTonight the stars feel closer somehow. I walked home through the park and stopped to just... breathe. When did breathing become something I had to remind myself to do?\n\nWork has been relentless. Everyone wants a piece of me, but I'm not sure there's much left to give. I keep showing up, smiling, being the person they need me to be. But who am I when no one's watching?\n\nI found an old photo today. Me at seven, covered in mud, grinning like the world was made of magic. I want to find her again. That wild, fearless girl who believed anything was possible.\n\nMaybe tomorrow I'll try something new. Something small. Like saying no when I mean no.",
    author: 'Sarah Chen',
    location: 'Vancouver',
    date: 'Friday, Jun 21',
    isPublic: true
  },
  {
    id: '3',
    content: "To whoever reads this,\n\nI made coffee for two people today. Force of habit after three years. She's been gone for six months now, and my hands still don't know it.\n\nThe apartment feels too big. Her books are still on the shelf. I can't bring myself to move them. Sometimes I talk to them, pretending she'll walk in any moment and laugh at me for being so sentimental.\n\nGrief is strange. It's not the big moments that break you. It's the small ones. The empty chair. The silence where her laugh used to be.\n\nBut today I also noticed the sunset. Really noticed it. Orange and pink bleeding into purple. She would have loved it. Maybe that's enough for now.",
    author: 'Marcus',
    location: 'Berlin',
    date: 'Thursday, Jun 19',
    isPublic: true
  },
  {
    id: '4',
    content: "Dear Future Me,\n\nI hope you're reading this and smiling. I hope you figured out what you want to be. I hope you stopped apologizing for taking up space.\n\nToday was hard. I failed the exam I studied weeks for. Everyone keeps telling me it's okay, that I can try again, but the disappointment in my own eyes is the hardest to face.\n\nI'm learning that failure isn't the opposite of success. It's part of the journey. At least that's what I keep telling myself.\n\nRemember: you are more than your worst day. You are more than one test, one mistake, one moment.\n\nBe gentle with yourself. Please.",
    author: 'Anonymous',
    location: 'Tokyo',
    date: 'Wednesday, Jun 18',
    isPublic: true
  }
]

type View = 'home' | 'write' | 'read' | 'browse'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [userName, setUserName] = useState('')
  const [dayCount, setDayCount] = useState(1)
  const [letters, setLetters] = useState<Letter[]>([])
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [newLetter, setNewLetter] = useState('')
  const [hasWrittenToday, setHasWrittenToday] = useState(false)
  const [isSetup, setIsSetup] = useState(false)
  const [tempName, setTempName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('nightlyLetters')
    if (saved) {
      const data = JSON.parse(saved)
      setUserName(data.userName || '')
      setDayCount(data.dayCount || 1)
      setLetters(data.letters || [])
      setHasWrittenToday(data.lastWriteDate === new Date().toDateString())
      setIsSetup(!!data.userName)
    }
  }, [])

  useEffect(() => {
    if (isSetup) {
      localStorage.setItem('nightlyLetters', JSON.stringify({
        userName,
        dayCount,
        letters,
        lastWriteDate: hasWrittenToday ? new Date().toDateString() : null
      }))
    }
  }, [userName, dayCount, letters, hasWrittenToday, isSetup])

  const handleSetup = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim())
      setIsSetup(true)
    }
  }

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  const handleSubmitLetter = (isPublic: boolean) => {
    if (newLetter.trim()) {
      const letter: Letter = {
        id: Date.now().toString(),
        content: newLetter,
        author: userName,
        location: 'Your Location',
        date: getCurrentDate(),
        isPublic
      }
      setLetters([letter, ...letters])
      setHasWrittenToday(true)
      setDayCount(dayCount + 1)
      setNewLetter('')
      setView('home')
    }
  }

  const allLetters = [...letters.filter(l => l.isPublic), ...sampleLetters]

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-ink/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-ink/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl text-ink mb-2">Nightly Letters</h1>
            <p className="text-muted font-light">One letter each night. A world of stories.</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl font-sans text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink/30 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
            />
            <button
              onClick={handleSetup}
              disabled={!tempName.trim()}
              className="w-full py-3 bg-ink text-white rounded-xl font-sans font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink/90 transition-colors"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'write') {
    return (
      <div className="min-h-screen bg-paper">
        <header className="px-6 py-4 flex items-center justify-between border-b border-ink/5">
          <button onClick={() => setView('home')} className="text-muted hover:text-ink transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-sans text-sm text-muted">{getCurrentDate()}</span>
          <div className="w-6" />
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <h2 className="font-serif text-2xl text-ink mb-6">Dear Me,</h2>
          
          <textarea
            value={newLetter}
            onChange={(e) => setNewLetter(e.target.value)}
            placeholder="Write your thoughts for tonight..."
            className="w-full h-96 bg-transparent font-serif text-lg text-ink leading-relaxed placeholder:text-muted/40 focus:outline-none resize-none"
            autoFocus
          />

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => handleSubmitLetter(false)}
              disabled={!newLetter.trim()}
              className="flex-1 py-3 border border-ink/20 text-ink rounded-xl font-sans font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink/5 transition-colors"
            >
              Private
            </button>
            <button
              onClick={() => handleSubmitLetter(true)}
              disabled={!newLetter.trim()}
              className="flex-1 py-3 bg-ink text-white rounded-xl font-sans font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink/90 transition-colors"
            >
              Public
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'read') {
    const letter = allLetters[currentLetterIndex]
    return (
      <div className="min-h-screen bg-paper">
        <header className="px-6 py-4 flex items-center justify-between border-b border-ink/5">
          <button onClick={() => setView('home')} className="text-muted hover:text-ink transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-sans text-sm text-muted">Today's letters</span>
          <button onClick={() => setView('browse')} className="text-muted hover:text-ink transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="font-sans text-xs text-muted uppercase tracking-wider mb-2">{letter.date}</p>
          <h2 className="font-serif text-2xl text-ink mb-8">Dear Me,</h2>
          
          <div className="font-serif text-lg text-ink leading-relaxed whitespace-pre-line">
            {letter.content}
          </div>

          <div className="mt-12 pt-6 border-t border-ink/10 flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-ink">{letter.author}</p>
              <p className="font-sans text-xs text-muted">{letter.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentLetterIndex(Math.max(0, currentLetterIndex - 1))}
                disabled={currentLetterIndex === 0}
                className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center text-muted hover:text-ink hover:border-ink/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentLetterIndex(Math.min(allLetters.length - 1, currentLetterIndex + 1))}
                disabled={currentLetterIndex === allLetters.length - 1}
                className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center text-muted hover:text-ink hover:border-ink/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'browse') {
    return (
      <div className="min-h-screen bg-paper">
        <header className="px-6 py-4 flex items-center justify-between border-b border-ink/5">
          <button onClick={() => setView('read')} className="text-muted hover:text-ink transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-sans text-sm text-muted">All Letters</span>
          <div className="w-6" />
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {allLetters.map((letter, index) => (
              <button
                key={letter.id}
                onClick={() => {
                  setCurrentLetterIndex(index)
                  setView('read')
                }}
                className="w-full text-left p-4 bg-white rounded-xl border border-ink/5 hover:border-ink/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-sans text-sm font-medium text-ink">{letter.author}</span>
                  <span className="font-sans text-xs text-muted">{letter.date.split(',')[0]}</span>
                </div>
                <p className="font-serif text-muted line-clamp-2">
                  {letter.content.substring(0, 120)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-sans text-sm text-ink">Hey {userName}</p>
          <p className="font-sans text-xs text-muted">It's your {dayCount === 1 ? '1st' : dayCount === 2 ? '2nd' : dayCount === 3 ? '3rd' : `${dayCount}th`} day</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center">
          <svg className="w-5 h-5 text-ink/60" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="7" cy="7" r="2" />
            <circle cx="17" cy="7" r="2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
      </header>

      <main className="px-6 py-8">
        <p className="font-sans text-xs text-muted mb-2">{getCurrentDate()}</p>
        <h1 className="font-serif text-3xl text-ink mb-12">How was your day today?</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white to-ink/5 border border-ink/10 flex items-center justify-center"
            >
              <div className="w-12 h-8 bg-ink/10 rounded transform rotate-3" />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setView('read')}
            className="flex-1 py-4 border border-ink/20 rounded-xl font-sans font-medium text-ink hover:bg-ink/5 transition-colors"
          >
            Read Letters
          </button>
          <button
            onClick={() => setView('write')}
            disabled={hasWrittenToday}
            className="flex-1 py-4 bg-ink text-white rounded-xl font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink/90 transition-colors"
          >
            {hasWrittenToday ? 'Written Today' : 'Write Tonight'}
          </button>
        </div>

        {hasWrittenToday && (
          <p className="text-center text-sm text-muted mt-4">
            You've already shared your letter tonight. Come back tomorrow.
          </p>
        )}
      </main>
    </div>
  )
}