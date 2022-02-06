"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonHelper = void 0;
/**
 * Класс хелпер для работы с JSON
 */
class JsonHelper {
    /**
     * Преобразовать JSON строку в объект
     * @param string JSON строка
     * @returns `Object | Array`
     */
    static fromJSON(string) {
        return JSON.parse(string);
    }
    /**
     * Преобразовать объект в JSON строку
     * @param obj Пробразуемый объект
     * @param pretty Форматировать вывод отступами или вывести в одну строку (по умолчанию `false`)
     * @returns JSON сторка
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static toJSON(obj, pretty = false) {
        return pretty ? JSON.stringify(obj, null, 4) : JSON.stringify(obj);
    }
}
exports.JsonHelper = JsonHelper;
//# sourceMappingURL=JsonHelper.js.map