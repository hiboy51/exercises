/*
 * @Author: Kinnon.Z
 * @Date: 2020-03-18 12:00:14
 * @Last Modified by: Kinnon.Z
 * @Last Modified time: 2020-03-18 14:39:22
 */
import commander from "commander";
import GulpClient from "gulp";
import path from "path";

export function mv_framework(cb: Function) {
    commander
        .option("-s --source <source>", "source dir")
        .option("-d --dest <dest>", "destination dir")
        .parse(process.argv);
    let sd: string = commander.source;
    let dd: string = commander.dest;
    console.log(sd, dd);
    const dir = "assets/common";
    let filter = [path.join(sd, dir, "**/*"), path.join("!", sd, "**/*.meta")];
    return GulpClient.src(filter).pipe(GulpClient.dest(path.join(dd, dir)));
}
