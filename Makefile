# One-stop commands. `make` lists them. Needs Node 24+.
.DEFAULT_GOAL := help
.PHONY: help setup dev test e2e check clean stop-app

help: ## List commands
	@grep -E '^[a-z0-9-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-8s %s\n", $$1, $$2}'

setup: ## First run: install deps and browsers
	npm install
	npx playwright install chromium

dev: ## App on http://localhost:3000
	npm run dev

stop-app:
	-@pkill -f next-server || true

clean: stop-app ## Delete build cache (.next)
	rm -rf .next

test: ## Unit and contrast tests
	npm test

e2e: stop-app ## Production build + Playwright
	npm run build
	CI=1 npm run e2e

check: ## Lint, types, tokens, unit tests, e2e
	npm run lint
	npm run typecheck
	npm run check:tokens
	npm test
	$(MAKE) e2e
