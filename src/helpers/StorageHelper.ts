import * as crypto from "crypto"
import * as os from "os"
import * as path from "path"

export class StorageHelper {
    static getTmpPath() {
        return path.resolve(os.tmpdir(), crypto.randomBytes(16).toString("hex"))
    }
}
