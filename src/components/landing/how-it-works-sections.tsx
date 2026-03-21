const dashboardItems = [
  {
    title: '01. Sales Manager Dashboard',
    text: 'Track team performance, analyze calls, and identify growth spots',
    image: '/landing/img/dashboards-img1.png',
  },
  {
    title: '02. C-level Dashboard',
    text: 'Track team performance, analyze calls, and identify growth spots',
    image: '/landing/img/dashboards-img2.png',
  },
  {
    title: '03. CX Dashboard',
    text: 'Track team performance, analyze calls, and identify growth spots',
    image: '/landing/img/dashboards-img3.png',
  },
];

const expertTips = [
  {
    title: 'Focus on results',
    text: 'Talk about value for the customer, rather than product features',
    image: '/landing/img/experts-img2.jpg',
  },
  {
    title: 'Summarize agreements',
    text: 'At the end of the call, clearly state the next steps and deadlines',
    image: '/landing/img/experts-img3.jpg',
  },
  {
    title: 'Ask open-ended questions',
    text: 'Instead of "Does this suit you?" ask "How do you envision solving this task?"',
    image: '/landing/img/experts-img4.jpg',
  },
  {
    title: 'Empathy in conversation',
    text: 'Acknowledge the customer\'s feelings: "I understand how important this is to you"',
    image: '/landing/img/experts-img5.jpg',
  },
  {
    title: 'Analyze your calls',
    text: 'Listen to 2-3 of your conversations weekly and look for points of improvement',
    image: '/landing/img/experts-img6.jpg',
  },
  {
    title: 'Active Listening',
    text: 'Let the customer speak. Listen 70% of the time, speak 30%',
    image: '/landing/img/experts-img1.jpg',
  },
];

function WorksBannerSection() {
  return (
    <section className="works-banner-block">
      <div className="wrapper">
        <div className="banner-info">
          <div className="texts">
            <h1>
              Turn every call into a <span className="green-text">growth opportunity</span>
            </h1>
            <p>
              AIDA analyzes your team&apos;s customer communications and helps improve service
              quality at every stage
            </p>
          </div>
          <div className="info-block">
            <img src="/landing/img/decoration.png" alt="AIDA process" />
            <div className="info info1">
              <img src="/landing/img/works-icon1.svg" alt="" />
              <span>Сall Recording</span>
            </div>
            <div className="info info2">
              <img src="/landing/img/works-icon2.svg" alt="" />
              <span>Transcribe&Diaries</span>
            </div>
            <div className="info info3">
              <img src="/landing/img/works-icon3.svg" alt="" />
              <span>Smart Tips</span>
            </div>
            <div className="info info4">
              <img src="/landing/img/works-icon4.svg" alt="" />
              <span>Dashboards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalysisExampleSection() {
  return (
    <section className="analysis-example-block">
      <div className="wrapper">
        <h2>Listen to a call analysis example</h2>
        <img src="/landing/img/analysis-image.png" alt="Call analysis example" className="image" />
        <div className="text-info">
          <div className="texts">
            <p>
              In the ancient land of Eldoria, where skies shimmered and forests whispered secrets
              to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all
              down" kind... [giggles] but he was gentle, wise, with eyes like old stars.
              [whispers] Even the birds fell silent when he passed.
            </p>
            <p>
              In the ancient land of Eldoria, where skies shimmered and forests whispered secrets
              to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all
              down" kind... [giggles] but he was gentle, wise, with eyes like old stars.
              [whispers] Even the birds fell silent when he passed.
            </p>
            <p>
              In the ancient land of Eldoria, where skies shimmered and forests whispered secrets
              to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all
              down" kind... [giggles] but he was gentle, wise, with eyes like old stars.
              [whispers] Even the birds fell silent when he passed.
            </p>
            <p>
              In the ancient land of Eldoria, where skies shimmered and forests whispered secrets
              to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all
              down" kind... [giggles] but he was gentle, wise, with eyes like old stars.
              [whispers] Even the birds fell silent when he passed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardsSection() {
  return (
    <section className="dashboards-block">
      <div className="wrapper">
        <h2>Dashboards for every role</h2>
        <p>AIDA provides personalied control panels for different organizational levels</p>
        <div className="dashboards-items">
          {dashboardItems.map((item) => (
            <div key={item.title} className="dashboards-item">
              <div className="texts">
                <b>{item.title}</b>
                <span>{item.text}</span>
              </div>
              <div className="img">
                <img src={item.image} alt={item.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertsSection() {
  return (
    <section className="from-experts-block">
      <div className="wrapper">
        <div className="experts-info">
          <div className="experts-texts">
            <span className="style-text">Advice from experts</span>
            <h2>Learn every day</h2>
            <p>Best practices from top managers to boost communication efficiency</p>
          </div>
          <div className="experts-items">
            {expertTips.map((tip) => (
              <div key={tip.title} className="experts-item">
                <div className="img">
                  <img src={tip.image} alt={tip.title} />
                </div>
                <b>{tip.title}</b>
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingHowItWorksSections() {
  return (
    <>
      <WorksBannerSection />
      <AnalysisExampleSection />
      <DashboardsSection />
      <ExpertsSection />
    </>
  );
}
