export function WorksBannerSection() {
  return (
    <section className="works-banner-block">
      <div className="wrapper">
        <div className="banner-info">
          <div className="texts">
            <h1>
              Turn every call into a <span className="green-text">growth opportunity</span>
            </h1>
            <p>
              AIDA analyzes your team&apos;s customer communications and helps improve service quality
              at every stage
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
