const leaders = [
  {
    name: 'Aлександр Корнилов, CEO',
    bio: 'Предприниматель и стратег. 13 лет в e-com, эксперт по кратному росту продуктов и запуску успешных стартапов.',
    image: '/landing/img/about-us-img1.jpg',
    top: false,
  },
  {
    name: 'Глеб Любимов, CCO',
    bio: 'Продакт-менеджер с 10-летним стажем в IT. Мастер управления процессами и развития технологических продуктов.',
    image: '/landing/img/about-us-img2.jpg',
    top: true,
  },
  {
    name: 'Сардор, CTO',
    bio: 'Deep Tech инженер с 15-летним опытом. Автор уникальных AI-решений и локальных языковых моделей (LLM).',
    image: '/landing/img/about-us-img1.jpg',
    top: false,
  },
];

export function LandingAboutSections() {
  return (
    <section className="about-us-block">
      <div className="wrapper">
        <div className="info-wrap">
          <div className="info">
            <span className="style-text">Leadership</span>
            <h1>
              About <span className="green-text">Us</span>
            </h1>
            <div className="contact-info">
              <span>Телефон:</span>
              <a href="tel:+998999999999">+998 99 999 99 99</a>
            </div>
            <div className="contact-info">
              <span>Email: </span>
              <a href="mailto:aida@sales.uz">aida@sales.uz</a>
            </div>
            <div className="contact-info">
              <span>Адрес: </span>
              <b>
                г. Ташкент, <br /> ул. Баходыра, 44а
              </b>
            </div>
          </div>

          {leaders.map((leader) => (
            <div key={leader.name} className={`info-item${leader.top ? ' item-top' : ''}`}>
              <div className="img-wrap">
                <img src={leader.image} alt={leader.name} />
              </div>
              <b>{leader.name}</b>
              <span>{leader.bio}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
