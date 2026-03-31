import fs from "fs"
import { promisify } from "util"
const unlinkAsync=promisify(fs.unlink)
export const deleteImage= async(path)=>{
    if(path && fs.existsSync(path))
    {
        await unlinkAsync(path)
    }
}