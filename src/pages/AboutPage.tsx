const AboutPage = () => {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-deep-700">Nossa história</p>
      <h1 className="mt-4 font-display text-4xl text-ink-700">Sobre a Temporada Azul</h1>
      <p className="mt-6 text-lg text-ink-600">
        A Temporada Azul nasceu em Vitória, ES, com a missão de oferecer
        experiências marítimas inesquecíveis, com segurança, conforto e
        atendimento personalizado.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
          <h3 className="font-display text-2xl text-ink-700">Propósito</h3>
          <p className="mt-3 text-sm text-ink-600">
            Conectar pessoas ao mar, respeitando o ritmo da natureza e
            valorizando a beleza do nosso litoral.
          </p>
        </div>
        <div className="rounded-2xl border border-ocean-100 bg-white/80 p-6">
          <h3 className="font-display text-2xl text-ink-700">Excelência</h3>
          <p className="mt-3 text-sm text-ink-600">
            Operação estruturada, equipe dedicada e logística eficiente para
            entregar uma experiência premium do início ao fim.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
