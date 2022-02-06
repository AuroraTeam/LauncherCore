/**
 * Класс хелпер для работы с JSON
 */
export class JsonHelper {
    /**
     * Преобразовать JSON строку в объект
     * @param string JSON строка
     * @returns `Object | Array`
     */
    static fromJSON<T>(string: string): T {
        return JSON.parse(string)
    }

    /**
     * Преобразовать объект в JSON строку
     * @param obj Пробразуемый объект
     * @param pretty Форматировать вывод отступами или вывести в одну строку (по умолчанию `false`)
     * @returns JSON сторка
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static toJSON(obj: Record<string, any>, pretty = false): string {
        return pretty ? JSON.stringify(obj, null, 4) : JSON.stringify(obj)
    }
}
