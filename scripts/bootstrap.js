const fs = require("fs");
const path = require("path");
const baseVersion = require("../packages/@yao/cli/package.json").version;

const packagesDir = path.resolve(__dirname, "../packages/@yao");
const files = fs.readdirSync(packagesDir);

files.forEach((pkg) => {
  if (pkg.charAt(0) === ".") return;

  const isPlugin = /^cli-plugin-/.test(pkg);
  const desc = isPlugin
    ? `${pkg.replace("cli-plugin-", "")} plugin for yao-cli`
    : `${pkg.replace("cli-", "")} for yao-cli`;
  const pkgPath = path.join(packagesDir, pkg, `package.json`);

  if (!fs.existsSync(pkgPath)) {
    const json = {
      name: `@yao/${pkg}`,
      version: baseVersion,
      description: desc,
      main: "index.js",
      publishConfig: {
        access: "public",
      },
      keywords: ["yao", "cli"],
      author: "yaoyao1987",
      license: "MIT",
    };
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2));
  }

  const readmePath = path.join(packagesDir, pkg, `README.md`);
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# @yao/${pkg}\n\n> ${desc}`);
  }

  const npmIgnorePath = path.join(packagesDir, pkg, `.npmignore`);
  if (!fs.existsSync(npmIgnorePath)) {
    fs.writeFileSync(npmIgnorePath, `__tests__\n__mocks__`);
  }
});
