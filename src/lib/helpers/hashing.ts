import { xxh3 } from '@node-rs/xxhash';

export const xxhash = (content: string | Buffer | ArrayBuffer, radix = 16): string => {
	if (content instanceof ArrayBuffer) {
		return xxh3.xxh128(new Uint8Array(content)).toString(radix);
	} else if (Buffer.isBuffer(content)) {
		return xxh3.xxh128(new Uint8Array(content)).toString(radix);
	}
	return xxh3.xxh128(content).toString(radix);
};
