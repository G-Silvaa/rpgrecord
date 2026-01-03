import FichaPage, { RpgFichaResponse } from "../features/ficha/page";

async function loadFicha(id: string): Promise<RpgFichaResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return null;

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  try {
    const response = await fetch(`${normalizedBase}/rpgficha/${id}`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as RpgFichaResponse;
    return data;
  } catch {
    return null;
  }
}

export default async function VerMinhaFichaPage({
  searchParams,
}: {
  searchParams?: { id?: string };
}) {
  const fallbackId = "437d77bd-d4a2-4ff6-b4ed-f320fcfaa2ab";
  const fichaId = searchParams?.id || fallbackId;
  const ficha = await loadFicha(fichaId);

  return <FichaPage initialMode="view" initialData={ficha} />;
}
