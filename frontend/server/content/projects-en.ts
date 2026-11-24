/**
 * English text of the case studies. The Spanish original lives in the database; a project
 * without an entry here is shown in Spanish on /en, with a note. When the Spanish text of
 * a case changes, change its translation too.
 */
export interface ProjectTranslation {
  tagline: string
  content_html: string
}

export const PROJECTS_EN: Record<string, ProjectTranslation> = {
  'vestta': {
    tagline: 'Multi-company real estate CRM that connects properties, clients, opportunities and automations in a single operation.',
    content_html: '<div><p><em>personal note / product in the making</em></p>'
      + '<h2>Vestta, after working inside the problem</h2>'
      + '<p>Vestta started when I lived the day-to-day of an estate agency. There were too many open tabs, repeated data and tasks done by hand because no tool ever quite talked to the next one. That is when I understood I did not want to build “another CRM with AI”; I wanted to put a real operation in order and then automate what was truly surplus.</p>'
      + '<h2>The idea that kept growing</h2>'
      + '<p>Today it is a multi-company SaaS platform to handle clients, properties, opportunities, calendar, documents and communication from one place. The front is a CRM designed for working fast: search, filter, move an opportunity, attach a property sheet and get on with the next call. Underneath there is a data layer that tries to keep one simple rule: a property must be the same property even when it arrives from different sources.</p>'
      + '<p>Automatic sourcing collects public listings, normalises them and turns them into usable records. Matching crosses each buyer’s preferences with the inventory and explains the result, not just a percentage: what fits, what is missing and where I am forcing the comparison. It looks like a small detail, but it stops the team wasting time on matches that are not matches.</p>'
      + '<h2>The AI part, with both feet on the ground</h2>'
      + '<p>The WhatsApp agent is not allowed to invent availability, confirm a viewing that does not exist or delete something because it “understood” so. It can draft and suggest, but actions go through the system, are checked against real data and are logged. That separation between what the model suggests and what the product allows to run is probably the technical decision that has taught me the most in this project.</p>'
      + '<blockquote>AI helps far more when it has clear limits and a CRM worth consulting.</blockquote>'
      + '<p>There are also per-company permissions, protected sessions, two-factor authentication, documents handled with care and communication between services that does not depend on the prompt being perfect. I do not go into the internal implementation because the product is still private; I can share the criterion: every operation should be traceable, reversible when it needs to be and hard to run by accident.</p>'
      + '<h2>What I take with me</h2>'
      + '<p>Vestta is still under way. It has made me think about dirty data, human processes, automations that fail and products that have to earn the trust of the people who use them every morning. The beautiful part is not the list of features, but having turned a pile of friction in estate agency work into an operation that is starting to feel continuous.</p></div>',
  },
  'lacasadesusana-web': {
    tagline: 'Website for a boutique Ibiza estate agency: the catalogue comes live from Vestta and every form creates the contact in the CRM.',
    content_html: '<div><p><em>personal note / not yet published</em></p>'
      + '<h2>La Casa de Susana: luxury without noise</h2>'
      + '<p>La Casa de Susana is a boutique estate agency in Ibiza, and most of its buyers look from abroad, often before setting foot on the island. The website had to feel calm and cared for: large photography, plenty of air, fine typography and motion that accompanies without distracting.</p>'
      + '<h2>The catalogue lives in Vestta</h2>'
      + '<p>The website stores no properties at all. Listings, photos, videos and features arrive from Vestta’s public API, always through the server, so the team works in one place and the site keeps itself up to date. The privacy of each address also comes from the CRM: if a property must not show its exact location, the map shows an area, never a point.</p>'
      + '<h2>Forms that reach the CRM</h2>'
      + '<ul><li>General contact, straight into Vestta as an enquiry.</li><li>Private search: anyone who does not find what they want leaves their preferences and the CRM creates their request.</li><li>Tenant profile, so the agency receives the tenant already qualified.</li><li>Sell a house, which reaches the agency by email.</li></ul>'
      + '<p>If Vestta does not respond, the contact is not lost: it goes out by email as plan B.</p>'
      + '<blockquote>A form that fails silently is a client who leaves without you ever knowing.</blockquote>'
      + '<h2>Ready to grow</h2>'
      + '<p>It is built with Nuxt 4, in English and Spanish, each language with its own URLs. Adding German, French or Italian is a matter of translating, not rebuilding. Right now it is finished and waiting to be published on the agency’s domain.</p></div>',
  },
  'postproducciones-web': {
    tagline: 'Website for an Ibiza production company that opens like a film and gives brands and actors each their own path.',
    content_html: '<div><p><em>personal note / editorial website</em></p>'
      + '<h2>A website that opens like a film</h2>'
      + '<p>Post Producciones was not asking for a template “creative agency” website. The first thing you see is their cinema, full screen and with no headline on top. As you scroll, the picture closes into a red circle, the circle stays still and the letters arrive around it: it was the O of their logo. Only then does the explanation begin.</p>'
      + '<p>That transformation was approved early and has been kept. Almost everything else changed between August and November, as the production company became clearer about what it wanted to say and to whom.</p>'
      + '<h2>Four crafts and a separate path</h2>'
      + '<p>The home page speaks first to brands and agencies: film, documentary, podcast and branded content, each with one sentence and one video, and each leading to the work already filtered. Production service for shoots in Ibiza and Formentera has its own place. Anyone arriving with a brief understands in a few seconds what they do, and sees it done.</p>'
      + '<p>Actors who are starting out look for something else. For them there is a whole section, Escenas (scenes): what the showreel includes, how the process works, filmed examples and frequent questions. It is one click away, but it does not compete with the main route.</p>'
      + '<h2>What has changed since the first version</h2>'
      + '<ul><li>A single dark theme, with the type and colours of the brand manual.</li><li>A gallery of work with filters by format and a page for each project.</li><li>Buttons, titles and hierarchy reviewed with a 41-page external design audit.</li><li>Service pages, a blog and copy written for people looking for a production company in Ibiza.</li><li>Four languages: Spanish, English, German and French.</li><li>No more placeholder testimonials. If something is not real, it is not there.</li></ul>'
      + '<blockquote>The feeling I was after: walking into a production company, not into a landing page trying to look like one.</blockquote>'
      + '<h2>What lies underneath</h2>'
      + '<p>It is built with Nuxt 4, Vue and Tailwind, with GSAP for the scroll-linked motion. The videos are streamed from a CDN and so are the stills, so that a site full of images keeps loading fast. The form goes through a check before sending anything, so the team hears from people and not from bots.</p>'
      + '<p>I like this project because it has grown with its client. The first version selected and kept quiet; this one also organises, filters and answers, and still lets the work speak.</p></div>',
  },
  'tierradeibiza-web': {
    tagline: 'Property showcase connected to Vestta to discover homes in Ibiza and turn enquiries into opportunities.',
    content_html: '<div><p><em>personal note / connected catalogue</em></p>'
      + '<h2>Tierras de Ibiza: turning inventory into an experience</h2>'
      + '<p>On an estate agency website the challenge is not just showing beautiful houses. Someone has to find one that suits them, understand the information and feel like asking. For Tierras de Ibiza I worked on exactly that: making the catalogue feel clear, fast and close even though there is a fair amount of data behind it.</p>'
      + '<p>The website takes its properties from Vestta and presents them with listings, filters, sorting and detail pages. The integration is designed so the team can update the inventory without doing the work twice on the public site. When a property changes, the showcase has to know; if an address comes in incomplete, the interface has to show it without breaking.</p>'
      + '<h2>The experience I kept polishing</h2>'
      + '<ul><li>Filters for sale, rent and business transfer, with states that are easy to read.</li><li>Property cards and details that put price, location, photos and features first.</li><li>Buying, selling and contact forms connected to the sales flow.</li><li>Maps and location links that help you get your bearings without filling the screen with noise.</li><li>Translations and SEO from the start, not as a layer added at the end.</li></ul>'
      + '<p>It is built with Nuxt, rendered on the server, with an API as the source of truth. There is also a lot of small work behind it: reserved and under-offer states, prices that can change, pagination, form validation and the cases where a property does not bring every expected field.</p>'
      + '<blockquote>The website does not replace the agent. It takes the friction out of the first conversation.</blockquote>'
      + '<p>That is what I keep: a property interface does not have to look like an admin panel. It has to help people decide.</p></div>',
  },
  'nextlevelapps-web': {
    tagline: 'Company website that explains services, highlights projects and turns qualified visits into new opportunities.',
    content_html: '<div><p><em>personal note / introducing the studio</em></p>'
      + '<h2>NextLevelApps as a front door</h2>'
      + '<p>This is the website we made to explain what we do without hiding it behind big words. Services, projects, team and contact, all with a fairly clean hierarchy so that someone arriving for the first time understands what we can help with.</p>'
      + '<p>I approached it as a studio piece, not an endless catalogue: a home page that points the way, dedicated pages for services and projects, and the legal part built in without it feeling like you jumped to another product. The visual tone aims to be technical but approachable, with cards, labels and enough space for each case to have its place.</p>'
      + '<h2>Decisions that did matter</h2>'
      + '<ul><li>Reusable components, so as not to maintain five versions of every button.</li><li>Separate routes for services, projects, team and legal pages.</li><li>Responsive design from the first block, not fixed at the end.</li><li>Small animations and light analytics to know whether the page is doing its job.</li></ul>'
      + '<p>It is built with Vue 3, Vite and Tailwind. The point is not using a list of technologies, but that the site can grow when the next project or service arrives without losing its shape.</p>'
      + '<blockquote>A company website can also sound like the people behind it.</blockquote>'
      + '<p>I like it as an exercise in clarity: say enough, leave a door open and do not promise a magic solution before talking to the client.</p></div>',
  },
  'vestta-web': {
    tagline: 'The website that explains and sells Vestta: product, pricing and guides in Spanish and English, with demos made in code instead of screenshots.',
    content_html: '<div><p><em>personal note / product website</em></p>'
      + '<h2>Vestta.io: explaining a big product without making your head spin</h2>'
      + '<p>Vestta does many things and that was the problem with its website: how to tell it without unrolling an endless list of features. The decision was to show an agency’s work from start to finish, from sourcing to closing, and let each feature appear where it is used.</p>'
      + '<h2>The product, drawn in code</h2>'
      + '<p>Almost everything that looks like a screenshot of the CRM is not one: they are pieces made in the website itself, with sample data, speaking the same visual language as the product. They load fast, read well on a phone, can be translated and show nobody’s data.</p>'
      + '<h2>What is behind it</h2>'
      + '<ul><li>Nuxt 4 with server rendering and content in Spanish and English.</li><li>Dedicated pages for each part of the product, with pricing, migration, integrations and comparisons.</li><li>Guides and templates that answer what an estate agency searches for, not just the brand.</li><li>Text versions of the pages, designed for AI assistants.</li><li>A move from vestta.app to vestta.io, with every old URL redirected to its equivalent.</li></ul>'
      + '<blockquote>If a feature cannot be understood with an example, the problem is not the reader’s.</blockquote>'
      + '<p>It is the other side of the CRM: building the product and also the page that has to earn someone trying it.</p></div>',
  },
  'nightmare-framework': {
    tagline: 'Private C2 framework for pentesting and red teaming labs, with encrypted communications and post-exploitation control.',
    content_html: '<div><p><em>personal note / private lab</em></p>'
      + '<h2>Nightmare Framework, told with care</h2>'
      + '<p>This was a security research project to build a controlled testing environment and understand, from the inside, how command infrastructure, communications and sessions are organised in an authorised lab.</p>'
      + '<p>What I wanted to study was the engineering around the problem: authenticated and encrypted transport, session management, an operating interface and modules that could evolve without turning everything into a block impossible to maintain. I also worked on the communication between a graphical interface and a console, connection states and fault tolerance.</p>'
      + '<h2>What I learned</h2>'
      + '<ul><li>Cryptography does not fix a badly designed protocol.</li><li>Separation of concerns matters more when the system has several surfaces.</li><li>A lab GUI needs very clear feedback and states so as not to hide errors.</li><li>Documenting limits and use cases is part of security, not an extra.</li></ul>'
      + '<p>The repository and the implementation are private. I do not publish operational capabilities, access techniques or instructions for use: here I only leave what I learned about architecture and the defensive context of the experiment.</p>'
      + '<blockquote>A security project is also measured by what you decide not to show.</blockquote>'
      + '<p>It is archived, but it was an important stage for understanding networks, C/C++, Windows/Linux systems and the real cost of maintaining software that talks to many pieces at once.</p></div>',
  },
  'brisa-saas': {
    tagline: 'Operations platform for field teams, from planning to reporting.',
    content_html: '<div><p><em>personal note / SaaS product</em></p>'
      + '<h2>Brisa: field operations in one place</h2>'
      + '<p>Brisa brings the daily work of field teams and office coordination into the same platform. The mobile app lets people check the day’s jobs, clock in and out, log manual hours and request materials; the office can plan, assign people, review hours and look at the activity.</p>'
      + '<h2>Planning connected to the real work</h2>'
      + '<p>Clients, locations, jobs and assignments are part of the same flow. Planning helps organise the day, while the time records keep what really happened. Reviews and corrections are traced so the history stays clear.</p>'
      + '<h2>An app for each context</h2>'
      + '<p>The public website explains the product at <a href="https://brisaops.com">brisaops.com</a> and the working application is available at <a href="https://app.brisaops.com">app.brisaops.com</a>. The worker experience is designed for mobile; the admin one makes planning, follow-up and reporting easier from the office.</p>'
      + '<blockquote>The idea is that the team can focus on the work and the operational information stays connected.</blockquote>'
      + '<h2>Brisa in pictures</h2>'
      + '<figure><img src="https://res.cloudinary.com/dasenzdvq/image/upload/v1791238916/01-presentacion-brisa_jxruyz.webp" alt="Introduction to Brisa" loading="lazy"/><figcaption>Introduction</figcaption></figure>'
      + '<figure><img src="https://res.cloudinary.com/dasenzdvq/image/upload/v1791238916/02-cuadrantes-mensuales_ynjydm.webp" alt="Monthly planning rotas in Brisa" loading="lazy"/><figcaption>Monthly rotas</figcaption></figure>'
      + '<figure><img src="https://res.cloudinary.com/dasenzdvq/image/upload/v1791238916/05-oficina-y-equipo_n8hlu9.webp" alt="The office and the team in Brisa" loading="lazy"/><figcaption>Office and team</figcaption></figure>'
      + '<figure><img src="https://res.cloudinary.com/dasenzdvq/image/upload/v1791238916/03-control-de-horas_ifp5pn.webp" alt="Time tracking in Brisa" loading="lazy"/><figcaption>Time tracking</figcaption></figure>'
      + '<figure><img src="https://res.cloudinary.com/dasenzdvq/image/upload/v1791238916/04-brisa-en-el-movil_fwq4qi.webp" alt="Brisa on a phone" loading="lazy"/><figcaption>Brisa on a phone</figcaption></figure></div>',
  },
  'self-debrid': {
    tagline: 'Self-hosted debrid service to play in Kodi from torrents and direct downloads, with no monthly fees.',
    content_html: '<div><p><em>personal note / a tool for my own stack</em></p>'
      + '<h2>Self-Debrid: taking a subscription out of the equation</h2>'
      + '<p>This project was born from a very specific annoyance: I wanted to play in Kodi from my own network without depending on a monthly fee to act as the middleman between a link and the player.</p>'
      + '<p>Self-Debrid is a self-hosted service that exposes an API compatible with the Kodi add-on flow. Depending on the source, it delegates the download to qBittorrent or JDownloader and starts serving the file while it is still downloading. That way there is no need to wait for everything to finish before you start watching.</p>'
      + '<h2>A small service, plenty of details</h2>'
      + '<ul><li>Direct downloads and torrents with separate adapters.</li><li>A local cache so as not to repeat a download that already exists.</li><li>Files tracked by identifier to avoid duplicates.</li><li>A pairing flow from Kodi without copying keys by hand.</li><li>An HTTPS API and configuration designed to work on a home network.</li></ul>'
      + '<p>The interesting part was designing the whole cycle: receiving a request, queuing the job, detecting when there is enough content to serve it and cleaning the cache when it stops making sense. It is not a public platform, nor does it try to be; it is a piece of personal infrastructure for content I have the right to access.</p>'
      + '<blockquote>I like these projects because they solve a small friction and, along the way, teach you how a system behaves when there is state, queues and large files.</blockquote>'
      + '<p>It is still under way. Each pass improves compatibility a little and makes the whole feel less like a script and more like a service.</p></div>',
  },
}
