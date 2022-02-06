"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipHelper = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const adm_zip_1 = __importDefault(require("adm-zip"));
const ProgressHelper_1 = require("./ProgressHelper");
class ZipHelper {
    /**
     * Распаковка архива в папку
     * @param archive - путь до архива
     * @param destDir - конечная папка
     */
    static unzipArchive(archive, destDir, whitelist = []) {
        const zipfile = new adm_zip_1.default(archive);
        const stat = (0, fs_1.statSync)(archive);
        const progress = ProgressHelper_1.ProgressHelper.getLoadingProgressBar();
        progress.start(stat.size, 0);
        zipfile.getEntries().forEach((entry) => {
            if (entry.isDirectory)
                return;
            if (whitelist.length > 0 && !whitelist.includes((0, path_1.extname)(entry.entryName)))
                return;
            progress.increment(entry.header.compressedSize);
            zipfile.extractEntryTo(entry, destDir);
        });
        progress.stop();
    }
}
exports.ZipHelper = ZipHelper;
//# sourceMappingURL=ZipHelper.js.map