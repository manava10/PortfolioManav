import React, { useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown,
  Database, FileText, Github, Layers3, Search, ShieldCheck,
  Sparkles, Utensils, Waypoints,
} from 'lucide-react';
import './projects.css';

const projects = [
  {
    id: 'foodfreaky',
    number: '01',
    title: 'FoodFreaky',
    category: 'A product for campus life',
    year: '2025',
    role: 'Co-founder · Backend & deployment',
    summary: 'Campus food delivery, from browsing and ordering to tracking and digital invoices.',
    detail: 'FoodFreaky helps college students browse food, place orders, follow their order status, and receive digital invoices. I co-founded the platform and owned backend development and production deployment.',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'DigitalOcean', 'Cloudflare', 'Netlify'],
    specifications: [
      ['Audience', 'Students ordering food within the college ecosystem.'],
      ['My contribution', 'Co-founded the platform; owned backend development and production deployment.'],
      ['Core features', 'Food browsing, order placement, order status tracking, digital invoices, and transactional email notifications.'],
      ['Backend', 'Node.js and Express.js services with MongoDB persistence.'],
      ['Access control', 'JWT authentication and role-based access for users and administrators.'],
      ['Deployment', 'DigitalOcean, Cloudflare, and Netlify.'],
    ],
    features: [
      { Icon: Utensils, title: 'From browsing to ordering', body: 'Food discovery and order placement within the college ecosystem.' },
      { Icon: FileText, title: 'A clear order journey', body: 'Order status, digital invoices, and transactional email notifications.' },
      { Icon: ShieldCheck, title: 'Access with a purpose', body: 'JWT authentication and role-based access for students and administrators.' },
    ],
  },
  {
    id: 'cida',
    number: '02',
    title: 'CIDA',
    fullTitle: 'Cloud Intelligent Document Assistant',
    category: 'An experiment in useful AI',
    year: '2025',
    role: 'Document retrieval & contextual AI',
    summary: 'Search, summarize, and ask contextual questions about uploaded documents.',
    detail: 'Cloud Intelligent Document Assistant makes uploaded documents easier to find and understand through search, summaries, and contextual question answering. Its retrieval pipeline supplies relevant document content to Google Gemini.',
    technologies: ['Python', 'FastAPI', 'RAG', 'Vector embeddings', 'Gemini API'],
    specifications: [
      ['Purpose', 'Make uploaded document content easier to find and understand.'],
      ['Core features', 'Document search, summaries, and contextual question answering.'],
      ['Retrieval pipeline', 'Document chunking, vector embeddings, and similarity-based retrieval supply relevant context to the model.'],
      ['Response generation', 'Google Gemini API generates answers grounded in retrieved document content.'],
      ['Processing', 'Asynchronous document-processing workflows built with FastAPI.'],
      ['Refinement', 'Tuned chunking and similarity thresholds to improve retrieval relevance.'],
    ],
    features: [
      { Icon: Search, title: 'Find the useful parts', body: 'Search uploaded documents and retrieve relevant passages through vector similarity.' },
      { Icon: Sparkles, title: 'Ask in context', body: 'Google Gemini generates summaries and answers using retrieved document content.' },
      { Icon: Layers3, title: 'Thoughtful retrieval', body: 'Asynchronous processing, refined chunking, and tuned similarity thresholds.' },
    ],
  },
];

function ProjectVisual({ project, compact = false }) {
  const food = project.id === 'foodfreaky';
  return (
    <div className={`work-visual work-visual-${project.id}${compact ? ' work-visual-compact' : ''}`}>
      <div className="work-visual-label"><span>{food ? 'FULL-STACK PRODUCT' : 'AI DOCUMENT ASSISTANT'}</span><span>{project.number} / 02</span></div>
      <div className="work-visual-brand">
        <span className="work-brand-symbol" aria-hidden="true">{food ? <Utensils size={23} strokeWidth={1.6} /> : <Sparkles size={23} strokeWidth={1.5} />}</span>
        <span className="work-wordmark">{food ? <>Food<span>Freaky</span></> : 'CIDA'}</span>
      </div>
      {!compact && <p className="work-visual-tagline">{food ? 'From campus. For campus.' : 'Your documents. A conversation away.'}</p>}
      <div className="work-flow" aria-label={food ? 'Product flow: browse food, place an order, track its status' : 'Document flow: documents, retrieval, contextual answers'}>
        {(food ? ['Browse', 'Order', 'Track'] : ['Documents', 'Retrieval', 'Answers']).map((step, index) => (
          <React.Fragment key={step}>
            {index > 0 && <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />}
            <span><i aria-hidden="true">{index === 2 ? <Check size={13} /> : index + 1}</i>{step}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="work-diagram-caption">{food ? 'Product journey · illustrated' : 'Retrieval pipeline · illustrated'}</div>
    </div>
  );
}

function ProjectCard({ project, onSelect }) {
  return (
    <article className="work-card">
      <ProjectVisual project={project} compact />
      <div className="work-card-copy">
        <div className="work-card-heading"><h2>{project.title}</h2><span>{project.year}</span></div>
        {project.id === 'foodfreaky' ? (
          <div className="work-card-outcomes"><span><strong>1,000+</strong> users</span><span><strong>₹6L+</strong> revenue</span></div>
        ) : (
          <div className="work-card-outcomes work-card-capabilities"><span>Search</span><span>Summarize</span><span>Ask</span></div>
        )}
        <p>{project.summary}</p>
        <div className="work-role">{project.role}</div>
        <div className="work-card-footer">
          <button className="work-card-button" onClick={() => onSelect(project.id)} aria-label={`Read ${project.title} case study`}>Explore the work <ArrowRight size={16} aria-hidden="true" /></button>
          {project.id === 'foodfreaky' && <a className="work-site-link" href="https://foodfreaky.in" target="_blank" rel="noreferrer" aria-label="Visit FoodFreaky website, opens in a new tab"><ArrowUpRight size={18} /></a>}
        </div>
      </div>
    </article>
  );
}

function Architecture({ food }) {
  const stages = food
    ? [{ title: 'React', detail: 'Student experience', Icon: Layers3 }, { title: 'Node + Express', detail: 'Backend services · JWT', Icon: Waypoints }, { title: 'MongoDB', detail: 'Persistence', Icon: Database }]
    : [{ title: 'Documents', detail: 'Asynchronous processing', Icon: FileText }, { title: 'Retrieval', detail: 'Chunks · embeddings · similarity', Icon: Search }, { title: 'Gemini API', detail: 'Contextual answers', Icon: Sparkles }];
  return (
    <section className="work-section">
      <div className="work-section-heading"><h2>{food ? 'How it fits together' : 'From documents to answers'}</h2><span>Architecture overview</span></div>
      <div className="work-architecture" aria-label={food ? 'React frontend connects to Node and Express services with JWT authentication and MongoDB persistence' : 'FastAPI processes documents into chunks and embeddings, retrieves relevant content, and sends context to Gemini API'}>
        {stages.map(({ title, detail, Icon }, index) => (
          <React.Fragment key={title}>
            {index > 0 && <ArrowRight className="work-architecture-arrow" size={17} aria-hidden="true" />}
            <div className="work-architecture-node"><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><strong>{title}</strong><span>{detail}</span></div>
          </React.Fragment>
        ))}
      </div>
      <p className="work-architecture-note">{food ? 'Production deployment uses DigitalOcean, Cloudflare, and Netlify.' : 'Built with Python and FastAPI. Chunking and similarity thresholds were refined to improve retrieval relevance.'}</p>
    </section>
  );
}

function CaseStudy({ project, onBack }) {
  const food = project.id === 'foodfreaky';
  return (
    <div className="work-case-study">
      <div className="work-case-navigation"><button className="work-back" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" /> All projects</button><span>{project.number} / SELECTED WORK</span></div>
      <ProjectVisual project={project} />
      <div className="work-case-title"><div><span className="work-eyebrow">{project.category}</span><h1>{project.fullTitle || project.title}</h1></div><span className="work-year">{project.year}</span></div>
      <p className="work-overview">{project.detail}</p>
      {food ? (
        <div className="work-results" aria-label="FoodFreaky results and role">
          <div><strong>1,000+</strong><span>Platform users</span></div>
          <div><strong>₹6L+</strong><span>Revenue generated</span></div>
          <div><strong>Co-founder</strong><span>Backend & deployment</span></div>
        </div>
      ) : (
        <div className="work-context-note"><Sparkles size={19} aria-hidden="true" /><p>Search, summaries, and answers grounded in the contents of uploaded documents.</p></div>
      )}
      <section className="work-section">
        <div className="work-section-heading"><h2>{food ? 'What I built' : 'Inside the assistant'}</h2></div>
        <div className="work-features">{project.features.map(({ Icon, title, body }) => <div className="work-feature" key={title}><Icon size={19} strokeWidth={1.6} aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></div>)}</div>
      </section>
      <Architecture food={food} />
      <section className="work-section">
        <div className="work-section-heading"><h2>The toolkit</h2></div>
        <div className="work-technologies" aria-label="Project technologies">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
      </section>
      <details className="work-specification">
        <summary><span><FileText size={17} aria-hidden="true" /> Full project specification</span><ChevronDown size={17} aria-hidden="true" /></summary>
        <dl>{project.specifications.map(([label, value]) => <React.Fragment key={label}><dt>{label}</dt><dd>{value}</dd></React.Fragment>)}</dl>
      </details>
      <div className="work-case-footer">
        <button className="work-back" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" /> Back to the workbench</button>
        {food && <a className="work-primary-link" href="https://foodfreaky.in" target="_blank" rel="noreferrer">Visit foodfreaky.in <ArrowUpRight size={16} aria-hidden="true" /></a>}
      </div>
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const appRef = useRef(null);
  const project = projects.find(item => item.id === selected);
  function navigate(id) {
    setSelected(id);
    const scroller = appRef.current?.closest('.window-content');
    if (scroller) scroller.scrollTop = 0;
    requestAnimationFrame(() => appRef.current?.focus({ preventScroll: true }));
  }
  return (
    <div className="work-app" ref={appRef} tabIndex={-1} aria-label={project ? `${project.title} case study` : 'Selected projects'}>
      {project ? <CaseStudy project={project} onBack={() => navigate(null)} /> : <>
        <div className="work-library-header"><span className="work-eyebrow">THE WORKBENCH / SELECTED WORK</span><h1>Built beyond the idea<span>.</span></h1><p>A closer look at what I build, and how.</p></div>
        <div className="work-gallery">{projects.map(item => <ProjectCard key={item.id} project={item} onSelect={navigate} />)}</div>
        <a className="work-github" href="https://github.com/manava10" target="_blank" rel="noreferrer"><span><Github size={18} aria-hidden="true" /> More from my workbench</span><ArrowUpRight size={17} aria-hidden="true" /></a>
      </>}
    </div>
  );
}
