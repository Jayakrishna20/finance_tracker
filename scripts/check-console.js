const fs = require("fs");

const files = process.argv.slice(2);
let hasError = false;

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  // Check for console.log but ignore this script itself if ever passed somehow
  if (content.includes("console.log") && !file.includes("check-console.js")) {
    console.error(
      `\x1b[31mError: console.log() found in staged file: ${file}\x1b[0m`,
    );
    hasError = true;
  }
});

if (hasError) {
  console.error(
    "\x1b[31mPlease remove console.log statements before committing.\x1b[0m",
  );
  process.exit(1);
}
