import { spawn } from "child_process";
import del from "del";
import GulpClient from "gulp";
import M from "minimatch";
import path from "path";
import { Plugins } from "./gulp_declare_plugins";

function getVSCodeInfo() {
    return new Promise<string[]>((res, rej) => {
        let process = spawn("code", ["-v", "--user-data-dir='.'"]);
        process.stdout.on("data", (data: Buffer) => {
            let str = data.toString().trim();
            res(str.split("\n"));
        });
        process.stderr.on("data", (data: Buffer) => {
            rej(data.toString());
        });
        process.on("error", e => rej(e.message));
    });
}

function getElectronInfo(url: string) {
    // return new Promise((res, rej) => {
    //     get(url, resData => {
    //         resData.on("data", d => {
    //             let [matched] = (d as string).match(/target "([^"]+)"/);
    //             res(matched);
    //         });
    //     }).on("error", e => rej(e));
    // });

    //* 方法二：使用curl
    return new Promise<string>((res, rej) => {
        let process = spawn("curl", [url]);
        process.stdout.on("data", (data: Buffer) => {
            let dataStr = data.toString();
            const reg = /target "([^"]+)"/;
            let [, matched] = dataStr.match(reg);
            res(matched);
        });
        process.stderr.on("error", (data: Buffer) => console.error(data.toString()));
        process.on("error", err => rej(err.message));
    });
}

function downLoadElectron(electronVersion: string, arch: string) {
    const url = `https://npm.taobao.org/mirrors/electron/${electronVersion}/electron-v${electronVersion}-darwin-${arch}.zip`;
    const tmp_path = `electron-temp.zip`;
    return new Promise<string>((res, rej) => {
        console.log(`start to download electron`);
        console.log(url);
        let process = spawn("wget", [url, "-O", tmp_path], { stdio: "inherit" });
        process.on("exit", code => {
            console.log(`code = ${code}`);
            res(tmp_path);
        });
        process.on("close", code => {
            res(tmp_path);
        });
        process.on("error", err => {
            console.log(err.message);
            res();
        });
    });
}
// ====================================================================================
// tasks
// ====================================================================================

async function download_electron() {
    let vsInfo: string[];
    try {
        vsInfo = await getVSCodeInfo();
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
    console.log(`vsinfo = ${JSON.stringify(vsInfo)}`);
    let vsVersion = vsInfo.slice().shift();
    let vsArch = vsInfo.slice().pop();
    const yarnrcReq = `https://raw.githubusercontent.com/Microsoft/vscode/${vsVersion}/.yarnrc`;
    let electronVersion: string;
    try {
        electronVersion = await getElectronInfo(yarnrcReq);
        console.log(`Electron Version: ${electronVersion}`);
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }

    let tmp_downloaded = await downLoadElectron(electronVersion, vsArch);
    if (!tmp_downloaded) {
        new Error(`download failed`);
    }
}

function replace_lib() {
    const lib_dir = "Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/";
    // const source_app = "Electron.app";
    const dist_app = "Visual Studio Code.app";
    const lib_name = "libffmpeg.dylib";
    const tmp_downloaded = `electron-temp.zip`;
    console.log(`start to replace lib`);
    return GulpClient.src(tmp_downloaded)
        .pipe(Plugins.debug())
        .pipe(
            Plugins.unzip({
                filter: function(entry) {
                    return M(entry.path, `**/${lib_dir}${lib_name}`);
                }
            })
        )
        .pipe(Plugins.errorHandle())
        .pipe(Plugins.debug())
        .pipe(
            GulpClient.dest(file => {
                file.dirname = "";
                let p = path.join("/Applications", dist_app, lib_dir);
                console.log(p);
                return p;
            })
        )
        .pipe(Plugins.debug())
        .on("error", e => console.error(e));
}

async function del_tmp_download() {
    await del(["electron-temp.zip"]);
}

function delOld() {
    const lib_dir = "Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/";
    // const source_app = "Electron.app";
    const dist_app = "Visual Studio Code.app";
    const lib_name = "libffmpeg.dylib";
    const old_lib_path = path.join("/Applications", dist_app, lib_dir, lib_name);

    return del(old_lib_path, { force: true });
}

// export function copy1() {
//     const lib_dir = "Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/";
//     // const source_app = "Electron.app";
//     const dist_app = "Visual Studio Code.app";
//     return GulpClient.src("electron-temp/*.*").pipe(
//         GulpClient.dest(path.join("/Applications", dist_app, lib_dir))
//     );
// }

// export const testCpy = GulpClient.series(delOld, copy1);

export const FixNeteasePlugin = GulpClient.series(
    download_electron,
    delOld,
    replace_lib,
    del_tmp_download
);
