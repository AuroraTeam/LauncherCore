/**
 * Класс хелпер для работы с JSON
 */
export declare class JsonHelper {
    /**
     * Преобразовать JSON строку в объект
     * @param string JSON строка
     * @returns `Object | Array`
     */
    static fromJSON<T>(string: string): T;
    /**
     * Преобразовать объект в JSON строку
     * @param obj Пробразуемый объект
     * @param pretty Форматировать вывод отступами или вывести в одну строку (по умолчанию `false`)
     * @returns JSON сторка
     */
    static toJSON(obj: Record<string, any>, pretty?: boolean): string;
}
