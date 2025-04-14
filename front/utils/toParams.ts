export function toParams<T extends Record<string, any>>(
	obj: T
): Record<string, string> {
	const convertedObject = Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, String(value)])
	);
	return convertedObject;
}
