import * as fs from "fs"
import * as path from "path"
import { URL } from "url"

import got, { Progress } from "got"
import pMap from "p-map"

import { JsonData, JsonHelper, StorageHelper } from "."

export class HttpHelper {
    private static concurrency = 4

    /**
     * Изменить количество одновременно скачиваемых файлов
     * @param concurrency
     */
    public static setConcurrency(concurrency: number) {
        this.concurrency = concurrency
    }

    /**
     * Проверка наличия файла
     * @param url - объект Url, содержащий ссылку на файл
     * @returns Promise, который вернёт `true`, в случае существования файла или `false` при его отсутствии или ошибке
     * @deprecated используйте `HttpHelper.existsResource()`
     */
    public static async existFile(url: URL) {
        return this.existsResource(url)
    }

    /**
     * Проверка наличия ресурса
     * @param url - объект URL, содержащий ссылку на ресурс
     * @returns Promise, который вернёт `true`, в случае существования ресурса или `false` при его отсутствии или ошибке
     */
    public static async existsResource(url: URL) {
        try {
            const { statusCode } = await got.head(url)
            return statusCode >= 200 && statusCode < 300
        } catch (error) {
            return false
        }
    }

    /**
     * Чтение ресурса
     * @param url - объект URL, содержащий ссылку на ресурс
     * @returns Promise, который вернёт содержимое ресурса, в случае успеха
     * @deprecated используйте `HttpHelper.getResource()`
     */
    public static readFile(url: URL) {
        return this.getResource(url)
    }

    /**
     * Чтение ресурса
     * @param url - объект URL, содержащий ссылку на ресурс
     * @returns Promise, который вернёт содержимое ресурса, в случае успеха
     */
    public static async getResource(url: URL) {
        const { body } = await got.get(url)
        return body
    }

    /**
     * Получение данных из JSON ресурса
     * @param url - объект URL, содержащий ссылку на ресурс
     * @returns Promise, который вернёт обработанный объект, в случае успеха
     */
    public static async getResourceFromJson<T>(url: URL): Promise<T> {
        return JsonHelper.fromJson<T>(await this.getResource(url))
    }

    /**
     * @deprecated используйте `HttpHelper.postJson()`
     */
    public static makePostRequest<T>(url: URL, json: JsonData): Promise<T> {
        return this.postJson(url, json)
    }

    /**
     * Отправка POST запроса и получение результата из JSON
     * @param url - объект URL, содержащий ссылку на ресурс
     * @returns Promise, который вернёт обработанный объект, в случае успеха
     */
    public static postJson<T>(url: URL, json: JsonData): Promise<T> {
        return got.post(url, { json }).json()
    }

    /**
     * Скачивание файла
     * @param url - объект URL, содержащий ссылку на файл
     * @param filePath - путь до сохраняемого файла
     * @param options - список опций:
     * @param options.showProgress - показывать прогресс бар, по умолчанию `true`
     * @param options.saveToTempFile - сохранять во временный файл, по умолчанию `false`
     * @returns Promise который вернёт название файла в случае успеха
     */
    public static downloadFile(
        url: URL,
        filePath: string | null,
        options?: { onProgress?: (progress: Progress) => void; saveToTempFile?: boolean }
    ) {
        options = Object.assign({ onProgress: undefined, saveToTempFile: false }, options)

        if (options.saveToTempFile) filePath = StorageHelper.getTmpPath()
        if (filePath === null) return Promise.reject("File path not found")
        return this.download(url, filePath, options.onProgress)
    }

    /**
     * Скачивание файлов
     * @param urls - итерируемый объект, содержащий ссылки на файлы (без домена)
     * @param site - домен сайта, с которого будут качаться файлы
     * @param dirname - папка в которую будут сохранены все файлы
     */
    public static async downloadFiles(
        urls: Iterable<string>,
        site: string,
        dirname: string,
        callback?: (filePath: string) => void,
        onProgress?: (progress: Progress) => void
    ) {
        await pMap(
            urls,
            async (filename) => {
                const filePath = path.resolve(dirname, filename)
                fs.mkdirSync(path.dirname(filePath), { recursive: true })

                await this.download(new URL(filename, site), filePath, onProgress)
                if (callback) callback(filePath)
            },
            { concurrency: this.concurrency }
        )
    }

    /**
     * Внутренняя функция скачивания файла
     * @param url - объект URL, содержащий ссылку на файл
     * @param filePath - путь до сохраняемого файла
     * @param onProgress - коллбэк, в который передаётся текущий прогресс загрузки, если объявлен
     * @returns Promise, который вернёт название файла, в случае успеха
     */
    private static download(url: URL, filePath: string, onProgress?: (progress: Progress) => void): Promise<string> {
        return new Promise((resolve, reject) => {
            const fileStream = got.stream(url, { throwHttpErrors: false })

            if (onProgress !== undefined) {
                fileStream.on("data", () => onProgress(fileStream.downloadProgress))
            }

            fileStream.once("error", (err) => {
                fs.unlinkSync(filePath)
                reject(err)
            })

            const file = fs.createWriteStream(filePath)
            fileStream.pipe(file)

            file.once("close", () => resolve(filePath))
        })
    }
}
