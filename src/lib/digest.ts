export function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}

export function md5(bytes: Uint8Array) {
  const words = new Uint32Array((((bytes.length + 8) >>> 6) + 1) * 16);
  for (let index = 0; index < bytes.length; index += 1) words[index >> 2]! |= bytes[index]! << ((index % 4) * 8);
  words[bytes.length >> 2]! |= 0x80 << ((bytes.length % 4) * 8);
  const bits = bytes.length * 8;
  words[words.length - 2] = bits >>> 0;
  words[words.length - 1] = Math.floor(bits / 0x100000000);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16,
    23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const k = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000));

  for (let offset = 0; offset < words.length; offset += 16) {
    const block = words.subarray(offset, offset + 16);
    let aa = a;
    let bb = b;
    let cc = c;
    let dd = d;
    for (let index = 0; index < 64; index += 1) {
      let f = 0;
      let g = 0;
      if (index < 16) {
        f = (bb & cc) | (~bb & dd);
        g = index;
      } else if (index < 32) {
        f = (dd & bb) | (~dd & cc);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = bb ^ cc ^ dd;
        g = (3 * index + 5) % 16;
      } else {
        f = cc ^ (bb | ~dd);
        g = (7 * index) % 16;
      }
      const next = dd;
      dd = cc;
      cc = bb;
      const sum = (aa + f + k[index]! + block[g]!) >>> 0;
      bb = (bb + ((sum << s[index]!) | (sum >>> (32 - s[index]!)))) >>> 0;
      aa = next;
    }
    a = (a + aa) >>> 0;
    b = (b + bb) >>> 0;
    c = (c + cc) >>> 0;
    d = (d + dd) >>> 0;
  }

  const out = new Uint8Array(16);
  const state = [a, b, c, d];
  for (let index = 0; index < 4; index += 1) {
    out[index * 4] = state[index]! & 0xff;
    out[index * 4 + 1] = (state[index]! >>> 8) & 0xff;
    out[index * 4 + 2] = (state[index]! >>> 16) & 0xff;
    out[index * 4 + 3] = (state[index]! >>> 24) & 0xff;
  }
  return hex(out);
}

export function hex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function copy(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export async function sha(name: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512", bytes: Uint8Array) {
  const buffer = await crypto.subtle.digest(name, copy(bytes));
  return hex(new Uint8Array(buffer));
}

export async function hmacSha256(secret: string, bytes: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, copy(bytes));
  return hex(new Uint8Array(signature));
}
