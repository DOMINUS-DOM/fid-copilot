/**
 * Vérifie si un mot de passe apparaît dans les fuites de données connues
 * via l'API HaveIBeenPwned (k-anonymity : seuls les 5 premiers caractères
 * du hash SHA-1 sont envoyés, le mot de passe n'est jamais transmis).
 *
 * @returns true si le mot de passe est compromis, false sinon
 */
export async function isPasswordLeaked(password: string): Promise<boolean> {
  try {
    // 1. Hash SHA-1 du mot de passe
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();

    // 2. K-anonymity : envoyer uniquement les 5 premiers caractères
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    // 3. Appel API HIBP
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
    });

    if (!res.ok) return false; // En cas d'erreur API, on ne bloque pas

    // 4. Chercher le suffix dans la réponse
    const text = await res.text();
    const lines = text.split("\n");

    for (const line of lines) {
      const [hashSuffix, count] = line.split(":");
      if (hashSuffix.trim() === suffix && parseInt(count.trim(), 10) > 0) {
        return true; // Mot de passe compromis
      }
    }

    return false;
  } catch {
    // En cas d'erreur réseau, ne pas bloquer l'inscription
    return false;
  }
}
