import { profile } from '@/data/profile';
import { skills, specialisations } from '@/data/skills';
import { projects } from '@/data/projects';
import { timeline } from '@/data/experience';
import { contact, socials } from '@/data/contact';

/**
 * The real document.
 *
 * Every word the journey shows in 3D also exists here as ordinary semantic HTML:
 * headings, lists, links. Screen readers and crawlers read this; sighted users
 * get the canvas. It is visually hidden, never `display:none` — hidden content
 * is not announced, and `aria-hidden` would defeat the entire point.
 *
 * The polish pass reuses this markup, unhidden and styled, as the reduced-motion
 * and "skip the journey" layout.
 */
export function SemanticContent() {
  return (
    <div className="sr-anchor">
      <h1>
        {profile.name} — {profile.role}
      </h1>
      <p>{profile.tagline}</p>

      <section aria-labelledby="about-heading">
        <h2 id="about-heading">About</h2>
        {profile.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
        <ul>
          {profile.stats.map((stat) => (
            <li key={stat.label}>
              {stat.value} {stat.label}
            </li>
          ))}
        </ul>
        <p>{profile.location}</p>
        <p>
          <a href={profile.resumeUrl}>Download CV (PDF)</a>
        </p>
      </section>

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        <ul>
          {skills.map((skill) => (
            <li key={skill.name}>{skill.name}</li>
          ))}
        </ul>
        <h3>Specialisations</h3>
        <ul>
          {specialisations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
        {projects.map((project) => (
          <article key={project.slug} aria-labelledby={`project-${project.slug}`}>
            <h3 id={`project-${project.slug}`}>{project.title}</h3>
            <p>{project.tagline}</p>
            <p>{project.description}</p>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p>Built with: {project.stack.join(', ')}.</p>
            <ul>
              {project.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} rel="noopener noreferrer" target="_blank">
                    {link.label} — {project.title}
                  </a>
                </li>
              ))}
            </ul>
            {project.demo ? (
              <p>
                {project.demo.note}
                {project.demo.fields
                  ? ` ${project.demo.fields.map((f) => `${f.label}: ${f.value}`).join(', ')}.`
                  : ''}
              </p>
            ) : null}
          </article>
        ))}
      </section>

      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience and education</h2>
        <ol>
          {timeline.map((entry) => (
            <li key={`${entry.org}-${entry.startYear}`}>
              <h3>
                {entry.role} — {entry.org}
              </h3>
              <p>{entry.period}</p>
              <p>{entry.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
        <p>{contact.subhead}</p>
        <ul>
          {socials.map((social) => (
            <li key={social.url}>
              <a href={social.url} rel="noopener noreferrer">
                {social.label}: {social.handle}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
