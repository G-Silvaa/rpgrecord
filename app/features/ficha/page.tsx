const attributes = [
  { label: "FOR", score: 16, mod: "+3" },
  { label: "DES", score: 14, mod: "-2" },
  { label: "CON", score: 12, mod: "+2" },
  { label: "INT", score: 8, mod: "0" },
  { label: "SAB", score: 12, mod: "+1" },
  { label: "CAR", score: 8, mod: "-1" },
];

const savingThrows = [
  { label: "Força", value: "+2" },
  { label: "Destreza", value: "-5" },
  { label: "Constituição", value: "0" },
  { label: "Inteligência", value: "-3" },
  { label: "Sabedoria", value: "-1" },
  { label: "Carisma", value: "-1" },
];

const skills = [
  { label: "Acrobacia", value: "-5" },
  { label: "Arcanismo", value: "0" },
  { label: "Atletismo", value: "+2" },
  { label: "Furtividade", value: "-1" },
  { label: "História", value: "0" },
  { label: "Intimidação", value: "-1" },
  { label: "Percepção", value: "+1" },
  { label: "Persuasão", value: "-1" },
  { label: "Sobrevivência", value: "-1" },
];

const actions = [
  {
    name: "Espada Longa",
    desc: "Marcial • Corpo a Corpo",
    bonus: "+5",
    damage: "1d8 + 5",
    type: "Cortante",
  },
  {
    name: "Arco Longo",
    desc: "Marcial • 45/180",
    bonus: "+4",
    damage: "1d8 + 2",
    type: "Perfurante",
  },
];

export default function FichaPage() {
  return (
    <div className="min-h-screen bg-[#0b0a1d] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-14 pt-8">
        <Header />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Home</span>
              <span className="text-slate-500">/</span>
              <span>Personagens</span>
              <span className="text-slate-500">/</span>
              <span className="text-indigo-200">Nova Ficha</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Registro de Novo Personagem
            </h1>
            <p className="text-sm text-slate-400">
              Preencha os detalhes abaixo para forjar sua lenda.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost">Cancelar</Button>
            <Button>Salvar Ficha</Button>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <Card className="grid grid-cols-[220px_1fr] items-start gap-6">
              <div className="flex flex-col items-start gap-3">
                <div className="relative">
                  <div className="h-48 w-36 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-800 via-indigo-900 to-[#0f0c2d]">
                    <div className="flex h-full items-center justify-center text-sm text-indigo-100">
                      Avatar
                    </div>
                  </div>
                  <button className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-indigo-800/30 transition hover:bg-indigo-500">
                    Editar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Nome do Personagem">
                  <Input placeholder="Ex: Gandalf, o Cinzento" />
                </Field>
                <Field label="Raça">
                  <Select value="Humano" />
                </Field>
                <Field label="Classe e Nível">
                  <div className="flex items-center gap-3">
                    <Select value="Guerreiro" className="flex-1" />
                    <Input value="1" className="w-16 text-center" />
                  </div>
                </Field>
                <Field label="Antecedente">
                  <Select value="Acólito" />
                </Field>
                <Field label="Alinhamento">
                  <Select value="Leal e Bom" />
                </Field>
                <Field label="Experiência (XP)">
                  <Input placeholder="0 / 1200" />
                </Field>
              </div>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader title="Atributos" />
              <div className="mt-4 grid grid-cols-1 gap-3">
                {attributes.map((attr) => (
                  <div
                    key={attr.label}
                    className="rounded-xl border border-white/5 bg-[#0f0e24] p-3 text-center shadow-inner shadow-black/30"
                  >
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      {attr.label}
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-white">
                      {attr.score}
                    </div>
                    <div className="text-sm text-indigo-200">{attr.mod}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="rounded-lg border border-indigo-600/40 bg-indigo-900/30 px-3 py-2">
                  <div className="text-xs uppercase text-slate-400">
                    Inspiração
                  </div>
                  <div className="text-lg font-semibold text-indigo-100">-2</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div className="text-xs uppercase text-slate-400">
                    Prof. Passiva
                  </div>
                  <div className="text-lg font-semibold text-white">13</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-6">
            <Card>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat title="Classe Arm." value="16" />
                <Stat title="Iniciativa" value="+2" />
                <Stat title="Deslocamento" value="9m" />
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="font-semibold text-indigo-100">
                      Pontos de Vida
                    </span>
                    <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-100">
                      Vital
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg text-slate-200 transition hover:border-red-500/50 hover:text-white">
                        -
                      </button>
                      <div className="flex-1">
                        <ProgressBar value={24} max={32} color="red" />
                        <div className="mt-1 flex justify-between text-xs text-slate-400">
                          <span>24 / 32</span>
                          <span>Máximo: 32</span>
                        </div>
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg text-slate-200 transition hover:border-emerald-500/50 hover:text-white">
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">
                        Vida Temp: 0
                      </span>
                      <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">
                        Dados de Vida: 1d10
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-4">
                  <div className="text-sm font-semibold text-indigo-100">
                    Magias
                  </div>
                  <div className="mt-3 space-y-3 text-sm text-slate-300">
                    <p className="rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                      Lista as magias preparadas, slots e níveis disponíveis
                      para o aventureiro.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge>P. de Concentração +4</Badge>
                      <Badge variant="neutral">CD de Resistência 14</Badge>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-4">
                  <div className="text-sm font-semibold text-indigo-100">
                    Equipamentos
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-slate-300">
                    <p className="rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                      Itens carregados, anotações de peso e slots rápidos para
                      alternar armas e utilidades.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="neutral">Mochila</Badge>
                      <Badge variant="neutral">Rações (3)</Badge>
                      <Badge variant="neutral">Tocha</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-sm font-medium text-indigo-100">
                  <Tab active>Ações &amp; Ataques</Tab>
                  <Tab>Magias</Tab>
                  <Tab>Equipamento</Tab>
                  <Tab>Características</Tab>
                </div>
                <Button size="sm" variant="outline">
                  + Adicionar
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {actions.map((action) => (
                  <div
                    key={action.name}
                    className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0f0f25] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {action.name}
                      </div>
                      <div className="text-xs text-slate-400">{action.desc}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
                      <Pill>{`BÔNUS ${action.bonus}`}</Pill>
                      <Pill>{`DANO ${action.damage}`}</Pill>
                      <Pill variant="soft">{action.type}</Pill>
                      <Button size="sm" variant="ghost">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Button variant="secondary">Esquivar</Button>
                <Button variant="secondary">Disparada</Button>
                <Button variant="secondary">Desengajar</Button>
                <Button variant="secondary">Ajudar</Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader title="Testes de Resistência" />
              <div className="mt-3 space-y-3 text-sm">
                {savingThrows.map((save) => (
                  <div
                    key={save.label}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-slate-200"
                  >
                    <span>{save.label}</span>
                    <span className="font-semibold text-indigo-100">
                      {save.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Perícias" />
              <div className="mt-3 space-y-3 text-sm">
                {skills.map((skill) => (
                  <div
                    key={skill.label}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-slate-200"
                  >
                    <span>{skill.label}</span>
                    <span className="font-semibold text-indigo-100">
                      {skill.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Notas Rápidas" />
              <div className="mt-3 rounded-xl border border-dashed border-indigo-500/40 bg-[#0f0f25] p-3 text-sm text-slate-300">
                Anote ideias, vínculos ou defeitos para lembrar durante a
                próxima sessão.
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="rounded-2xl border border-white/5 bg-gradient-to-r from-[#1d1b4a] via-[#121233] to-[#0e0f29] p-4 shadow-2xl shadow-black/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-800/30">
              D&amp;D
            </div>
            <div>
              <div className="text-sm font-semibold text-white">D&amp;D Clone</div>
              <div className="text-xs text-indigo-200">
                Meus Personagens
              </div>
            </div>
          </div>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            <NavLink active>Meus Personagens</NavLink>
            <NavLink>Campanhas</NavLink>
            <NavLink>Livros</NavLink>
            <NavLink>Ferramentas</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 shadow-inner shadow-black/30 sm:flex">
            <span className="text-xs text-slate-400">🔍</span>
            <input
              className="ml-2 w-44 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              placeholder="Buscar..."
            />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/60 bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40">
            IM
          </div>
        </div>
      </div>
    </header>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-[#121127] p-5 shadow-xl shadow-black/30 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between text-sm font-semibold text-indigo-100">
      <span>{title}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-indigo-500/60 to-transparent" />
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "secondary" | "outline";
  size?: "sm" | "md";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";
  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
  };
  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 hover:bg-indigo-500",
    secondary:
      "bg-white/10 text-slate-100 border border-white/10 hover:border-indigo-400/50",
    ghost:
      "bg-transparent text-slate-200 border border-white/10 hover:border-indigo-400/50",
    outline:
      "border border-indigo-500/50 text-indigo-100 hover:bg-indigo-500/10",
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className ?? ""}`}>
      {children}
    </button>
  );
}

function Input({
  value,
  placeholder,
  className,
}: {
  value?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      defaultValue={value}
      placeholder={placeholder}
      className={`h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none ring-indigo-500/40 transition focus:border-indigo-500/60 focus:ring-2 ${className ?? ""}`}
    />
  );
}

function Select({ value, className }: { value: string; className?: string }) {
  return (
    <div
      className={`flex h-11 items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-100 shadow-inner shadow-black/20 ${className ?? ""}`}
    >
      <span>{value}</span>
      <span className="text-xs text-slate-400">▼</span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function ProgressBar({
  value,
  max,
  color = "indigo",
}: {
  value: number;
  max: number;
  color?: "indigo" | "red";
}) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const palette =
    color === "red"
      ? "from-red-500 via-rose-500 to-red-600"
      : "from-indigo-500 via-indigo-400 to-blue-500";
  return (
    <div className="h-3 rounded-full bg-white/10 shadow-inner shadow-black/30">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${palette} transition-all`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-4 text-center shadow-inner shadow-black/30">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {title}
      </div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function Badge({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "neutral";
}) {
  const styles =
    variant === "neutral"
      ? "bg-white/10 text-slate-200"
      : "bg-indigo-600/30 text-indigo-100 border border-indigo-500/40";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}

function Pill({
  children,
  variant = "solid",
}: {
  children: React.ReactNode;
  variant?: "solid" | "soft";
}) {
  const styles =
    variant === "soft"
      ? "bg-white/10 text-slate-200"
      : "bg-indigo-600/30 text-indigo-100 border border-indigo-500/40";
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1 font-semibold ${styles}`}>
      {children}
    </span>
  );
}

function NavLink({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`cursor-pointer rounded-full px-3 py-1 transition ${
        active
          ? "bg-white/10 text-white shadow-inner shadow-indigo-900/30"
          : "text-slate-300 hover:text-white"
      }`}
    >
      {children}
    </span>
  );
}

function Tab({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`cursor-pointer rounded-full px-4 py-2 text-xs uppercase tracking-wide transition ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
          : "bg-white/5 text-slate-300"
      }`}
    >
      {children}
    </span>
  );
}
