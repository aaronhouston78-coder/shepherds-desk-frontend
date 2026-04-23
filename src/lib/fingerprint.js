export async function getBrowserFingerprint() {
  const signals = [
    navigator.language || "",
    navigator.languages?.join(",") || "",
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth),
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    String(navigator.hardwareConcurrency || ""),
    String(navigator.deviceMemory || ""),
  ].join("|");

  try {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(signals)
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return btoa(signals).slice(0, 64);
  }
}
