"""Optional native config-parser checks. No UI inspection or live configuration writes.

Run after pnpm ports:generate. Requires Python 3.11+, the seven tools, and Ghostty
(on macOS the standard app-bundle CLI is detected). All state is temporary.
"""
from pathlib import Path
import json
import os
import plistlib
import shutil
import subprocess
import tempfile
import tomllib

REPO = Path(__file__).resolve().parents[2]
ROOT = REPO / "dist/ports/lightweight"
VARIANTS = ["light", "dark", "light-paper", "dark-paper"]


def run(args, env=None, input=None):
    result = subprocess.run(args, env=env, input=input, capture_output=True, text=True, timeout=30)
    if result.returncode or result.stderr.strip():
        raise RuntimeError(f"{args[0]}: {result.returncode}\n{result.stderr}\n{result.stdout[:1000]}")
    return result.stdout


def main():
    ghostty = shutil.which("ghostty") or "/Applications/Ghostty.app/Contents/MacOS/ghostty"
    tools = {name: shutil.which(name) for name in ["fzf", "zellij", "tmux", "starship", "bat", "eza"]}
    missing = [name for name, path in tools.items() if not path]
    if not Path(ghostty).is_file():
        missing.append("ghostty")
    if missing:
        raise RuntimeError(f"Missing native parsers: {', '.join(missing)}")
    with tempfile.TemporaryDirectory(prefix="lig-native-") as directory:
        temporary = Path(directory)
        config = temporary / "config"
        cache = temporary / "cache"
        fixtures = temporary / "fixtures"
        fixtures.mkdir()
        (fixtures / "sample.rs").write_text("fn main() { let value = 42; println!(\"{}\", value); }\n")
        env = dict(os.environ, XDG_CONFIG_HOME=str(config), XDG_CACHE_HOME=str(cache), BAT_CONFIG_PATH=os.devnull)
        bat_dir = Path(run([tools["bat"], "--config-dir"], env).strip())
        if not bat_dir.is_relative_to(temporary):
            raise RuntimeError("bat cache check must stay in the temporary configuration")
        (bat_dir / "themes").mkdir(parents=True)
        for path in (ROOT / "bat").glob("*.tmTheme"):
            with path.open("rb") as file:
                plist = plistlib.load(file)
            # Compare every grammar binding with the shared editor compiler output.
            variant = path.stem.removeprefix("LiG-")
            vscode = json.loads((REPO / f"dist/ports/vscode/themes/lig-{variant}.json").read_text())
            entries = plist["settings"][1:]
            assert len(entries) == len(vscode["tokenColors"])
            for actual, expected in zip(entries, vscode["tokenColors"]):
                assert actual["scope"] == ", ".join(expected["scope"])
                assert actual["settings"] == expected["settings"]
            shutil.copyfile(path, bat_dir / "themes" / path.name)
        run([tools["bat"], "cache", "--build"], env)
        names = run([tools["bat"], "--list-themes", "--color=never"], env)
        socket = str(temporary / "tmux.sock")
        run([tools["tmux"], "-S", socket, "-f", os.devnull, "new-session", "-d", "-s", "lig-parser-check"], env)
        try:
            for variant in VARIANTS:
                run([ghostty, "+validate-config", f"--config-file={ROOT / 'ghostty' / f'lig-{variant}'}"], env)
                fzf_env = dict(env, FZF_DEFAULT_OPTS="", FZF_DEFAULT_OPTS_FILE=str(ROOT / f"fzf/lig-{variant}.fzfrc"))
                assert run([tools["fzf"], "--filter=needle"], fzf_env, "needle\nother\n").strip() == "needle"
                zellij_config = temporary / f"{variant}.kdl"
                zellij_config.write_text((ROOT / f"zellij/lig-{variant}.kdl").read_text() + f'\ntheme "lig-{variant}"\n')
                run([tools["zellij"], "--config", str(zellij_config), "--config-dir", str(config / "zellij"), "setup", "--check"], env)
                run([tools["tmux"], "-S", socket, "source-file", str(ROOT / f"tmux/lig-{variant}.conf")], env)
                style = run([tools["tmux"], "-S", socket, "show-options", "-gv", "status-style"], env)
                assert "fg=#" in style and "bg=#" in style
                starship_file = ROOT / f"starship/lig-{variant}.toml"
                palette = tomllib.loads(starship_file.read_text())
                assert palette["palette"] in palette["palettes"]
                starship_env = dict(env, STARSHIP_CONFIG=str(starship_file), STARSHIP_CACHE=str(cache / "starship"))
                run([tools["starship"], "print-config", "palette"], starship_env)
                run([tools["starship"], "module", "character"], starship_env)
                assert f"LiG-{variant}" in names
                run([tools["bat"], "--theme", f"LiG-{variant}", "--paging=never", "--color=always", str(fixtures / "sample.rs")], env)
                eza_dir = temporary / f"eza-{variant}"
                eza_dir.mkdir()
                shutil.copyfile(ROOT / f"eza/lig-{variant}.yml", eza_dir / "theme.yml")
                eza_env = dict(env, EZA_CONFIG_DIR=str(eza_dir), EZA_COLORS="", LS_COLORS="")
                run([tools["eza"], "--long", "--color=always", str(fixtures)], eza_env)
                print(f"{variant}: all 7 native configuration parsers passed")
        finally:
            subprocess.run([tools["tmux"], "-S", socket, "kill-server"], env=env, capture_output=True)


if __name__ == "__main__":
    main()
