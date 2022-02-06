import { MultiBar, SingleBar } from "cli-progress";
export declare class ProgressHelper {
    private static barCompleteChar;
    private static barIncompleteChar;
    private static barsize;
    static getLoadingProgressBar(): SingleBar;
    static getDownloadProgressBar(): SingleBar;
    static getDownloadMultiProgressBar(): MultiBar;
    private static getProgress;
    private static getMultiProgress;
    private static getDefaultParams;
    private static downloadFormatter;
    private static bytesToSize;
}
