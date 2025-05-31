
type NestedObject = { [key: string]: any };

export function mapToNestedObject(
    obj: { [key: string]: any },
    separator: string = '_'
): NestedObject {
    const result: NestedObject = {};

    for (const key in obj) {
        const value = obj[key];
        const parts = key.split(separator);
        let current = result;

        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                current[part] = value;
            } else {
                if (!current[part] || typeof current[part] !== 'object') {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    }

    return result;
}