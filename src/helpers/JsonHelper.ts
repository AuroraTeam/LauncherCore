/**
 * Класс хелпер для работы с JSON
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonData = Record<string, any>

export class JsonHelper {
    /**
     * @deprecated Используйте `JsonHelper.fromJson`
     */
    static fromJSON<T>(string: string): T {
        return this.fromJson(string)
    }

    /**
     * Преобразовать JSON строку в объект
     * @param string JSON строка
     * @returns `Object | Array`
     */
    static fromJson<T>(string: string): T {
        return JSON.parse(string)
    }

    /**
     * Преобразовать объект в JSON строку
     * @param obj Пробразуемый объект
     * @param pretty Форматировать вывод отступами или вывести в одну строку (по умолчанию `false`)
     * @returns JSON сторка
     * @deprecated Используйте `JsonHelper.toJson`
     */
    static toJSON(obj: JsonData, pretty = false): string {
        return this.toJson(obj, pretty)
    }

    /**
     * Преобразовать объект в JSON строку
     * @param obj Пробразуемый объект
     * @param pretty Форматировать вывод отступами или вывести в одну строку (по умолчанию `false`)
     * @returns JSON сторка
     */
    static toJson(obj: JsonData, pretty = false): string {
        return pretty ? JSON.stringify(obj, null, 4) : JSON.stringify(obj)
    }
}
