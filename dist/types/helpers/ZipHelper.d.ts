export declare class ZipHelper {
    /**
     * Распаковка архива в папку
     * @param archive - путь до архива
     * @param destDir - конечная папка
     */
    static unzipArchive(archive: string, destDir: string, whitelist?: string[]): void;
}
