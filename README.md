# dizziee.auto-wallpaper

Preview and automatically cycle the active Omarchy theme's wallpapers on a schedule.

## Requirements

- Omarchy 4 (Quattro) with the Quickshell bar
- A theme that ships wallpapers (under its `backgrounds/` directory)

## Installation

```sh
omarchy plugin add https://github.com/JJDizz1L/dizziee.auto-wallpaper.git --enable
```

### Then place it in your bar layout with

`omarchy bar plugin add dizziee.auto-wallpaper [--section <left|center|right>]`

Suggested placement:

```sh
omarchy bar plugin add dizziee.auto-wallpaper --section right
```

You can validate the plugin at any time with:

```sh
omarchy plugin validate ~/.config/omarchy/plugins/dizziee.auto-wallpaper
```

## Updating

To pull the latest version of the plugin:

```sh
omarchy plugin update dizziee.auto-wallpaper --yes
```

## Configuration

Configuration lives in `~/.config/omarchy/auto-wallpaper/config.json`.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | true | Automatically cycle wallpapers |
| `intervalMinutes` | integer | 30 | How often the wallpaper changes |
| `mode` | string (`sequential`, `shuffle`) | `sequential` | Rotation order |
| `includePatterns` | string array | `[]` | Only use wallpapers whose file name matches one of these globs |
| `excludePatterns` | string array | `[]` | Never use wallpapers whose file name matches one of these globs |

Include/exclude patterns are case-insensitive globs matched against the
wallpaper's file name (not the full path), with `*` and `?` wildcards. Both
lists apply to the preview grid and the rotation; `excludePatterns` wins over
`includePatterns`.

Example:

```json
{
  "includePatterns": ["*mountain*", "lake-*.jpg"],
  "excludePatterns": ["*draft*", "test_?.png"]
}
```

Both keys are optional — leave them out (or empty) to use every wallpaper the
active theme ships. You can also pick wallpapers directly in the panel:
Ctrl+click a tile (the badge shows its state) to include/skip it in the
rotation, which writes the wallpaper's exact file name into these keys.

## How it works

- **Sequential** advances to the next wallpaper, wrapping at the end.
- **Shuffle** plays every wallpaper once before repeating.
- Manual picks and scheduled changes share the same rotation.
- Changing the active theme resets the rotation and waits one interval.
- Previews reuse Omarchy's own wallpaper thumbnail cache, so the panel stays
  light and nothing is re-cached.

## Preview

![preview](preview.png)

## Uninstall

```sh
omarchy plugin remove dizziee.auto-wallpaper
```

## License

MIT

