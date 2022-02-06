"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressHelper = void 0;
const cli_progress_1 = require("cli-progress");
class ProgressHelper {
    static getLoadingProgressBar() {
        return this.getProgress("{bar} {percentage}%", this.barsize * 2);
    }
    static getDownloadProgressBar() {
        return this.getProgress(this.downloadFormatter);
    }
    static getDownloadMultiProgressBar() {
        return this.getMultiProgress(this.downloadFormatter);
    }
    static getProgress(format, barsize = this.barsize) {
        return new cli_progress_1.SingleBar(this.getDefaultParams(format, barsize));
    }
    static getMultiProgress(format) {
        return new cli_progress_1.MultiBar(this.getDefaultParams(format));
    }
    static getDefaultParams(format, barsize = this.barsize) {
        return {
            format,
            barCompleteChar: this.barCompleteChar,
            barIncompleteChar: this.barIncompleteChar,
            barsize,
            hideCursor: true,
            clearOnComplete: true,
            stopOnComplete: true,
            autopadding: true,
            emptyOnZero: true,
            forceRedraw: true,
        };
    }
    static downloadFormatter(options, params, payload) {
        const elapsedTime = Math.round((Date.now() - params.startTime) / 1000);
        const speed = params.value / elapsedTime;
        payload.speed = ProgressHelper.bytesToSize(isFinite(speed) ? speed : 0);
        // Переопределение `скачано/всего`
        payload.value_formatted = ProgressHelper.bytesToSize(params.value);
        payload.total_formatted = ProgressHelper.bytesToSize(params.total);
        return cli_progress_1.Format.Formatter({
            ...options,
            format: "{bar} {percentage}% | Осталось: {eta_formatted} | Скорость: {speed}/s | {value_formatted}/{total_formatted} | {filename}",
        }, params, payload);
    }
    static bytesToSize(bytes) {
        const sizes = ["Bytes", "KB", "MB"];
        if (bytes === 0)
            return "0";
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        if (i === 0)
            return `${bytes} ${sizes[i]})`;
        return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
    }
}
exports.ProgressHelper = ProgressHelper;
ProgressHelper.barCompleteChar = "\u2588";
ProgressHelper.barIncompleteChar = "\u2591";
ProgressHelper.barsize = 20;
//# sourceMappingURL=ProgressHelper.js.map