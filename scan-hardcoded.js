const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fs = require("fs-extra");
const glob = require("glob");

const files = glob.sync("src/**/*.{js,jsx,ts,tsx}");

let results = [];

function isTextValid(str) {
  if (!str) return false;
  if (str.trim() === "") return false;
  if (str.trim().length < 2) return false;
  if (/^\W+$/.test(str)) return false;
  if (/^{.*}$/.test(str)) return false; 
  return true;
}

for (const file of files) {
  const code = fs.readFileSync(file, "utf8");

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    JSXText(path) {
      const text = path.node.value.trim();
      if (isTextValid(text)) results.push(text);
    },

    JSXAttribute(path) {
      if (
        path.node.value &&
        path.node.value.type === "StringLiteral"
      ) {
        const text = path.node.value.value;
        if (isTextValid(text)) results.push(text);
      }
    },

    Literal(path) {
      if (typeof path.node.value === "string") {
        const text = path.node.value;
        if (isTextValid(text)) results.push(text);
      }
    },
  });
}

results = [...new Set(results)];

fs.writeFileSync("all-ui-texts.txt", results.join("\n"), "utf8");

console.log("OK → all-ui-texts.txt dosyası oluşturuldu!");
