import gulpLoadPlugins from "gulp-load-plugins";

interface IGulp_Loaded_Plugins extends IGulpPlugins {
    debug: (args?: any) => NodeJS.ReadWriteStream;
    unzip: (option?: any) => NodeJS.ReadWriteStream;
    errorHandle: (option?: any) => NodeJS.ReadWriteStream;
}
export const Plugins = gulpLoadPlugins() as IGulp_Loaded_Plugins;
