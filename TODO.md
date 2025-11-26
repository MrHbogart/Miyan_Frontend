# Deployment TODOs

1. **Create GitHub Actions runner on the server**
   - Provision a user (e.g., `github-runner`) with sudo privileges.
   - `mkdir -p ~/actions-runner && cd ~/actions-runner`.
   - Download the latest runner: `curl -o actions-runner.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64-2.318.0.tar.gz`.
   - Extract: `tar xzf actions-runner.tar.gz`.
   - Configure with a repo-scoped token from GitHub Settings → Actions → Runners: `./config.sh --url https://github.com/<org>/<repo> --token <RUNNER_TOKEN>`.
   - Install service: `sudo ./svc.sh install` then `sudo ./svc.sh start`.

2. **Add repository secrets for CI**
   - In GitHub → Settings → Secrets and variables → Actions, create `NUXT_PUBLIC_API_BASE_URL` and any other runtime env vars (e.g., `NUXT_PUBLIC_SITE_DOMAIN`).

3. **Verify CI**
   - Push a commit to `main` or open a PR to trigger `.github/workflows/ci.yml`.
   - Confirm `npm ci`, `npm run build`, and artifact upload succeed.

4. **Plan server deployment**
   - The `miyan` user owns `/home/miyan/Miyan_Backend` and `/home/miyan/Miyan_Frontend`, each with its own Git repo.
   - Any deployment hooks should `cd /home/miyan/Miyan_Frontend` (or Backend) before pulling/building to avoid cross-contamination.
   - When adding systemd services or docker-compose files, keep them under the respective project directory and run commands as the `miyan` user.

5. **Future tasks**
   - Add automated tests or lint scripts (`npm run lint`) so the CI step validates code quality.
   - Extend the workflow with a deployment job (e.g., Docker push + SSH deploy) once the runner is online and pointing at `/home/miyan/Miyan_Frontend`.
