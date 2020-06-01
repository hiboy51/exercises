const prettier = require("prettier");
const config = {
    arrowParens: "always",
    bracketSpacing: true,
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
    printWidth: 80,
    proseWrap: "preserve",
    quoteProps: "as-needed",
    requirePragma: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    useTabs: false,
    vueIndentScriptAndStyle: false,
    tabWidth: 4,
};
const raw =
    "interface SendPurchaseFailedIM {data:{errorList:{orderNo:string;createTime:string;sku:string;paymentId:number;billingCode:string;goodsDetail:{goodsCode:string;amount:number;extraInfo:string;}[];}[];};status:number;};";

console.log(prettier.format(raw, config));
