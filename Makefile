# One-stop commands. `make` lists them. Needs Node 22+, Docker running, Supabase CLI.
.DEFAULT_GOAL := help
.PHONY: help setup up down dev reset types test e2e check clean stop-app

help: ## List commands
	@grep -E '^[a-z0-9-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-8s %s\n", $$1, $$2}'

setup: ## First run: install deps + browsers, start DB, write .env.local
	npm install
	npx playwright install chromium
	$(MAKE) up

up: ## Start local Supabase and write .env.local
	supabase start
	./scripts/local-env.sh

down: stop-app ## Stop the app server and local Supabase
	supabase stop

stop-app:
	-@pkill -f next-server || true

dev: up ## Start DB (if needed) and the app on http://localhost:3000
	npm run dev

clean: stop-app ## Delete build cache (.next); fixes stale route types after moving pages
	rm -rf .next

reset: ## Rebuild DB from migrations + seed (wipes local data)
	supabase db reset

types: ## Regenerate lib/supabase/types.ts from the local DB
	supabase gen types typescript --local > lib/supabase/types.ts

test: ## Unit + contrast tests and pgTAP
	npm test
	supabase test db

e2e: stop-app ## Production build + Playwright against the local stack
	npm run build
	CI=1 npm run e2e

check: ## Full quality gate (what CI runs)
	npm run lint
	npm run typecheck
	npm run check:tokens
	npm test
	supabase db reset
	supabase test db
	$(MAKE) e2e
