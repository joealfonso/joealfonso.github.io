#!/usr/bin/env bash
# Enforces the house rules from CLAUDE.md and the CSP added in #35.
# Plain grep, no dependencies. Exits non-zero if any rule is broken.
set -uo pipefail

fail=0
files=$(git ls-files '*.html')

report() {
  echo "::error::$1"
  echo "$2" | sed 's/^/    /'
  fail=1
}

# Every page must carry the Content-Security-Policy meta tag.
missing=$(echo "$files" | xargs grep -L 'http-equiv="Content-Security-Policy"' || true)
[ -n "$missing" ] && report "Pages missing the Content-Security-Policy meta tag" "$missing"

# Every page must have a <title>.
missing=$(echo "$files" | xargs grep -L '<title>' || true)
[ -n "$missing" ] && report "Pages missing a <title>" "$missing"

# No inline styles (CLAUDE.md: "No inline styles. Ever.").
hits=$(echo "$files" | xargs grep -nE '\sstyle="' || true)
[ -n "$hits" ] && report "Inline style attributes found" "$hits"

# No inline event handlers; keep behavior in js/.
hits=$(echo "$files" | xargs grep -nE '\son[a-z]+="' || true)
[ -n "$hits" ] && report "Inline event handlers found" "$hits"

# External scripts only from hosts the CSP allows.
hits=$(echo "$files" | xargs grep -noE '<script[^>]+src="https?://[^"/]+' \
  | grep -v 'https://www.googletagmanager.com' || true)
[ -n "$hits" ] && report "External script from a host the CSP does not allow" "$hits"

[ "$fail" -eq 0 ] && echo "Site rules: all $(echo "$files" | wc -l | tr -d ' ') pages pass."
exit "$fail"
