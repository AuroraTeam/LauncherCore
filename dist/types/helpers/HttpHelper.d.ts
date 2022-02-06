/// <reference types="node" />
import { URL } from "url";
export declare class HttpHelper {
    private static concurrency;
    /**
     * Изменить количество одновременно скачиваемых файлов
     * @param concurrency
     */
    static setConcurrency(concurrency: number): void;
    /**
     * Проверка наличия файла
     * @param url - объект Url, содержащий ссылку на файл
     * @returns Promise, который вернёт `true`, в случае существования файла или `false` при его отсутствии или ошибке
     */
    static existFile(url: URL): Promise<boolean>;
    /**
     * Просмотр файла
     * @param url - ссылка на файл
     * @returns Promise, который вернёт содержимое файла, в случае успеха
     */
    static readFile(url: URL): Promise<string>;
    /**
     * Скачивание файла
     * @param url - объект URL, содержащий ссылку на файл
     * @param filePath - путь до сохраняемого файла
     * @param options - список опций:
     * @param options.showProgress - показывать прогресс бар, по умолчанию `true`
     * @param options.saveToTempFile - сохранять во временный файл, по умолчанию `false`
     * @returns Promise который вернёт название файла в случае успеха
     */
    static downloadFile(url: URL, filePath: string | null, options?: {
        showProgress?: boolean;
        saveToTempFile?: boolean;
    }): Promise<string>;
    /**
     * Скачивание файлов
     * @param url - итерируемый объект, содержащий ссылки на файлы (без домена)
     * @param site - домен сайта, с которого будут качаться файлы
     * @param dirname - папка в которую будут сохранены все файлы
     */
    static downloadFiles(urls: Iterable<string>, site: string, dirname: string, callback?: (filePath: string) => void): Promise<void>;
    /**
     * Внутренняя функция скачивания файла
     * @param url - объект URL, содержащий ссылку на файл
     * @param filePath - путь до сохраняемого файла
     * @param onProgress - коллбэк, в который передаётся текущий прогресс загрузки, если объявлен
     * @returns Promise, который вернёт название файла, в случае успеха
     */
    private static download;
}
