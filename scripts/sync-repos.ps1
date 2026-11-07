[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string[]]$RepoPaths = @(),

    [switch]$AllKnown,
    [switch]$Check,
    [switch]$DryRun,
    [string]$InitPrefix = ""
)

$ErrorActionPreference = "Stop"
$WorkflowRoot = Split-Path -Parent $PSScriptRoot
$CodingRoot = Split-Path -Parent $WorkflowRoot

if ($AllKnown -and $RepoPaths.Count -eq 0) {
    $KnownNames = @(
        "FluentOverlay",
        "Fluent-Studio-Website",
        "FluentTimer",
        "TokenHUD",
        "Fluent-Studio-Atlas"
    )
    foreach ($name in $KnownNames) {
        $candidate = Join-Path $CodingRoot $name
        if (Test-Path (Join-Path $candidate "scripts\ticket.config.json")) {
            $RepoPaths += $candidate
        }
    }
}

if ($RepoPaths.Count -eq 0) {
    Write-Host "Usage:"
    Write-Host "  .\scripts\sync-repos.ps1 -AllKnown -Check                  # Check drift across sibling repos"
    Write-Host "  .\scripts\sync-repos.ps1 -AllKnown                         # Sync managed workflow files to sibling repos"
    Write-Host "  .\scripts\sync-repos.ps1 C:\path\to\repo [-DryRun|-Check]  # Sync or check a specific repo"
    Write-Host "  .\scripts\sync-repos.ps1 C:\path\to\repo -InitPrefix MYP   # Bootstrap a new repo with starter config"
    exit 0
}

$DirectCopyFiles = @(
    "scripts/ticket.mjs",
    "scripts/ticket.test.mjs",
    "docs/plans/_template.plan.md",
    ".agents/skills/quick-review/SKILL.md",
    ".claude/skills/quick-review/SKILL.md",
    ".github/pull_request_template.md"
)

$PrefixTemplatedFiles = @(
    ".agents/skills/dev-workflow/SKILL.md",
    ".claude/skills/dev-workflow/SKILL.md"
)

function Get-NormalizedText([string]$Path) {
    if (-not (Test-Path $Path)) { return $null }
    return ([System.IO.File]::ReadAllText($Path) -replace "`r`n", "`n").TrimEnd()
}

function Write-ManagedFile([string]$DestPath, [string]$Content, [switch]$IsDryRun) {
    if ($IsDryRun) {
        Write-Host "  [dry-run] write $DestPath"
        return
    }
    $dir = Split-Path -Parent $DestPath
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($DestPath, $Content, [System.Text.UTF8Encoding]::new($false))
}

$TotalDrift = 0

foreach ($rawPath in $RepoPaths) {
    $repo = (Resolve-Path $rawPath).Path
    $repoName = Split-Path -Leaf $repo
    $configPath = Join-Path $repo "scripts\ticket.config.json"

    if (-not (Test-Path $configPath)) {
        if ($InitPrefix) {
            $starterConfig = Get-Content (Join-Path $WorkflowRoot "scripts\ticket.config.json") -Raw | ConvertFrom-Json
            $starterConfig.prefix = $InitPrefix
            $jsonOut = ($starterConfig | ConvertTo-Json -Depth 5) + "`n"
            Write-ManagedFile -DestPath $configPath -Content $jsonOut -IsDryRun:$DryRun
            Write-Host "[$repoName] Initialized scripts/ticket.config.json (prefix: $InitPrefix)"
        } else {
            Write-Warning "[$repoName] Missing scripts/ticket.config.json. Pass -InitPrefix <PREFIX> to initialize."
            continue
        }
    }

    $cfg = if (Test-Path $configPath) {
        Get-Content $configPath -Raw | ConvertFrom-Json
    } else {
        [pscustomobject]@{ prefix = $InitPrefix; protectedBranches = @("main") }
    }
    $prefix = if ($cfg.prefix) { $cfg.prefix } else { "PROJ" }
    $repoDrift = 0

    Write-Host "=== $repoName (prefix: $prefix) ==="

    foreach ($rel in $DirectCopyFiles) {
        $src = Join-Path $WorkflowRoot ($rel -replace "/", "\")
        $dst = Join-Path $repo ($rel -replace "/", "\")
        $expected = Get-NormalizedText $src
        $actual = Get-NormalizedText $dst

        if ($expected -ne $actual) {
            $repoDrift++
            $TotalDrift++
            if ($Check) {
                $state = if ($null -eq $actual) { "MISSING" } else { "DRIFT" }
                Write-Host "  [$state] $rel"
            } else {
                Write-ManagedFile -DestPath $dst -Content ($expected + "`n") -IsDryRun:$DryRun
                Write-Host "  [UPDATED] $rel"
            }
        } elseif ($Check) {
            Write-Host "  [OK]      $rel"
        }
    }

    foreach ($rel in $PrefixTemplatedFiles) {
        $src = Join-Path $WorkflowRoot ($rel -replace "/", "\")
        $dst = Join-Path $repo ($rel -replace "/", "\")
        $expected = (Get-NormalizedText $src) -replace "ADW-Plan-", "$prefix-Plan-"
        $actual = Get-NormalizedText $dst

        if ($expected -ne $actual) {
            $repoDrift++
            $TotalDrift++
            if ($Check) {
                $state = if ($null -eq $actual) { "MISSING" } else { "DRIFT" }
                Write-Host "  [$state] $rel"
            } else {
                Write-ManagedFile -DestPath $dst -Content ($expected + "`n") -IsDryRun:$DryRun
                Write-Host "  [UPDATED] $rel"
            }
        } elseif ($Check) {
            Write-Host "  [OK]      $rel"
        }
    }

    $branches = if ($cfg.protectedBranches -and $cfg.protectedBranches.Count -gt 0) {
        "[" + ($cfg.protectedBranches -join ", ") + "]"
    } else {
        "[main]"
    }

    foreach ($wf in @(".github/workflows/plan-check.yml", ".github/workflows/ticket-done.yml")) {
        $src = Join-Path $WorkflowRoot ($wf -replace "/", "\")
        $dst = Join-Path $repo ($wf -replace "/", "\")
        $expected = (Get-NormalizedText $src) -replace "branches: \[main, develop\]", "branches: $branches"
        $actual = Get-NormalizedText $dst

        if ($expected -ne $actual) {
            $repoDrift++
            $TotalDrift++
            if ($Check) {
                $state = if ($null -eq $actual) { "MISSING" } else { "DRIFT" }
                Write-Host "  [$state] $wf"
            } else {
                Write-ManagedFile -DestPath $dst -Content ($expected + "`n") -IsDryRun:$DryRun
                Write-Host "  [UPDATED] $wf"
            }
        } elseif ($Check) {
            Write-Host "  [OK]      $wf"
        }
    }

    if (-not $Check -and $repoDrift -eq 0) {
        Write-Host "  Already up to date."
    }
}

if ($Check -and $TotalDrift -gt 0) {
    Write-Host "`nDetected $TotalDrift drifted/missing file(s). Run without -Check to sync."
    exit 1
}
