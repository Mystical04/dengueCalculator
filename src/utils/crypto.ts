import { gcm } from "@noble/ciphers/aes.js";
import { fromByteArray, toByteArray } from "base64-js";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import { ENCRYPTION_KEY_STORE_ID } from "@/constants/storage";

let cachedKey: Uint8Array | null = null;

async function getOrCreateKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;

  const stored = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORE_ID);
  if (stored) {
    cachedKey = toByteArray(stored);
    return cachedKey;
  }

  const newKey = await Crypto.getRandomBytesAsync(32);
  await SecureStore.setItemAsync(
    ENCRYPTION_KEY_STORE_ID,
    fromByteArray(newKey),
  );
  cachedKey = newKey;
  return newKey;
}

export async function encryptField(plainText: string): Promise<string> {
  const key = await getOrCreateKey();
  const nonce = await Crypto.getRandomBytesAsync(12);
  const encrypted = gcm(key, nonce).encrypt(
    new TextEncoder().encode(plainText),
  );

  const combined = new Uint8Array(nonce.length + encrypted.length);
  combined.set(nonce, 0);
  combined.set(encrypted, nonce.length);

  return fromByteArray(combined);
}

export async function decryptField(cipherText: string): Promise<string> {
  const key = await getOrCreateKey();
  const combined = toByteArray(cipherText);
  const nonce = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  const decrypted = gcm(key, nonce).decrypt(encrypted);

  return new TextDecoder().decode(decrypted);
}
