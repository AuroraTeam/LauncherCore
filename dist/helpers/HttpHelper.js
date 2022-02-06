"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHelper = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const url_1 = require("url");
const got_1 = __importDefault(require("got"));
const p_map_1 = __importDefault(require("p-map"));
const ProgressHelper_1 = require("./ProgressHelper");
const StorageHelper_1 = require("./StorageHelper");
class HttpHelper {
    /**
     * Изменить количество одновременно скачиваемых файлов
     * @param concurrency
     */
    static setConcurrency(concurrency) {
        this.concurrency = concurrency;
    }
    /**
     * Проверка наличия файла
     * @param url - объект Url, содержащий ссылку на файл
     * @returns Promise, который вернёт `true`, в случае существования файла или `false` при его отсутствии или ошибке
     */
    static async existFile(url) {
        const { statusCode } = await got_1.default.head(url);
        return statusCode == 200;
    }
    /**
     * Просмотр файла
     * @param url - ссылка на файл
     * @returns Promise, который вернёт содержимое файла, в случае успеха
     */
    static async readFile(url) {
        const { body } = await got_1.default.get(url);
        return body;
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
    static async downloadFile(url, filePath, options) {
        options = Object.assign({ showProgress: true, saveToTempFile: false }, options);
        if (options.saveToTempFile)
            filePath = StorageHelper_1.StorageHelper.getTmpPath();
        if (filePath === null)
            return Promise.reject("File path not found");
        if (!options.showProgress)
            return await this.download(url, filePath);
        const progressBar = ProgressHelper_1.ProgressHelper.getDownloadProgressBar();
        progressBar.start(0, 0, {
            filename: path.basename(filePath),
        });
        return await this.download(url, filePath, (progress) => {
            if (progressBar.getTotal() === 0 && progress.total) {
                progressBar.setTotal(progress.total);
            }
            progressBar.update(progress.transferred);
        });
    }
    /**
     * Скачивание файлов
     * @param url - итерируемый объект, содержащий ссылки на файлы (без домена)
     * @param site - домен сайта, с которого будут качаться файлы
     * @param dirname - папка в которую будут сохранены все файлы
     */
    static async downloadFiles(urls, site, dirname, callback) {
        const multiProgress = ProgressHelper_1.ProgressHelper.getDownloadMultiProgressBar();
        await (0, p_map_1.default)(urls, async (filename) => {
            const filePath = path.resolve(dirname, filename);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            const progressBar = multiProgress.create(0, 0, {
                filename: path.basename(filePath),
            });
            await this.download(new url_1.URL(filename, site), filePath, (progress) => {
                if (progressBar.getTotal() === 0 && progress.total) {
                    progressBar.setTotal(progress.total);
                }
                progressBar.update(progress.transferred);
            });
            multiProgress.remove(progressBar);
            if (callback)
                callback(filePath);
        }, {
            concurrency: this.concurrency,
        });
        multiProgress.stop(); // Лучше закрывать ручками, ибо не успевает обработаться таймаут и появляется лишняя строка
    }
    /**
     * Внутренняя функция скачивания файла
     * @param url - объект URL, содержащий ссылку на файл
     * @param filePath - путь до сохраняемого файла
     * @param onProgress - коллбэк, в который передаётся текущий прогресс загрузки, если объявлен
     * @returns Promise, который вернёт название файла, в случае успеха
     */
    static download(url, filePath, onProgress) {
        return new Promise((resolve, reject) => {
            const fileStream = got_1.default.stream(url, { throwHttpErrors: false });
            if (onProgress !== undefined) {
                fileStream.on("data", () => {
                    onProgress(fileStream.downloadProgress);
                });
            }
            fileStream.once("error", (err) => {
                fs.unlinkSync(filePath);
                reject(err);
            });
            const file = fs.createWriteStream(filePath);
            fileStream.pipe(file);
            file.once("close", () => {
                resolve(filePath);
            });
        });
    }
}
exports.HttpHelper = HttpHelper;
HttpHelper.concurrency = 8;
//# sourceMappingURL=HttpHelper.js.map