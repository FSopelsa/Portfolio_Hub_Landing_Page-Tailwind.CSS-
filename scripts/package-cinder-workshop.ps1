param(
  [string]$SourceRoot = 'C:\Games\Cinder Junction\Cinder Workshop',
  [string]$Destination = '..\assets\cinder-workshop-local.zip'
)

$ErrorActionPreference = 'Stop'
$sourcePath = [System.IO.Path]::GetFullPath((Resolve-Path -LiteralPath $SourceRoot).Path)
$destinationCandidate = if ([System.IO.Path]::IsPathRooted($Destination)) { $Destination } else { Join-Path $PSScriptRoot $Destination }
$destinationPath = [System.IO.Path]::GetFullPath($destinationCandidate)
$stagePath = [System.IO.Path]::GetFullPath((Join-Path ([System.IO.Path]::GetTempPath()) ('cinder-workshop-package-' + [guid]::NewGuid().ToString('N'))))
$tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
if (-not $stagePath.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Temporary package path escaped the system temp folder.' }

$included = @('server.mjs', 'app', 'recipes', 'showcase\viewer\vendor')
foreach ($item in $included) {
  if (-not (Test-Path -LiteralPath (Join-Path $sourcePath $item))) { throw "Required Workshop source is missing: $item" }
}

try {
  New-Item -ItemType Directory -Path $stagePath -Force | Out-Null
  $packageRoot = Join-Path $stagePath 'Cinder Workshop'
  New-Item -ItemType Directory -Path $packageRoot -Force | Out-Null
  foreach ($item in $included) {
    $target = Join-Path $packageRoot $item
    New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $sourcePath $item) -Destination $target -Recurse -Force
  }
  @'
{
  "name": "cinder-workshop",
  "private": true,
  "type": "module",
  "scripts": { "start": "node server.mjs" },
  "engines": { "node": ">=22" }
}
'@ | Set-Content -LiteralPath (Join-Path $packageRoot 'package.json') -Encoding utf8
  @'
# Cinder Workshop — local Blender edition

## Requirements

- Windows
- Node.js 22 or newer
- Blender installed locally

## Start

1. Extract this ZIP.
2. Open PowerShell in the extracted `Cinder Workshop` folder.
3. Run `npm.cmd start`.
4. Open <http://127.0.0.1:8787/>.

Stop with `Ctrl+C`. If Blender is outside `C:\Program Files\Blender Foundation`, set `$env:BLENDER_PATH` to its `blender.exe` path before starting the app.

The app keeps projects, references, and generated outputs in `data/projects/` beside `server.mjs`. The service binds to loopback and is intended for the computer running it.
'@ | Set-Content -LiteralPath (Join-Path $packageRoot 'README.md') -Encoding utf8

  $destinationDirectory = Split-Path -Parent $destinationPath
  New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
  Compress-Archive -Path (Join-Path $stagePath '*') -DestinationPath $destinationPath -CompressionLevel Optimal -Force

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive = [System.IO.Compression.ZipFile]::OpenRead($destinationPath)
  try {
    $names = @($archive.Entries | ForEach-Object { $_.FullName.Replace('\', '/') })
    foreach ($required in @('Cinder Workshop/server.mjs', 'Cinder Workshop/README.md', 'Cinder Workshop/app/index.html', 'Cinder Workshop/recipes/tower.py', 'Cinder Workshop/showcase/viewer/vendor/THREE-LICENSE.txt')) {
      if ($names -notcontains $required) { throw "Package is missing $required" }
    }
    if ($names | Where-Object { $_ -match '(^|/)(data|\.logs|tests|node_modules)/' }) { throw 'Package includes local data, logs, tests, or installed dependencies.' }
  } finally { $archive.Dispose() }

  Write-Output "Created $destinationPath"
} finally {
  if (Test-Path -LiteralPath $stagePath) {
    $resolvedStage = [System.IO.Path]::GetFullPath($stagePath)
    if ($resolvedStage.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedStage -Recurse -Force
    }
  }
}
