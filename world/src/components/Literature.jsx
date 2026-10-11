import React, {useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, BookOpen, Feather, Maximize2, Minimize2} from 'lucide-react';
import './literature.css';

const poems = [
  {
    id: 'are-we-even-friends',
    title: 'Are we even friends?',
    date: '23 December 2024',
    dateTime: '2024-12-23',
    stanzas: [
      ['I ignite the words, I set the flame,', 'Without my sparks, it’s all same.', 'A silence grows, a chasm wide,', 'Are you even on other side?'],
      ['I wanted to say, yet stayed,', 'Silent and lost—with thoughts delayed.'],
      ['Or is it me, alone, who tends,', 'This fragile tie—Are we even friends?'],
      ['Am I the moon chasing sun?', 'Longing for light but finding none.'],
      ['I held my words, I yearned to speak,', 'A thousand thoughts I couldn’t unleash,', 'A language unspoken, in shadow it keeps,', 'Whispered in silence, where meaning sleep!'],
    ],
  },
  {
    id: 'a-faithful-goodbye',
    title: 'A faithful goodbye',
    stanzas: [
      ['The dread in my eyes,', 'the misery I wrap in embellished lies,', 'will they be kind enough to bless me', 'with a faithful goodbye?'],
      ['I’ve carried storms with a steady spine,', 'danced with demons and called it mine.', 'Not every scar is meant to be shown,', 'some are crowns I wear alone.'],
      ["I don't seek rescue, I don’t need cheers—", 'I’ve made peace with both hope and fears.', "My strength isn't loud, but it doesn’t bend,", "I stand as I am — I don't need to pretend."],
      ['Don’t look at me with pity’s shade,', 'I chose each silence that I made.', 'But if there’s grace in how we part,', 'let it not be with an empty heart.'],
      ['So when I leave, don’t ask me why—', 'just meet my soul, not with a cry,', 'but with eyes that see, with hearts that try,', 'and bless me, once, with a faithful goodbye....!'],
    ],
    clovers: true,
  },
];

const sections = [
  {id: 'poetry', label: 'Poetry'},
  {id: 'prose', label: 'Prose & reflections'},
  {id: 'reading', label: 'Reading notes'},
];

export default function Literature() {
  const [section, setSection] = useState('poetry');
  const [selected, setSelected] = useState(0);
  const [focused, setFocused] = useState(false);
  const poemHeading = useRef(null);
  const poem = poems[selected];

  const selectPoem = (index) => {
    setSelected(index);
    requestAnimationFrame(() => {
      const heading = poemHeading.current;
      if (!heading) return;
      heading.focus({preventScroll: true});
      const readingArea = heading.closest('.lit-reading-area');
      const scroller = heading.closest('.window-content');
      if (!readingArea || !scroller) return;
      const top = scroller.scrollTop + readingArea.getBoundingClientRect().top - scroller.getBoundingClientRect().top - scroller.clientTop;
      scroller.scrollTo({top: Math.max(0, top), behavior: 'instant'});
    });
  };

  return (
    <div className={`lit-app${focused && section === 'poetry' ? ' lit-focused' : ''}`}>
      <div className="lit-top">
        <div className="lit-identity">
          <span className="lit-mark" aria-hidden="true"><BookOpen size={21} strokeWidth={1.35}/></span>
          <div><span className="lit-overline">THE PERSONAL SHELF</span><h1>Literature & Poetry</h1></div>
        </div>
        {section === 'poetry' && <button className="lit-focus-button" aria-pressed={focused} aria-label={focused ? 'Exit focus mode and show poem library' : 'Enter focus mode'} title={focused ? 'Show library' : 'Focus mode'} onClick={() => setFocused(value => !value)}>
          {focused ? <Minimize2 size={15}/> : <Maximize2 size={15}/>}
          <span>{focused ? 'Show library' : 'Focus mode'}</span>
        </button>}
      </div>

      {!focused && <nav className="lit-tabs" aria-label="Literature sections">
        {sections.map(item => <button key={item.id} className={section === item.id ? 'lit-tab-active' : ''} aria-current={section === item.id ? 'page' : undefined} onClick={() => setSection(item.id)}>
          {item.label}{item.id === 'poetry' && <span className="lit-tab-count">{poems.length}</span>}
        </button>)}
      </nav>}

      {section === 'poetry' ? <div className="lit-layout">
        {!focused && <aside className="lit-library" aria-label="Poem library">
          <div className="lit-library-heading"><span>POEMS</span><span>01—02</span></div>
          <div className="lit-poem-list">
            {poems.map((item, index) => <button key={item.id} className={`lit-poem-choice${selected === index ? ' lit-choice-active' : ''}`} onClick={() => selectPoem(index)} aria-current={selected === index ? 'true' : undefined}>
              <span className="lit-poem-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="lit-poem-choice-text"><strong>{item.title}</strong><small>{item.date || 'By Manav'}</small></span>
              <ArrowRight className="lit-choice-arrow" size={14} aria-hidden="true"/>
            </button>)}
          </div>
          <div className="lit-library-note"><Feather size={18} strokeWidth={1.2} aria-hidden="true"/><p>A quieter corner of my world.<br/>For words that linger.</p></div>
        </aside>}

        <div className="lit-reading-area">
          <article className="lit-poem" aria-labelledby={`lit-title-${poem.id}`}>
            <div className="lit-poem-meta"><span>POEM {String(selected + 1).padStart(2, '0')}</span>{poem.date && <time dateTime={poem.dateTime}>{poem.date}</time>}</div>
            <h2 id={`lit-title-${poem.id}`} className="lit-poem-title" tabIndex={-1} ref={poemHeading}>{poem.title}</h2>
            <div className="lit-rule" aria-hidden="true"/>
            <div className="lit-verses">
              {poem.stanzas.map((lines, index) => <p key={index}>{lines.map((line, lineIndex) => <span key={lineIndex}>{line}{lineIndex < lines.length - 1 && <br/>}</span>)}</p>)}
              {poem.clovers && <div className="lit-clovers" aria-label="Five four-leaf clovers">🍀 🍀 🍀 🍀 🍀</div>}
            </div>
            <footer className="lit-signature">— Manav</footer>
          </article>

          <nav className="lit-reader-navigation" aria-label="Poem navigation">
            <button disabled={selected === 0} onClick={() => selectPoem(selected - 1)}><ArrowLeft size={15}/><span>Previous</span></button>
            <span>{String(selected + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(poems.length).padStart(2, '0')}</span>
            <button disabled={selected === poems.length - 1} onClick={() => selectPoem(selected + 1)}><span>Next poem</span><ArrowRight size={15}/></button>
          </nav>
          <span className="lit-screen-reader" role="status">Reading {poem.title}, poem {selected + 1} of {poems.length}.</span>
        </div>
      </div> : <div className="lit-empty">
        {section === 'prose' ? <Feather size={28} strokeWidth={1.2} aria-hidden="true"/> : <BookOpen size={28} strokeWidth={1.2} aria-hidden="true"/>}
        <span className="lit-overline">{section === 'prose' ? 'PROSE & REFLECTIONS' : 'READING NOTES'}</span>
        <h2>{section === 'prose' ? 'A place for longer thoughts.' : 'The bookshelf is waiting.'}</h2>
        <p>{section === 'prose' ? 'Personal essays, stories, and reflections will find a home here.' : 'Favourite books, passages, and the ideas they leave behind.'}</p>
        <span className="lit-empty-note">Coming soon, in my own words.</span>
      </div>}
    </div>
  );
}
