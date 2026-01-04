export type AttributeBlock = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type AttackPayload = {
  id?: string;
  name: string;
  melee: boolean;
  rangeNormal: number;
  rangeLong: number;
  attackBonus: number;
  damageDice: string;
  damageBonus: number;
  damageType: string;
};

export type SpellPayload = {
  id?: string;
  name: string;
  level: number;
  school: string;
  damageDice: string;
  damageBonus: number;
  damageType: string;
  prepared: boolean;
  castingTime: string;
  rangeText: string;
  components: string;
  duration: string;
  description: string;
};

export type EquipmentPayload = {
  id?: string;
  name: string;
  quantity: number;
  weight: number;
  valueGold: number;
  equipped: boolean;
  notes: string;
};

export type RpgFichaPayload = {
  characterName: string;
  race: string;
  subRace: string;
  ancestry: string;
  alignment: string;
  attributes: AttributeBlock;
  inspirationPoints: number;
  proficiencyBonus: number;
  skillProficiencies: string[];
  saveProficiencies: string[];
  notes: string;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  hpDice: string;
  attacks: AttackPayload[];
  spells: SpellPayload[];
  equipment: EquipmentPayload[];
};

export async function createRpgFicha(payload: RpgFichaPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL não configurada (NEXT_PUBLIC_API_BASE_URL).");
  }

  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  const response = await fetch(`${normalizedBase}/rpgficha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || `Falha ao criar ficha: ${response.statusText}`
    );
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function updateRpgFicha(id: string, payload: RpgFichaPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL não configurada (NEXT_PUBLIC_API_BASE_URL).");
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  const response = await fetch(`${normalizedBase}/rpgficha/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Falha ao atualizar ficha: ${response.statusText}`);
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
