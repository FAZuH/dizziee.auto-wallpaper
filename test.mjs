// Run: node test.mjs — self-check for Schedule.js wallpaper filtering.
import { readFileSync } from "node:fs"

const src = readFileSync(new URL("./Schedule.js", import.meta.url), "utf8")
  .replace(/^\.pragma library\s*/, "")
const S = new Function(src +
  "\nreturn { DEFAULTS, normalize, filterCatalog, parseWallpaperCatalog, inRotation }")()

const rows = (paths) => paths.map((p) => ({ path: p, thumb: p + ".t" }))
const kept = (entries) => entries.map((e) => e.path.split("/").pop())
let failed = 0
function check(name, actual, expected) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected)
  if (a !== e) { failed++; console.error(`FAIL ${name}\n  want ${e}\n  got  ${a}`) }
  else console.log(`ok   ${name}`)
}

// normalize round-trips the new keys and sanitizes junk
check("normalize defaults", S.normalize({}).includePatterns, [])
check("normalize drops non-strings/blanks",
  S.normalize({ excludePatterns: ["a", 7, "", " b "] }).excludePatterns, ["a", "b"])

const cat = rows(["/t/Nordic-Lake.jpg", "/t/city.png", "/t/test_a.png",
  "/t/test_ab.png", "/t/a.jpg", "/t/axjpg"])

check("no patterns passes through", kept(S.filterCatalog(cat, [], [])),
  ["Nordic-Lake.jpg", "city.png", "test_a.png", "test_ab.png", "a.jpg", "axjpg"])
check("include is case-insensitive glob", kept(S.filterCatalog(cat, ["*nordic*"], [])),
  ["Nordic-Lake.jpg"])
check("exclude drops matches", kept(S.filterCatalog(cat, [], ["*.png"])),
  ["Nordic-Lake.jpg", "a.jpg", "axjpg"])
check("exclude wins over include", kept(S.filterCatalog(cat, ["*lake*"], ["nordic*"])), [])
check("? matches exactly one char", kept(S.filterCatalog(cat, [], ["test_?.png"])),
  ["Nordic-Lake.jpg", "city.png", "test_ab.png", "a.jpg", "axjpg"])
check("dot is literal, not a wildcard", kept(S.filterCatalog(cat, ["a.jpg"], [])), ["a.jpg"])
check("parse then filter end to end",
  kept(S.filterCatalog(
    S.parseWallpaperCatalog("/t/Nordic-Lake.jpg\t/x.jpg\n/t/plain.gif\t/x.gif\n"),
    [], ["*.gif"])),
  ["Nordic-Lake.jpg"])

// inRotation + panel toggle round-trips
check("inRotation: no filters = everything",
  [S.inRotation("/t/a.jpg", [], []), S.inRotation("/t/b.png", [], [])], [true, true])
check("inRotation: exclude wins",
  [S.inRotation("/t/a.jpg", ["*"], ["a.jpg"]), S.inRotation("/t/b.jpg", ["*"], ["a.jpg"])],
  [false, true])
check("inRotation: include filter",
  S.inRotation("/t/city.png", ["*lake*"], []), false)
if (failed) { console.error(`${failed} check(s) failed`); process.exit(1) }
console.log("all checks passed")
