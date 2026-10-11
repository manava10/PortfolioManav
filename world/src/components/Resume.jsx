import React, { useId } from 'react';
import { ArrowUpRight, Award, Download, FileText } from 'lucide-react';
import './resume.css';

const credentials = [
  {
    id: 'azure-ai',
    title: 'Microsoft Certified: Azure AI Fundamentals',
    issuer: 'Microsoft',
    issued: 'May 2026',
    credentialId: 'ITS-50827269',
    skills: ['Artificial Intelligence (AI)', 'Cloud Computing'],
    url: 'https://www.credly.com/badges/06d5440c-41bf-4a8b-b11b-37cbb3192e18/public_url',
    action: 'View credential',
    destination: 'Credly',
  },
  {
    id: '100xdevs',
    title: '100xDevs Full Stack with DevOps',
    issuer: '100xDevs',
    issued: 'August 2024',
    skills: ['Full-Stack Development', 'DevOps Foundations'],
    url: 'https://drive.google.com/file/d/16h8duX2L0jUi780LuMv6Ul0_JZsYcLPT/view?usp=sharing',
    action: 'View certificate',
    destination: 'Google Drive',
  },
];

function IssuerMark({ issuer }) {
  return issuer === 'Microsoft' ? (
    <span className="cv-issuer-mark cv-microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
  ) : (
    <span className="cv-issuer-mark cv-100x-mark" aria-hidden="true"><b>100<span>x</span></b><strong>devs</strong></span>
  );
}

function CredentialCard({ credential }) {
  return (
    <article className={`cv-credential cv-credential-${credential.id}`}>
      <div className="cv-credential-heading">
        <IssuerMark issuer={credential.issuer} />
        <div className="cv-credential-identity">
          <h2>{credential.title}</h2>
          <div className="cv-credential-meta"><span>{credential.issuer}</span><span>Issued {credential.issued}</span></div>
        </div>
      </div>
      {credential.credentialId && <p className="cv-credential-id">Credential ID <span>{credential.credentialId}</span></p>}
      <ul className="cv-skills" aria-label={`${credential.title} skills`}>
        {credential.skills.map(skill => <li key={skill}>{skill}</li>)}
      </ul>
      <div className="cv-credential-footer">
        <a href={credential.url} target="_blank" rel="noopener noreferrer" aria-label={`${credential.action}: ${credential.title} (opens in a new tab)`}>{credential.action}<ArrowUpRight size={15} /></a>
        <span>{credential.destination}</span>
      </div>
    </article>
  );
}

export default function Resume({ section = 'overview', onSectionChange }) {
  const instanceId = useId();
  const activeSection = section === 'certifications' ? 'certifications' : 'overview';
  const tabs = [{ id: 'overview', label: 'Overview', Icon: FileText }, { id: 'certifications', label: 'Certifications', Icon: Award }];
  const tabKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') nextIndex = 1 - index;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    onSectionChange?.(tabs[nextIndex].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[nextIndex].focus({ preventScroll: true });
  };

  return (
    <div className="cv-app">
      <header className="cv-header">
        <div><span className="cv-eyebrow">THE FORMAL INTRODUCTION</span><h1>Manav Mehta<span>.</span></h1><p>Backend engineer · India</p></div>
        <img src="/icons/resume.svg" alt="" draggable="false" />
      </header>
      <div className="cv-tabs" role="tablist" aria-label="Résumé sections">
        {tabs.map(({ id, label, Icon }, index) => <button key={id} id={`${instanceId}-tab-${id}`} role="tab" type="button" aria-selected={activeSection === id} aria-controls={`${instanceId}-panel-${id}`} tabIndex={activeSection === id ? 0 : -1} onClick={() => onSectionChange?.(id)} onKeyDown={event => tabKeyDown(event, index)}><Icon size={15} strokeWidth={1.7} />{label}{id === 'certifications' && <span className="cv-count">2</span>}</button>)}
      </div>
      <div id={`${instanceId}-panel-overview`} className="cv-panel cv-overview" role="tabpanel" aria-labelledby={`${instanceId}-tab-overview`} hidden={activeSection !== 'overview'}>
        <section className="cv-timeline-item"><span className="cv-year">2026 — PRESENT</span><div><h2>Digital Specialist Engineer Trainee</h2><h3>Infosys</h3><p>Java, Spring Boot, Spring Data JPA, Hibernate, REST APIs, and MySQL. Building layered backend services with validation, exception handling, and database persistence.</p></div></section>
        <section className="cv-timeline-item"><span className="cv-year">2022 — 2026</span><div><h2>B.Tech in Computer Science Engineering</h2><h3>VIT-AP University</h3><p>CGPA 8.8/10 · Amaravati, Andhra Pradesh</p></div></section>
        <section className="cv-milestones"><span className="cv-eyebrow">A FEW MILESTONES</span><ul><li>LeetCode maximum rating: 1784</li><li>INSPIRE Programme: top 1% in Class X boards</li><li>GitHub Foundations certification</li></ul></section>
        <a className="cv-resume-link" href="/Resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open Manav Mehta’s full résumé PDF (opens in a new tab)"><Download size={15} />Open full résumé<ArrowUpRight size={15} /></a>
      </div>
      <div id={`${instanceId}-panel-certifications`} className="cv-panel cv-certifications" role="tabpanel" aria-labelledby={`${instanceId}-tab-certifications`} hidden={activeSection !== 'certifications'}>
        <div className="cv-credential-list">{credentials.map(credential => <CredentialCard key={credential.id} credential={credential} />)}</div>
      </div>
    </div>
  );
}
