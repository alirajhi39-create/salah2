"""Export source for deployment, excluding every real environment file and all student data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public" / "downloads" / "worksheet-project.zip"
ROOT_FILES = (
    "package.json", "package-lock.json", "tsconfig.json", "next.config.ts",
    "postcss.config.mjs", "eslint.config.mjs", "drizzle.config.ts", "render.yaml",
    ".gitignore", ".env.example", "DEPLOYMENT.md",
)

files = [ROOT / name for name in ROOT_FILES]
for directory in ("src", "drizzle", "tests", "scripts"):
    base = ROOT / directory
    if base.exists():
        files.extend(path for path in base.rglob("*") if path.is_file())
# Include web assets, but not the output archive, backups, or other downloads.
public = ROOT / "public"
if public.exists():
    files.extend(path for path in public.rglob("*") if path.is_file() and "downloads" not in path.relative_to(public).parts)

safe_files = []
for path in files:
    if not path.is_file() or path.is_symlink():
        continue
    relative = path.relative_to(ROOT)
    if any(part.startswith(".env") for part in relative.parts) and relative.as_posix() != ".env.example":
        continue
    if any(part in {"__pycache__", "node_modules", ".next", ".git"} for part in relative.parts):
        continue
    if path.suffix in {".log", ".pyc", ".tsbuildinfo", ".db", ".dump", ".bak"}:
        continue
    safe_files.append(path)

DEST.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(DEST, "w", ZIP_DEFLATED) as archive:
    for path in sorted(set(safe_files)):
        archive.write(path, "salah-worksheet/" + path.relative_to(ROOT).as_posix())

with ZipFile(DEST) as archive:
    entries = archive.namelist()
    assert "salah-worksheet/render.yaml" in entries
    assert "salah-worksheet/package.json" in entries
    assert "salah-worksheet/.env.example" in entries
    assert not any(Path(name).name in {".env", ".env.local", ".env.production"} for name in entries)
    assert archive.testzip() is None
print(f"Created {DEST.relative_to(ROOT)}: {len(entries)} source files, {DEST.stat().st_size:,} bytes; no credentials or student data.")
