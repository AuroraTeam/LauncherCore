import * as fs from "fs"
import * as path from "path"
import { URL } from "url"

import got, { Progress } from "got"
import pMap from "p-map"

import { ProgressHelper } from "./ProgressHelper"
import { StorageHelper } from "./StorageHelper"

export class HttpHelper {
    private static concurrency = 8

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
     */
    public static async existFile(url: URL): Promise<boolean> {
        const { statusCode } = await got.head(url)
        return statusCode == 200
    }

    /**
     * Просмотр файла
     * @param url - ссылка на файл
     * @returns Promise, который вернёт содержимое файла, в случае успеха
     */
    public static async readFile(url: URL): Promise<string> {
        const { body } = await got.get(url)
        return body
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
    public static async downloadFile(
        url: URL,
        filePath: string | null,
        options?: { showProgress?: boolean; saveToTempFile?: boolean }
    ): Promise<string> {
        options = Object.assign({ showProgress: true, saveToTempFile: false }, options)

        if (options.saveToTempFile) filePath = StorageHelper.getTmpPath()
        if (filePath === null) return Promise.reject("File path not found")
        if (!options.showProgress) return await this.download(url, filePath)

        const progressBar = ProgressHelper.getDownloadProgressBar()
        progressBar.start(0, 0, {
            filename: path.basename(filePath),
        })

        return await this.download(url, filePath, (progress: Progress) => {
            if (progressBar.getTotal() === 0 && progress.total) {
                progressBar.setTotal(progress.total)
            }
            progressBar.update(progress.transferred)
        })
    }

    /**
     * Скачивание файлов
     * @param url - итерируемый объект, содержащий ссылки на файлы (без домена)
     * @param site - домен сайта, с которого будут качаться файлы
     * @param dirname - папка в которую будут сохранены все файлы
     */
    public static async downloadFiles(
        urls: Iterable<string>,
        site: string,
        dirname: string,
        callback?: (filePath: string) => void
    ): Promise<void> {
        const multiProgress = ProgressHelper.getDownloadMultiProgressBar()
        await pMap(
            urls,
            async (filename) => {
                const filePath = path.resolve(dirname, filename)
                fs.mkdirSync(path.dirname(filePath), { recursive: true })

                const progressBar = multiProgress.create(0, 0, {
                    filename: path.basename(filePath),
                })

                await this.download(new URL(filename, site), filePath, (progress: Progress) => {
                    if (progressBar.getTotal() === 0 && progress.total) {
                        progressBar.setTotal(progress.total)
                    }
                    progressBar.update(progress.transferred)
                })
                multiProgress.remove(progressBar)
                if (callback) callback(filePath)
            },
            {
                concurrency: this.concurrency,
            }
        )
        multiProgress.stop() // Лучше закрывать ручками, ибо не успевает обработаться таймаут и появляется лишняя строка
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
                fileStream.on("data", () => {
                    onProgress(fileStream.downloadProgress)
                })
            }

            fileStream.once("error", (err) => {
                fs.unlinkSync(filePath)
                reject(err)
            })

            const file = fs.createWriteStream(filePath)
            fileStream.pipe(file)

            file.once("close", () => {
                resolve(filePath)
            })
        })
    }
}
