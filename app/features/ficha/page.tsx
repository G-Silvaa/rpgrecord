"use client";

import type React from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AttributeBlock, RpgFichaPayload, createRpgFicha, updateRpgFicha } from "./api";

type AbilityKey = keyof AttributeBlock;
type TabKey = "actions" | "spells" | "equipment" | "features";

type AttributeInputs = Record<AbilityKey, string>;

type AttackForm = {
  name: string;
  melee: boolean;
  rangeNormal: string;
  rangeLong: string;
  attackBonus: string;
  damageDice: string;
  damageBonus: string;
  damageType: string;
};

type SpellForm = {
  name: string;
  level: string;
  school: string;
  damageDice: string;
  damageBonus: string;
  damageType: string;
  prepared: boolean;
  castingTime: string;
  rangeText: string;
  components: string;
  duration: string;
  description: string;
};

type EquipmentForm = {
  name: string;
  quantity: string;
  weight: string;
  valueGold: string;
  equipped: boolean;
  notes: string;
};

type ModalState =
  | { type: "attack"; index: number | null; data: AttackForm }
  | { type: "spell"; index: number | null; data: SpellForm }
  | { type: "equipment"; index: number | null; data: EquipmentForm };

type FichaForm = {
  characterName: string;
  race: string;
  subRace: string;
  ancestry: string;
  alignment: string;
  attributes: AttributeInputs;
  inspirationPoints: string;
  proficiencyBonus: string;
  skillProficiencies: string[];
  saveProficiencies: string[];
  notes: string;
  maxHp: string;
  currentHp: string;
  tempHp: string;
  hpDice: string;
  attacks: AttackForm[];
  spells: SpellForm[];
  equipment: EquipmentForm[];
};

export type RpgFichaResponse = RpgFichaPayload & {
  id?: string;
  attacks: (RpgFichaPayload["attacks"][number] & { id?: string })[];
  spells: (RpgFichaPayload["spells"][number] & { id?: string })[];
  equipment: (RpgFichaPayload["equipment"][number] & { id?: string })[];
};

const mapPayloadToForm = (data: RpgFichaResponse | null): FichaForm => {
  if (!data) return createEmptyForm();
  return {
    characterName: data.characterName ?? "",
    race: data.race ?? "",
    subRace: data.subRace ?? "",
    ancestry: data.ancestry ?? "",
    alignment: data.alignment ?? "",
    attributes: {
      strength: data.attributes?.strength?.toString() ?? "",
      dexterity: data.attributes?.dexterity?.toString() ?? "",
      constitution: data.attributes?.constitution?.toString() ?? "",
      intelligence: data.attributes?.intelligence?.toString() ?? "",
      wisdom: data.attributes?.wisdom?.toString() ?? "",
      charisma: data.attributes?.charisma?.toString() ?? "",
    },
    inspirationPoints: data.inspirationPoints?.toString() ?? "",
    proficiencyBonus: data.proficiencyBonus?.toString() ?? "",
    skillProficiencies: uniqueArray(data.skillProficiencies ?? []),
    saveProficiencies: uniqueArray(data.saveProficiencies ?? []),
    notes: data.notes ?? "",
    maxHp: data.maxHp?.toString() ?? "",
    currentHp: data.currentHp?.toString() ?? "",
    tempHp: data.tempHp?.toString() ?? "",
    hpDice: data.hpDice ?? "",
    attacks: (data.attacks ?? []).map((attack) => ({
      name: attack.name ?? "",
      melee: Boolean(attack.melee),
      rangeNormal: attack.rangeNormal?.toString() ?? "",
      rangeLong: attack.rangeLong?.toString() ?? "",
      attackBonus: attack.attackBonus?.toString() ?? "",
      damageDice: attack.damageDice ?? "",
      damageBonus: attack.damageBonus?.toString() ?? "",
      damageType: attack.damageType ?? "",
    })),
    spells: (data.spells ?? []).map((spell) => ({
      name: spell.name ?? "",
      level: spell.level?.toString() ?? "",
      school: spell.school ?? "",
      damageDice: spell.damageDice ?? "",
      damageBonus: spell.damageBonus?.toString() ?? "",
      damageType: spell.damageType ?? "",
      prepared: Boolean(spell.prepared),
      castingTime: spell.castingTime ?? "",
      rangeText: spell.rangeText ?? "",
      components: spell.components ?? "",
      duration: spell.duration ?? "",
      description: spell.description ?? "",
    })),
    equipment: (data.equipment ?? []).map((item) => ({
      name: item.name ?? "",
      quantity: item.quantity?.toString() ?? "",
      weight: item.weight?.toString() ?? "",
      valueGold: item.valueGold?.toString() ?? "",
      equipped: Boolean(item.equipped),
      notes: item.notes ?? "",
    })),
  };
};

const toPayloadFromResponse = (data: RpgFichaResponse): RpgFichaPayload => ({
  characterName: data.characterName ?? "",
  race: data.race ?? "",
  subRace: data.subRace ?? "",
  ancestry: data.ancestry ?? "",
  alignment: data.alignment ?? "",
  attributes: {
    strength: data.attributes?.strength ?? 0,
    dexterity: data.attributes?.dexterity ?? 0,
    constitution: data.attributes?.constitution ?? 0,
    intelligence: data.attributes?.intelligence ?? 0,
    wisdom: data.attributes?.wisdom ?? 0,
    charisma: data.attributes?.charisma ?? 0,
  },
  inspirationPoints: data.inspirationPoints ?? 0,
  proficiencyBonus: data.proficiencyBonus ?? 0,
  skillProficiencies: data.skillProficiencies ?? [],
  saveProficiencies: data.saveProficiencies ?? [],
  notes: data.notes ?? "",
  maxHp: data.maxHp ?? 0,
  currentHp: data.currentHp ?? 0,
  tempHp: data.tempHp ?? 0,
  hpDice: data.hpDice ?? "",
  attacks: (data.attacks ?? []).map((attack) => ({
    name: attack.name ?? "",
    melee: Boolean(attack.melee),
    rangeNormal: attack.rangeNormal ?? 0,
    rangeLong: attack.rangeLong ?? 0,
    attackBonus: attack.attackBonus ?? 0,
    damageDice: attack.damageDice ?? "",
    damageBonus: attack.damageBonus ?? 0,
    damageType: attack.damageType ?? "",
  })),
  spells: (data.spells ?? []).map((spell) => ({
    name: spell.name ?? "",
    level: spell.level ?? 0,
    school: spell.school ?? "",
    damageDice: spell.damageDice ?? "",
    damageBonus: spell.damageBonus ?? 0,
    damageType: spell.damageType ?? "",
    prepared: Boolean(spell.prepared),
    castingTime: spell.castingTime ?? "",
    rangeText: spell.rangeText ?? "",
    components: spell.components ?? "",
    duration: spell.duration ?? "",
    description: spell.description ?? "",
  })),
  equipment: (data.equipment ?? []).map((item) => ({
    name: item.name ?? "",
    quantity: item.quantity ?? 0,
    weight: item.weight ?? 0,
    valueGold: item.valueGold ?? 0,
    equipped: Boolean(item.equipped),
    notes: item.notes ?? "",
  })),
});

const abilityMeta: { key: AbilityKey; short: string; label: string }[] = [
  { key: "strength", short: "FOR", label: "Força" },
  { key: "dexterity", short: "DES", label: "Destreza" },
  { key: "constitution", short: "CON", label: "Constituição" },
  { key: "intelligence", short: "INT", label: "Inteligência" },
  { key: "wisdom", short: "SAB", label: "Sabedoria" },
  { key: "charisma", short: "CAR", label: "Carisma" },
];

const abilityCodes: Record<AbilityKey, string> = {
  strength: "FORCA",
  dexterity: "DESTREZA",
  constitution: "CONSTITUICAO",
  intelligence: "INTELIGENCIA",
  wisdom: "SABEDORIA",
  charisma: "CARISMA",
};

const skillMeta: { key: string; label: string; ability: AbilityKey }[] = [
  { key: "ACROBACIA", label: "Acrobacia", ability: "dexterity" },
  { key: "ARCANISMO", label: "Arcanismo", ability: "intelligence" },
  { key: "ATLETISMO", label: "Atletismo", ability: "strength" },
  { key: "FURTIVIDADE", label: "Furtividade", ability: "dexterity" },
  { key: "HISTORIA", label: "História", ability: "intelligence" },
  { key: "INTIMIDACAO", label: "Intimidação", ability: "charisma" },
  { key: "PERCEPCAO", label: "Percepção", ability: "wisdom" },
  { key: "PERSUASAO", label: "Persuasão", ability: "charisma" },
  { key: "SOBREVIVENCIA", label: "Sobrevivência", ability: "wisdom" },
];

const diceOptions = [
  { label: "d4", sides: 4 },
  { label: "d6", sides: 6 },
  { label: "d8", sides: 8 },
  { label: "d10", sides: 10 },
  { label: "d12", sides: 12 },
  { label: "d20", sides: 20 },
];

const raceOptions = [
  "HUMANO",
  "ELFO",
  "ANAO",
  "HALFLING",
  "GNOMO",
  "MEIO_ELFO",
  "MEIO_ORC",
  "TIEFLING",
  "DRACONATO",
  "AASIMAR",
  "ORC",
  "GOBLIN",
  "HOBGOBLIN",
  "BUGBEAR",
  "KOBOLD",
  "FIRBOLG",
  "KENKU",
  "TABAXI",
  "LIZARDFOLK",
  "TORTLE",
  "GITH",
  "WARFORGED",
  "CHANGELING",
  "SHIFTER",
  "KALASHTAR",
  "FAIRY",
];

const subRaceOptions = [
  "ALTO_ELFO",
  "ELFO_DA_FLORESTA",
  "DROW",
  "ELADRIN",
  "SHADAR_KAI",
  "ASTRAL_ELFO",
  "ANAO_DA_COLINA",
  "ANAO_DA_MONTANHA",
  "DUERGAR",
  "PES_LEVES",
  "ROBUSTO",
  "GNOMO_DA_FLORESTA",
  "GNOMO_DAS_ROCHAS",
  "GNOMO_PROFUNDO",
  "TIEFLING_INFERNAL",
  "AASIMAR_PROTETOR",
  "AASIMAR_FLAGELADO",
  "AASIMAR_CAIDO",
  "GITHYANKI",
  "GITHZERAI",
];

const ancestryOptions = [
  "DRACONICO_CROMATICO",
  "DRACONICO_METALICO",
  "DRACONICO_GEMA",
  "DRAGAO_VERMELHO",
  "DRAGAO_AZUL",
  "DRAGAO_VERDE",
  "DRAGAO_PRETO",
  "DRAGAO_BRANCO",
  "DRAGAO_DOURADO",
  "DRAGAO_PRATEADO",
  "DRAGAO_BRONZE",
  "DRAGAO_COBRE",
  "DRAGAO_LATAO",
  "DRAGAO_AMETISTA",
  "DRAGAO_CRISTAL",
  "DRAGAO_ESMERALDA",
  "DRAGAO_SAFIRA",
  "DRAGAO_TOPAZIO",
  "INFERNAL_ASMODEUS",
  "INFERNAL_BAALZEBUL",
  "INFERNAL_DISPATER",
  "INFERNAL_MEPHISTOPHELES",
  "INFERNAL_ZARIEL",
  "CELESTIAL",
  "CAIDO",
  "PROTETOR",
];

const damageTypeOptions = [
  "CORTANTE",
  "PERFURANTE",
  "CONCUSSAO",
  "FOGO",
  "GELO",
  "TROVAO",
  "NECROTICO",
  "RADIANTE",
  "ACIDO",
  "VENENO",
  "PSIQUICO",
  "FORCE",
];

const createEmptyForm = (): FichaForm => ({
  characterName: "",
  race: "",
  subRace: "",
  ancestry: "",
  alignment: "",
  attributes: {
    strength: "",
    dexterity: "",
    constitution: "",
    intelligence: "",
    wisdom: "",
    charisma: "",
  },
  inspirationPoints: "",
  proficiencyBonus: "",
  skillProficiencies: [],
  saveProficiencies: [],
  notes: "",
  maxHp: "",
  currentHp: "",
  tempHp: "",
  hpDice: "",
  attacks: [],
  spells: [],
  equipment: [],
});

const createEmptyAttack = (): AttackForm => ({
  name: "",
  melee: true,
  rangeNormal: "",
  rangeLong: "",
  attackBonus: "",
  damageDice: "",
  damageBonus: "",
  damageType: "",
});

const createEmptySpell = (): SpellForm => ({
  name: "",
  level: "",
  school: "",
  damageDice: "",
  damageBonus: "",
  damageType: "",
  prepared: false,
  castingTime: "",
  rangeText: "",
  components: "",
  duration: "",
  description: "",
});

const createEmptyEquipment = (): EquipmentForm => ({
  name: "",
  quantity: "",
  weight: "",
  valueGold: "",
  equipped: false,
  notes: "",
});

const formatEnumLabel = (value: string) =>
  value
    ? value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

const uniqueArray = (items: string[]) => Array.from(new Set(items));

const formatSigned = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

const formatModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return formatSigned(mod);
};

const toNumber = (value: string) => {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toNumeric = (value: string | number | null | undefined) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") return toNumber(value);
  return 0;
};

const getAppliedProficiency = (value: string | number | null | undefined) => {
  const num = toNumeric(value);
  if (num <= 0) return 2;
  return Math.min(num, 2);
};

const buildActionDesc = (attack: AttackForm) => {
  if (attack.melee) return "Marcial • Corpo a Corpo";
  const rangeNormal = toNumber(attack.rangeNormal);
  const rangeLong = toNumber(attack.rangeLong);
  const hasRange = rangeNormal || rangeLong;
  return `Marcial • ${hasRange ? `${rangeNormal}/${rangeLong}` : "À Distância"}`;
};

export default function FichaPage({
  initialMode = "edit",
  initialData = null,
}: {
  initialMode?: "edit" | "view";
  initialData?: RpgFichaResponse | null;
}) {
  const [form, setForm] = useState<FichaForm>(mapPayloadToForm(initialData));
  const [showDice, setShowDice] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [diceSides, setDiceSides] = useState(20);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "view">(initialMode);
  const [savedFicha, setSavedFicha] = useState<RpgFichaResponse | null>(initialData ?? null);
  const [activeTab, setActiveTab] = useState<TabKey>("actions");
  const [editModal, setEditModal] = useState<ModalState | null>(null);
  const [isHpSyncing, setIsHpSyncing] = useState(false);
  const [isModalSaving, setIsModalSaving] = useState(false);
  const hpSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attributes = abilityMeta.map((ability) => {
    const score = toNumber(form.attributes[ability.key]);
    return {
      label: ability.short,
      key: ability.key,
      score,
      mod: formatModifier(score),
    };
  });

  const proficiencyValue = getAppliedProficiency(form.proficiencyBonus);

  const savingThrows = abilityMeta.map((ability) => {
    const mod = Math.floor((toNumber(form.attributes[ability.key]) - 10) / 2);
    const proficient = form.saveProficiencies.includes(abilityCodes[ability.key]);
    const total = mod + (proficient ? proficiencyValue : 0);
    return { label: ability.label, code: abilityCodes[ability.key], value: formatSigned(total) };
  });

  const skills = skillMeta.map((skill) => {
    const abilityScore = toNumber(form.attributes[skill.ability]);
    const mod = Math.floor((abilityScore - 10) / 2);
    const proficient = form.skillProficiencies.includes(skill.key);
    const total = mod + (proficient ? proficiencyValue : 0);
    return { label: skill.label, key: skill.key, value: formatSigned(total) };
  });

  const handleDiceRoll = () => {
    const next = Math.floor(Math.random() * diceSides) + 1;
    setDiceValue(next);
  };

  useEffect(() => {
    return () => {
      if (hpSyncTimer.current) {
        clearTimeout(hpSyncTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm(mapPayloadToForm(initialData));
      setSavedFicha(initialData);
    }
  }, [initialData]);

  const adjustHp = (delta: number) => {
    setForm((current) => {
      const max = toNumber(current.maxHp);
      const hp = toNumber(current.currentHp);
      const next = Math.max(0, Math.min(max || hp + delta, hp + delta));
      return { ...current, currentHp: next.toString() };
    });
  };

  const openAttackModal = (index?: number) => {
    const hasIndex = typeof index === "number";
    const data = hasIndex ? form.attacks[index!] : createEmptyAttack();
    setEditModal({ type: "attack", index: hasIndex ? index! : null, data });
  };

  const openSpellModal = (index?: number) => {
    const hasIndex = typeof index === "number";
    const data = hasIndex ? form.spells[index!] : createEmptySpell();
    setEditModal({ type: "spell", index: hasIndex ? index! : null, data });
  };

  const openEquipmentModal = (index?: number) => {
    const hasIndex = typeof index === "number";
    const data = hasIndex ? form.equipment[index!] : createEmptyEquipment();
    setEditModal({ type: "equipment", index: hasIndex ? index! : null, data });
  };

  const saveModal = async () => {
    if (!editModal) return;
    setIsModalSaving(true);
    try {
      let nextForm = form;
      if (editModal.type === "attack") {
        const next = [...form.attacks];
        if (editModal.index === null) {
          next.push(editModal.data);
        } else {
          next[editModal.index] = editModal.data;
        }
        nextForm = { ...form, attacks: next };
      }
      if (editModal.type === "spell") {
        const next = [...form.spells];
        if (editModal.index === null) {
          next.push(editModal.data);
        } else {
          next[editModal.index] = editModal.data;
        }
        nextForm = { ...form, spells: next };
      }
      if (editModal.type === "equipment") {
        const next = [...form.equipment];
        if (editModal.index === null) {
          next.push(editModal.data);
        } else {
          next[editModal.index] = editModal.data;
        }
        nextForm = { ...form, equipment: next };
      }

      setForm(nextForm);

      if (savedFicha?.id) {
        const payload = mapFormToPayload(nextForm);
        const result = await updateRpgFicha(savedFicha.id, payload);
        const updated = { ...(result ?? payload), id: savedFicha.id } as RpgFichaResponse;
        setSavedFicha(updated);
      }
      setEditModal(null);
    } catch (error) {
      console.error("Falha ao salvar via modal:", error);
      setSaveError(error instanceof Error ? error.message : "Erro ao salvar mudanças.");
    } finally {
      setIsModalSaving(false);
    }
  };

  const removeAttack = (index: number) => {
    setForm((current) => ({
      ...current,
      attacks: current.attacks.filter((_, i) => i !== index),
    }));
  };

  const removeSpell = (index: number) => {
    setForm((current) => ({
      ...current,
      spells: current.spells.filter((_, i) => i !== index),
    }));
  };

  const removeEquipment = (index: number) => {
    setForm((current) => ({
      ...current,
      equipment: current.equipment.filter((_, i) => i !== index),
    }));
  };

  const updateModalData = (field: string, value: string | boolean) => {
    setEditModal((current) =>
      current
        ? ({
            ...current,
            data: { ...(current as ModalState).data, [field]: value },
          } as ModalState)
        : current
    );
  };

  const mapFormToPayload = (data: FichaForm = form): RpgFichaPayload => ({
    characterName: data.characterName,
    race: data.race,
    subRace: data.subRace,
    ancestry: data.ancestry,
    alignment: data.alignment,
    attributes: abilityMeta.reduce(
      (acc, ability) => ({ ...acc, [ability.key]: toNumber(data.attributes[ability.key]) }),
      {} as AttributeBlock
    ),
    inspirationPoints: toNumber(data.inspirationPoints),
    proficiencyBonus: toNumber(data.proficiencyBonus),
    skillProficiencies: data.skillProficiencies,
    saveProficiencies: data.saveProficiencies,
    notes: data.notes,
    maxHp: toNumber(data.maxHp),
    currentHp: toNumber(data.currentHp),
    tempHp: toNumber(data.tempHp),
    hpDice: data.hpDice,
    attacks: data.attacks.map((attack) => ({
      name: attack.name,
      melee: attack.melee,
      rangeNormal: toNumber(attack.rangeNormal),
      rangeLong: toNumber(attack.rangeLong),
      attackBonus: toNumber(attack.attackBonus),
      damageDice: attack.damageDice,
      damageBonus: toNumber(attack.damageBonus),
      damageType: attack.damageType,
    })),
    spells: data.spells.map((spell) => ({
      name: spell.name,
      level: toNumber(spell.level),
      school: spell.school,
      damageDice: spell.damageDice,
      damageBonus: toNumber(spell.damageBonus),
      damageType: spell.damageType,
      prepared: spell.prepared,
      castingTime: spell.castingTime,
      rangeText: spell.rangeText,
      components: spell.components,
      duration: spell.duration,
      description: spell.description,
    })),
    equipment: data.equipment.map((item) => ({
      name: item.name,
      quantity: toNumber(item.quantity),
      weight: toNumber(item.weight),
      valueGold: toNumber(item.valueGold),
      equipped: item.equipped,
      notes: item.notes,
    })),
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const payload = mapFormToPayload();
      const result = savedFicha?.id
        ? await updateRpgFicha(savedFicha.id, payload)
        : await createRpgFicha(payload);
      const savedData = {
        ...(result ?? payload),
        id: savedFicha?.id ?? (result as RpgFichaResponse | null)?.id,
      } as RpgFichaResponse;
      setSavedFicha(savedData);
      setMode("view");
      setSaveMessage("Ficha salva com sucesso!");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Não foi possível salvar a ficha."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const queueHpSync = (nextData: RpgFichaResponse) => {
    if (!nextData.id) return;
    if (hpSyncTimer.current) {
      clearTimeout(hpSyncTimer.current);
    }
    hpSyncTimer.current = setTimeout(async () => {
      setIsHpSyncing(true);
      try {
        await updateRpgFicha(nextData.id as string, toPayloadFromResponse(nextData));
      } catch (error) {
        console.error("Falha ao sincronizar HP:", error);
      } finally {
        setIsHpSyncing(false);
      }
    }, 250);
  };

  const handlePreviewHpChange = (value: number) => {
    setSavedFicha((current) => {
      if (!current) return current;
      const next = { ...current, currentHp: value };
      queueHpSync(next);
      return next;
    });
  };

  const toggleSaveProficiency = (code: string) => {
    setForm((current) => {
      const exists = current.saveProficiencies.includes(code);
      const next = exists
        ? current.saveProficiencies.filter((c) => c !== code)
        : uniqueArray([...current.saveProficiencies, code]);
      return { ...current, saveProficiencies: next };
    });
  };

  const toggleSkillProficiency = (key: string) => {
    setForm((current) => {
      const exists = current.skillProficiencies.includes(key);
      const next = exists
        ? current.skillProficiencies.filter((c) => c !== key)
        : uniqueArray([...current.skillProficiencies, key]);
      return { ...current, skillProficiencies: next };
    });
  };

  const updateAttribute = (key: AbilityKey, rawValue: string) => {
    setForm((current) => ({
      ...current,
      attributes: { ...current.attributes, [key]: rawValue },
    }));
  };
  const renderTabContent = () => {
    if (activeTab === "actions") {
      return (
        <div className="space-y-3">
          {form.attacks.length === 0 && (
            <EmptyState message="Nenhuma ação cadastrada. Adicione ataques ou ações especiais." />
          )}

          {form.attacks.map((attack, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-[#0f0f25] p-4 text-sm text-slate-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{attack.name || "Ataque"}</div>
                  <div className="text-xs text-indigo-200">{buildActionDesc(attack)}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openAttackModal(index)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeAttack(index)}>
                    Remover
                  </Button>
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-300">
                Bônus {formatSigned(toNumber(attack.attackBonus))} • Dano {attack.damageDice || "—"}{" "}
                {attack.damageBonus ? formatSigned(toNumber(attack.damageBonus)) : ""} • Tipo{" "}
                {attack.damageType || "—"} • Alcance {attack.rangeNormal || "—"}/{attack.rangeLong || "—"}
              </div>
            </div>
          ))}

          <Button size="sm" variant="outline" onClick={() => openAttackModal()}>
            + Adicionar Ataque/Ação
          </Button>
        </div>
      );
    }

    if (activeTab === "spells") {
      return (
        <div className="space-y-3">
          {form.spells.length === 0 && (
            <EmptyState message="Nenhuma magia adicionada. Cadastre suas magias preparadas." />
          )}

          {form.spells.map((spell, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-[#0f0f25] p-4 text-sm text-slate-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{spell.name || "Magia"}</div>
                  <div className="text-xs text-indigo-200">
                    Nível {spell.level || "0"} • {spell.school || "—"} • {spell.castingTime || "—"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openSpellModal(index)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeSpell(index)}>
                    Remover
                  </Button>
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-300">
                Alcance {spell.rangeText || "—"} • Dano {spell.damageDice || "—"}{" "}
                {spell.damageBonus ? formatSigned(toNumber(spell.damageBonus)) : ""} • Tipo {spell.damageType || "—"}
              </div>
            </div>
          ))}

          <Button size="sm" variant="outline" onClick={() => openSpellModal()}>
            + Adicionar Magia
          </Button>
        </div>
      );
    }

    if (activeTab === "equipment") {
      return (
        <div className="space-y-3">
          {form.equipment.length === 0 && (
            <EmptyState message="Nenhum item cadastrado. Adicione o equipamento carregado." />
          )}

          {form.equipment.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-[#0f0f25] p-4 text-sm text-slate-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{item.name || "Item"}</div>
                  <div className="text-xs text-indigo-200">
                    Quantidade {item.quantity || "—"} • Peso {item.weight || "—"} • Valor {item.valueGold || "—"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEquipmentModal(index)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeEquipment(index)}>
                    Remover
                  </Button>
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-300">
                {item.equipped ? "Equipado" : "Mochila"} • Notas: {item.notes || "—"}
              </div>
            </div>
          ))}

          <Button size="sm" variant="outline" onClick={() => openEquipmentModal()}>
            + Adicionar Item
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <Field label="Notas e Características">
          <Textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Traços de personalidade, vínculos, características de classe..."
          />
        </Field>
      </div>
    );
  };

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
              <span className="text-indigo-200">
                {mode === "edit" ? "Nova Ficha" : "Ficha salva"}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {mode === "edit" ? "Registro de Novo Personagem" : "Ficha estilizada"}
            </h1>
            <p className="text-sm text-slate-400">
              {mode === "edit"
                ? "Cadastre uma ficha limpa com os campos do payload da API."
                : "Visualização não editável da ficha salva. Clique em editar para voltar aos campos."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {mode === "edit" ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setForm(createEmptyForm())}>
                  Limpar
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Ficha"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button variant="secondary" onClick={() => setMode("edit")}>
                  Editar ficha
                </Button>
                <Button onClick={() => setShowDice(true)}>Abrir mesa de dados</Button>
              </div>
            )}
            {saveMessage && (
              <span className="text-xs text-emerald-300">{saveMessage}</span>
            )}
            {saveError && <span className="text-xs text-red-300">{saveError}</span>}
            {savedFicha?.id && mode === "view" && (
              <span className="text-[11px] text-indigo-200">
                ID salvo: {savedFicha.id}
              </span>
            )}
          </div>
        </div>

        {mode === "edit" ? (
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
                  <Input
                    value={form.characterName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        characterName: event.target.value,
                      }))
                    }
                    placeholder="Ex: Aventureiro"
                  />
                </Field>
                <Field label="Raça">
                  <Select
                    value={form.race}
                    placeholder="Selecione"
                    options={raceOptions}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        race: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Sub-raça">
                  <Select
                    value={form.subRace}
                    placeholder="Selecione"
                    options={subRaceOptions}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        subRace: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Ancestralidade">
                  <Select
                    value={form.ancestry}
                    placeholder="Selecione"
                    options={ancestryOptions}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        ancestry: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Alinhamento">
                  <Input
                    value={form.alignment}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        alignment: event.target.value,
                      }))
                    }
                    placeholder="Neutro, Leal e Bom..."
                  />
                </Field>
                <Field label="Dados de Vida">
                  <Input
                    value={form.hpDice}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        hpDice: event.target.value,
                      }))
                    }
                    placeholder="Ex: 1d10"
                  />
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
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={form.attributes[attr.key]}
                      className="mt-2 text-center"
                      onChange={(event) => updateAttribute(attr.key, event.target.value)}
                    />
                    <div className="mt-1 text-sm text-indigo-200">{attr.mod}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="rounded-lg border border-indigo-600/40 bg-indigo-900/30 px-3 py-2">
                  <div className="text-xs uppercase text-slate-400">Inspiração</div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.inspirationPoints}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        inspirationPoints: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div className="text-xs uppercase text-slate-400">Bônus de Prof.</div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.proficiencyBonus}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        proficiencyBonus: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-6">
            <Card>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat title="Classe Arm." value="—" />
                <Stat
                  title="Iniciativa"
                  value={formatSigned(Math.floor((toNumber(form.attributes.dexterity) - 10) / 2))}
                />
                <Stat title="Deslocamento" value="—" />
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="font-semibold text-indigo-100">Pontos de Vida</span>
                    <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-100">
                      Vital
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg text-slate-200 transition hover:border-red-500/50 hover:text-white"
                        onClick={() => adjustHp(-1)}
                      >
                        -
                      </button>
                      <div className="flex-1">
                        <ProgressBar
                          value={toNumber(form.currentHp)}
                          max={Math.max(1, toNumber(form.maxHp))}
                          color="red"
                        />
                        <div className="mt-1 flex justify-between text-xs text-slate-400">
                          <span>
                            {toNumber(form.currentHp)} / {toNumber(form.maxHp)}
                          </span>
                          <span>Máximo: {toNumber(form.maxHp)}</span>
                        </div>
                      </div>
                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg text-slate-200 transition hover:border-emerald-500/50 hover:text-white"
                        onClick={() => adjustHp(1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs text-slate-400 sm:grid-cols-3 sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">
                          Vida Temp
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={form.tempHp}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              tempHp: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">
                          Vida Máx
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={form.maxHp}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              maxHp: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">
                          Vida Atual
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={form.currentHp}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              currentHp: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-sm font-medium text-indigo-100">
                  <Tab active={activeTab === "actions"} onClick={() => setActiveTab("actions")}>
                    Ações &amp; Ataques
                  </Tab>
                  <Tab active={activeTab === "spells"} onClick={() => setActiveTab("spells")}>
                    Magias
                  </Tab>
                  <Tab active={activeTab === "equipment"} onClick={() => setActiveTab("equipment")}>
                    Equipamento
                  </Tab>
                  <Tab active={activeTab === "features"} onClick={() => setActiveTab("features")}>
                    Características
                  </Tab>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setShowDice(true)}>
                    Mesa de Dados (lateral)
                  </Button>
                </div>
              </div>
              <div className="mt-4">{renderTabContent()}</div>
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
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-indigo-100">{save.value}</span>
                      <RoundToggle
                        ariaLabel={`Proficiência em ${save.label}`}
                        checked={form.saveProficiencies.includes(save.code)}
                        onChange={() => toggleSaveProficiency(save.code)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Perícias" />
              <div className="mt-3 space-y-3 text-sm">
                {skills.map((skill) => (
                  <div
                    key={skill.key}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-slate-200"
                  >
                    <span>{skill.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-indigo-100">{skill.value}</span>
                      <RoundToggle
                        ariaLabel={`Proficiência em ${skill.label}`}
                        checked={form.skillProficiencies.includes(skill.key)}
                        onChange={() => toggleSkillProficiency(skill.key)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Notas Rápidas" />
              <div className="mt-3 rounded-xl border border-dashed border-indigo-500/40 bg-[#0f0f25] p-3 text-sm text-slate-300">
                <Textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Anote ideias, vínculos ou defeitos."
                />
              </div>
            </Card>
          </div>
        </section>
        ) : savedFicha ? (
          <FichaPreview
            data={savedFicha}
            onEdit={() => {
              setMode("edit");
              setForm(mapPayloadToForm(savedFicha));
            }}
            onOpenDice={() => setShowDice(true)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onHpChange={handlePreviewHpChange}
            isSyncingHp={isHpSyncing}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Salve a ficha primeiro para liberar a visualização estilizada.
          </div>
        )}
      </div>

      {editModal && (
        <Modal
          title={
            editModal.type === "attack"
              ? editModal.index === null
                ? "Adicionar Ataque/Ação"
                : "Editar Ataque/Ação"
              : editModal.type === "spell"
                ? editModal.index === null
                  ? "Adicionar Magia"
                  : "Editar Magia"
                : editModal.index === null
                  ? "Adicionar Equipamento"
                  : "Editar Equipamento"
          }
          onClose={() => setEditModal(null)}
          onSave={saveModal}
          primaryLabel={editModal.index === null ? "Adicionar" : "Salvar"}
          saving={isModalSaving}
        >
          {editModal.type === "attack" && (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Field label="Nome do Ataque">
                  <Input
                    value={editModal.data.name}
                    onChange={(event) => updateModalData("name", event.target.value)}
                    placeholder="Ex: Espada Longa"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Bônus de Ataque">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.attackBonus}
                    onChange={(event) => updateModalData("attackBonus", event.target.value)}
                    placeholder="Ex: 5"
                  />
                </Field>
                <Field label="Dado de Dano">
                  <Input
                    value={editModal.data.damageDice}
                    onChange={(event) => updateModalData("damageDice", event.target.value)}
                    placeholder="Ex: 1d8"
                  />
                </Field>
                <Field label="Bônus de Dano">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.damageBonus}
                    onChange={(event) => updateModalData("damageBonus", event.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Tipo de Dano">
                  <Select
                    value={editModal.data.damageType}
                    placeholder="Selecione"
                    options={damageTypeOptions}
                    onChange={(value) => updateModalData("damageType", value)}
                  />
                </Field>
                <Field label="Alcance Normal">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.rangeNormal}
                    onChange={(event) => updateModalData("rangeNormal", event.target.value)}
                  />
                </Field>
                <Field label="Alcance Longo">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.rangeLong}
                    onChange={(event) => updateModalData("rangeLong", event.target.value)}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Checkbox
                  label="Corpo a corpo"
                  checked={editModal.data.melee}
                  onChange={(checked) => updateModalData("melee", checked)}
                />
              </div>
            </div>
          )}

          {editModal.type === "spell" && (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Field label="Nome da Magia">
                  <Input
                    value={editModal.data.name}
                    onChange={(event) => updateModalData("name", event.target.value)}
                    placeholder="Ex: Raio de Fogo"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <Field label="Nível">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.level}
                    onChange={(event) => updateModalData("level", event.target.value)}
                  />
                </Field>
                <Field label="Escola">
                  <Input
                    value={editModal.data.school}
                    onChange={(event) => updateModalData("school", event.target.value)}
                  />
                </Field>
                <Field label="Tempo de Conjuração">
                  <Input
                    value={editModal.data.castingTime}
                    onChange={(event) => updateModalData("castingTime", event.target.value)}
                  />
                </Field>
                <Field label="Alcance">
                  <Input
                    value={editModal.data.rangeText}
                    onChange={(event) => updateModalData("rangeText", event.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Componentes">
                  <Input
                    value={editModal.data.components}
                    onChange={(event) => updateModalData("components", event.target.value)}
                  />
                </Field>
                <Field label="Duração">
                  <Input
                    value={editModal.data.duration}
                    onChange={(event) => updateModalData("duration", event.target.value)}
                  />
                </Field>
                <Field label="Tipo de Dano">
                  <Select
                    value={editModal.data.damageType}
                    placeholder="Selecione"
                    options={damageTypeOptions}
                    onChange={(value) => updateModalData("damageType", value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Dado de Dano">
                  <Input
                    value={editModal.data.damageDice}
                    onChange={(event) => updateModalData("damageDice", event.target.value)}
                  />
                </Field>
                <Field label="Bônus de Dano">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.damageBonus}
                    onChange={(event) => updateModalData("damageBonus", event.target.value)}
                  />
                </Field>
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Preparada?</span>
                  <Checkbox
                    label="Magia preparada"
                    checked={editModal.data.prepared}
                    onChange={(checked) => updateModalData("prepared", checked)}
                  />
                </div>
              </div>
              <Field label="Descrição">
                <Textarea
                  value={editModal.data.description}
                  onChange={(event) => updateModalData("description", event.target.value)}
                  placeholder="Efeitos, condições, detalhes narrativos..."
                />
              </Field>
            </div>
          )}

          {editModal.type === "equipment" && (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Field label="Nome do Item">
                  <Input
                    value={editModal.data.name}
                    onChange={(event) => updateModalData("name", event.target.value)}
                    placeholder="Ex: Mochila"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <Field label="Quantidade">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.quantity}
                    onChange={(event) => updateModalData("quantity", event.target.value)}
                  />
                </Field>
                <Field label="Peso">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.weight}
                    onChange={(event) => updateModalData("weight", event.target.value)}
                  />
                </Field>
                <Field label="Valor (PO)">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editModal.data.valueGold}
                    onChange={(event) => updateModalData("valueGold", event.target.value)}
                  />
                </Field>
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Status</span>
                  <Checkbox
                    label="Equipado"
                    checked={editModal.data.equipped}
                    onChange={(checked) => updateModalData("equipped", checked)}
                  />
                </div>
              </div>
              <Field label="Notas">
                <Textarea
                  value={editModal.data.notes}
                  onChange={(event) => updateModalData("notes", event.target.value)}
                  placeholder="Detalhes, posição na mochila..."
                />
              </Field>
            </div>
          )}
        </Modal>
      )}

      {showDice && (
        <DiceTray
          value={diceValue}
          sides={diceSides}
          onClose={() => setShowDice(false)}
          onRoll={handleDiceRoll}
          onResult={(r) => {
            setDiceValue(r);
          }}
          onChangeSides={(s) => {
            setDiceSides(s);
            setDiceValue(1);
          }}
        />
      )}
    </div>
  );
}

function FichaPreview({
  data,
  onEdit,
  onOpenDice,
  activeTab,
  onTabChange,
  onHpChange,
  isSyncingHp = false,
}: {
  data: RpgFichaResponse;
  onEdit: () => void;
  onOpenDice: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onHpChange: (hp: number) => void;
  isSyncingHp?: boolean;
}) {
  const abilityScores = abilityMeta.map((ability) => {
    const score = data.attributes?.[ability.key] ?? 0;
    return {
      label: ability.label,
      short: ability.short,
      score,
      mod: formatModifier(score),
    };
  });

  const savingThrows = abilityMeta.map((ability) => {
    const mod = Math.floor(((data.attributes?.[ability.key] ?? 10) - 10) / 2);
    const proficient = data.saveProficiencies?.includes(abilityCodes[ability.key]);
    const total = mod + (proficient ? getAppliedProficiency(data.proficiencyBonus) : 0);
    return {
      label: ability.label,
      proficient,
      value: formatSigned(total),
    };
  });

  const skillList = skillMeta.map((skill) => {
    const abilityScore = data.attributes?.[skill.ability] ?? 10;
    const mod = Math.floor((abilityScore - 10) / 2);
    const proficient = data.skillProficiencies?.includes(skill.key);
    const total = mod + (proficient ? Math.max(0, toNumeric(data.proficiencyBonus)) : 0);
    return {
      label: skill.label,
      proficient,
      value: formatSigned(total),
    };
  });

  const hpMax = data.maxHp || 0;
  const hpCurrent = data.currentHp || 0;
  const [hpValue, setHpValue] = useState(hpCurrent);
  const hpPercent = Math.min(100, Math.max(0, Math.round((hpValue / Math.max(1, hpMax)) * 100)));

  useEffect(() => {
    setHpValue(hpCurrent);
  }, [hpCurrent]);

  const renderViewTabs = () => {
    if (activeTab === "actions") {
      return data.attacks && data.attacks.length > 0 ? (
        <div className="space-y-3">
          {data.attacks.map((attack) => {
            const attackBonus = formatSigned(attack.attackBonus ?? 0);
            const rangeNormal = attack.rangeNormal ?? "";
            const rangeLong = attack.rangeLong ?? "";

            return (
              <div
                key={attack.id ?? attack.name}
                className="rounded-xl border border-white/10 bg-[#0f0f25] p-4 shadow-inner shadow-black/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">{attack.name || "Ataque"}</div>
                    <div className="text-xs text-indigo-200">
                      {attack.melee ? "Corpo a corpo" : "À distância"} •{" "}
                      {buildActionDesc({
                        name: attack.name,
                        melee: attack.melee,
                        rangeNormal: `${rangeNormal}`,
                        rangeLong: `${rangeLong}`,
                        attackBonus: `${attack.attackBonus ?? 0}`,
                        damageDice: attack.damageDice,
                        damageBonus: `${attack.damageBonus ?? 0}`,
                        damageType: attack.damageType,
                      })}
                    </div>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-100">
                    Bônus {attackBonus}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  Dano: <span className="font-semibold text-white">{attack.damageDice || "—"}</span>{" "}
                  {attack.damageBonus ? formatSigned(attack.damageBonus ?? 0) : ""} • Tipo {attack.damageType || "—"} •
                  Alcance {rangeNormal || "—"}/{rangeLong || "—"}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState message="Nenhuma ação cadastrada ainda." />
      );
    }

    if (activeTab === "spells") {
      return data.spells && data.spells.length > 0 ? (
        <div className="space-y-3">
          {data.spells.map((spell) => (
            <div
              key={spell.id ?? spell.name}
              className="rounded-xl border border-indigo-500/30 bg-indigo-900/20 p-4 shadow-inner shadow-indigo-900/20"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{spell.name || "Magia"}</div>
                  <div className="text-xs text-indigo-200">
                    Nível {spell.level ?? 0} • {spell.school || "—"} • {spell.castingTime || "—"}
                  </div>
                </div>
                {spell.prepared && (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] text-emerald-100">
                    Preparada
                  </span>
                )}
              </div>
              <div className="mt-2 text-sm text-slate-200">
                Alcance {spell.rangeText || "—"} • Dano {spell.damageDice || "—"}{" "}
                {spell.damageBonus ? formatSigned(spell.damageBonus) : ""} • Tipo {spell.damageType || "—"}
              </div>
              <p className="mt-2 text-sm text-slate-300">{spell.description || "Sem descrição adicionada."}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="Nenhuma magia cadastrada." />
      );
    }

    if (activeTab === "equipment") {
      return data.equipment && data.equipment.length > 0 ? (
        <div className="space-y-3">
          {data.equipment.map((item) => (
            <div
              key={item.id ?? item.name}
              className="rounded-xl border border-white/10 bg-[#0f0f25] p-4 shadow-inner shadow-black/30"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{item.name || "Item"}</div>
                  <div className="text-xs text-indigo-200">
                    Qtd {item.quantity || "—"} • Peso {item.weight || "—"} • Valor {item.valueGold || "—"}
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-100">
                  {item.equipped ? "Equipado" : "Mochila"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.notes || "Sem notas adicionais."}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="Nenhum equipamento cadastrado." />
      );
    }

    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        {data.notes || "Sem notas cadastradas para este personagem."}
      </div>
    );
  };

  return (
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
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">Nome do Personagem</span>
              <span className="text-base font-semibold text-white">
                {data.characterName || "Personagem sem nome"}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">Raça</span>
              <span className="text-sm text-indigo-100">
                {data.race ? formatEnumLabel(data.race) : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">Sub-raça</span>
              <span className="text-sm text-indigo-100">
                {data.subRace ? formatEnumLabel(data.subRace) : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">Ancestralidade</span>
              <span className="text-sm text-indigo-100">
                {data.ancestry ? formatEnumLabel(data.ancestry) : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">Alinhamento</span>
              <span className="text-sm text-indigo-100">{data.alignment || "—"}</span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">Dados de Vida</span>
              <span className="text-sm text-indigo-100">{data.hpDice || "—"}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6 lg:col-span-3">
        <Card>
          <CardHeader title="Atributos" />
          <div className="mt-4 grid grid-cols-1 gap-3">
            {abilityScores.map((attr) => (
              <div
                key={attr.label}
                className="rounded-xl border border-white/5 bg-[#0f0e24] p-3 text-center shadow-inner shadow-black/30"
              >
                <div className="text-xs uppercase tracking-widest text-slate-400">{attr.label}</div>
                <div className="mt-2 text-3xl font-semibold text-white">{attr.score}</div>
                <div className="mt-1 text-sm text-indigo-200">{attr.mod}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
            <div className="rounded-lg border border-indigo-600/40 bg-indigo-900/30 px-3 py-2">
              <div className="text-xs uppercase text-slate-400">Inspiração</div>
              <div className="mt-1 text-lg font-semibold text-white">{data.inspirationPoints ?? 0}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-xs uppercase text-slate-400">Bônus de Prof.</div>
              <div className="mt-1 text-lg font-semibold text-white">{data.proficiencyBonus ?? 0}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6 lg:col-span-6">
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat title="Classe Arm." value="—" />
            <Stat title="Iniciativa" value={formatSigned(Math.floor(((data.attributes?.dexterity ?? 10) - 10) / 2))} />
            <Stat title="Deslocamento" value="—" />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="font-semibold text-indigo-100">Pontos de Vida</span>
                <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-100">Vital</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <ProgressBar value={hpValue} max={Math.max(1, hpMax)} color="red" />
                      <div
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/60 bg-white/80 shadow"
                        style={{ left: `${hpPercent}%` }}
                        aria-hidden
                      />
                      <input
                        type="range"
                        min={0}
                        max={Math.max(1, hpMax)}
                        value={hpValue}
                        onChange={(event) => {
                          const next = Number(event.target.value) || 0;
                          setHpValue(next);
                          onHpChange(next);
                        }}
                        className="absolute inset-0 h-3 w-full cursor-ew-resize opacity-0"
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-slate-400">
                      <span>
                        {hpValue} / {hpMax}
                      </span>
                      <span>Temp: {data.tempHp ?? 0}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs text-slate-400 sm:grid-cols-3 sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">Vida Temp</span>
                    <span className="text-sm text-indigo-100">{data.tempHp ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">Vida Máx</span>
                    <span className="text-sm text-indigo-100">{hpMax}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/5 px-2 py-1 text-slate-200">Vida Atual</span>
                    <span className="text-sm text-indigo-100">{hpValue}</span>
                  </div>
                </div>
                {isSyncingHp && (
                  <div className="text-[11px] text-indigo-200">Sincronizando HP com o servidor...</div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-sm font-medium text-indigo-100">
              <Tab active={activeTab === "actions"} onClick={() => onTabChange("actions")}>
                Ações &amp; Ataques
              </Tab>
              <Tab active={activeTab === "spells"} onClick={() => onTabChange("spells")}>
                Magias
              </Tab>
              <Tab active={activeTab === "equipment"} onClick={() => onTabChange("equipment")}>
                Equipamento
              </Tab>
              <Tab active={activeTab === "features"} onClick={() => onTabChange("features")}>
                Características
              </Tab>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={onOpenDice}>
                Mesa de Dados (lateral)
              </Button>
              <Button size="sm" onClick={onEdit}>
                Editar ficha
              </Button>
            </div>
          </div>
          <div className="mt-4">{renderViewTabs()}</div>
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
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-indigo-100">{save.value}</span>
                  <RoundToggle
                    ariaLabel={`Proficiência em ${save.label}`}
                    checked={save.proficient}
                    onChange={() => {
                      /* modo leitura */
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Perícias" />
          <div className="mt-3 space-y-3 text-sm">
            {skillList.map((skill) => (
              <div
                key={skill.label}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-slate-200"
              >
                <span>{skill.label}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-indigo-100">{skill.value}</span>
                  <RoundToggle
                    ariaLabel={`Proficiência em ${skill.label}`}
                    checked={skill.proficient}
                    onChange={() => {
                      /* modo leitura */
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Notas Rápidas" />
          <div className="mt-3 rounded-xl border border-dashed border-indigo-500/40 bg-[#0f0f25] p-3 text-sm text-slate-300">
            <p className="whitespace-pre-wrap leading-relaxed">
              {data.notes || "Sem notas cadastradas para este personagem."}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Modal({
  title,
  children,
  onClose,
  onSave,
  primaryLabel = "Salvar",
  saving = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  primaryLabel?: string;
  saving?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0d0c1f] p-6 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Salvando..." : primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

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
              <div className="text-xs text-indigo-200">Meus Personagens</div>
            </div>
          </div>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            <NavLink href="/verminhaficha" active={isActive("/verminhaficha") || isActive("/ficha")}>
              Meus Personagens
            </NavLink>
            <NavLink
              href="/cadastrar-ficha"
              active={isActive("/cadastrar-ficha") || isActive("/ficha")}
            >
              Cadastrar Ficha
            </NavLink>
            <NavLink href="/campanhas" active={isActive("/campanhas")}>
              Campanhas
            </NavLink>
            <NavLink href="/livros" active={isActive("/livros")}>
              Livros
            </NavLink>
            <NavLink href="/ferramentas" active={isActive("/ferramentas")}>
              Ferramentas
            </NavLink>
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
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "secondary" | "outline";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

function Input({
  value,
  defaultValue,
  placeholder,
  className,
  type = "text",
  inputMode,
  onChange,
}: {
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputProps =
    value !== undefined ? { value } : defaultValue !== undefined ? { defaultValue } : {};

  return (
    <input
      {...inputProps}
      type={type}
      inputMode={inputMode}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none ring-indigo-500/40 transition focus:border-indigo-500/60 focus:ring-2 ${className ?? ""}`}
    />
  );
}

function Textarea({
  value,
  placeholder,
  onChange,
}: {
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-[120px] w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-500/40 transition focus:border-indigo-500/60 focus:ring-2"
    />
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

function Select({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none ring-indigo-500/40 transition focus:border-indigo-500/60 focus:ring-2"
    >
      <option value="">{placeholder ?? "Selecione"}</option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-[#0b0a1d] text-slate-100">
          {formatEnumLabel(option)}
        </option>
      ))}
    </select>
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
  const safeMax = Math.max(1, max);
  const percent = Math.min(100, Math.round((value / safeMax) * 100));
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

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border border-white/20 bg-white/5 accent-indigo-500"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function RoundToggle({
  ariaLabel,
  checked,
  onChange,
}: {
  ariaLabel: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
        checked
          ? "border-indigo-400 bg-indigo-600/40 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
          : "border-white/30 bg-white/10 hover:border-indigo-300/70"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full transition ${
          checked ? "bg-white" : "bg-transparent"
        }`}
      />
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
      {message}
    </div>
  );
}

function DiceTray({
  value,
  sides,
  onClose,
  onRoll,
  onResult,
  onChangeSides,
}: {
  value: number;
  sides: number;
  onClose: () => void;
  onRoll: () => void;
  onResult: (result: number) => void;
  onChangeSides: (sides: number) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "dice:ready") {
        setIframeReady(true);
      }
      if (data.type === "dice:result" && typeof data.result === "number") {
        onResult(data.result);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onResult]);

  const sendRoll = () => {
    const target = iframeRef.current?.contentWindow;
    if (target) {
      target.postMessage({ type: "dice:roll", sides }, "*");
    } else {
      onRoll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex w-full max-w-md flex-col border-l border-white/10 bg-[#0c0b20] shadow-[0_10px_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Mesa de Dados</div>
            <div className="text-sm font-semibold text-white">Estilo Owlbear (lateral)</div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={sendRoll}>
              Rolar d{sides}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-4">
          <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#0b0a1d] to-[#070714]">
            <iframe
              ref={iframeRef}
              title="Mesa de Dados"
              src="/dice-table/index.html"
              className="h-full w-full border-none"
              allow="accelerometer; gyroscope; fullscreen"
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl border-[10px] border-[#4b3621]/80 shadow-inner shadow-black/50" />
            {!iframeReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-center text-xs text-slate-200">
                Carregando mesa (adicione sua build WebGL em /public/dice-table/ para versão real)
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-100">
                Resultado: <span className="font-semibold text-white">{value}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm" onClick={sendRoll}>
                  Lançar d{sides}
                </Button>
                <Button variant="secondary" size="sm" onClick={sendRoll}>
                  Rolar de novo
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Arraste o tabuleiro para fechar ou clique fora; as rolagens ficam em 3D rápido.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0f25] p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">Escolha o dado</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {diceOptions.map((opt) => (
                <Button
                  key={opt.sides}
                  size="sm"
                  variant={opt.sides === sides ? "primary" : "secondary"}
                  onClick={() => onChangeSides(opt.sides)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function NavLink({
  children,
  active = false,
  href,
}: {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
}) {
  const content = (
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

  return href ? (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  ) : (
    content
  );
}

function Tab({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <span
      onClick={onClick}
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
