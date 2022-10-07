/**
 * Класс хелпер для работы с JSON
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonData = Record<string, any>

export class JsonHelper {
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
     * @param object Пробразуемый объект
     * @param pretty Форматировать вывод отступами или вывести в одну строку (по умолчанию `false`)
     * @returns JSON сторка
     */
    static toJson(object: JsonData, pretty = false): string {
        return pretty ? JSON.stringify(object, null, 4) : JSON.stringify(object)
    }
}
