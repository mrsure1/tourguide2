# setup_git_auth.ps1
# This script configures Git authentication for AI agents (like Codex).
# You need a GitHub Personal Access Token (PAT).

$token = Read-Host -Prompt "Enter your GitHub Personal Access Token (PAT)"
if (-not $token) {
    Write-Host "Error: No token entered." -ForegroundColor Red
    exit
}

# 1. Set Credential Helper to 'store' (Save permanently in local file)
git config --global credential.helper store
Write-Host "Git Credential Helper set to 'store'."

# 2. Update Remote URL with Token for immediate authentication
# This allows agents to push without interactive login prompts.
$remoteUrl = "https://mrsure1:$token@github.com/mrsure1/guidematch.git"
git remote set-url origin $remoteUrl

Write-Host "--------------------------------------------------" -ForegroundColor Green
Write-Host "SUCCESS: Git authentication configured for project." -ForegroundColor Green
Write-Host "Agents like Codex can now perform 'git push' commands." -ForegroundColor Green
Write-Host "--------------------------------------------------"
Write-Host "Note: Token is stored in your local Git config for this repo."
