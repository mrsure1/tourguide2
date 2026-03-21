# setup_git_auth.ps1
# 이 스크립트는 Codex와 같은 에이전트가 GitHub에 푸시할 수 있도록 인증 정보를 설정합니다.
# GitHub에서 발급받은 Personal Access Token(PAT)이 필요합니다.

$token = Read-Host -Prompt "GitHub Personal Access Token(PAT)을 입력하세요"
if (-not $token) {
    Write-Host "오류: 토큰이 입력되지 않았습니다." -ForegroundColor Red
    exit
}

# 1. Credential Helper를 store로 설정 (영구 저장)
git config --global credential.helper store
Write-Host "Git Credential Helper를 'store'로 설정했습니다."

# 2. 첫 번째 인증 시도 (자격 증명 저장 유도)
# 임시로 유효하지 않은 푸시를 시도하거나, 원격 URL을 업데이트하여 토큰을 강제로 저장하게 할 수 있습니다.
# 여기서는 원격 URL에 토큰을 포함시켜 한 번 푸시를 시도하는 방식으로 인증 정보를 저장합니다.

$remoteUrl = "https://mrsure1:$token@github.com/mrsure1/guidematch.git"
git remote set-url origin $remoteUrl

Write-Host "GitHub 인증 정보가 설정되었습니다. 이제 Codex도 git push를 수행할 수 있습니다." -ForegroundColor Green
Write-Host "주의: 이 작업 이후 원격 URL에 토큰이 남지 않도록 나중에 확인이 필요할 수 있습니다."
