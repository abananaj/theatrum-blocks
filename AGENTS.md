# AGENTS.md

This file documents Claude agents and workflows for working with the Theatrum Blocks plugin using Claude Code.

**[← Back to wp_root](../../../../AGENTS.md)** | [CLAUDE.md](CLAUDE.md) | [CHANGELOG.md](CHANGELOG.md)

## Available Agent Types

### Explore Agent
**When to use:** Finding code in the large block structure or searching across many files

- Locates blocks or files by pattern (e.g., `src/blocks/**/*.render.php`)
- Searches for functions or patterns across the codebase
- Answers "where is X defined" or "which files use Y"
- Faster than manual searching for broad code discovery

**Example invocations:**
- "Find all blocks that use `useServerSideRender`" → Explore agent
- "Locate where `theatrum_parse_flexible_date` is called" → Explore agent
- "Find all REST endpoint definitions" → Explore agent

### Plan Agent
**When to use:** Designing architecture for new blocks or major features

- Creates step-by-step implementation plans
- Identifies critical files to modify
- Considers trade-offs (static vs dynamic blocks, caching strategies)
- Proposes file organization for new block categories

**Example invocations:**
- "Plan a new carousel block for events" → Plan agent
- "How should we refactor the meta-block pattern?" → Plan agent
- "Design a system for custom block variations" → Plan agent

### Code Review Agents
**When to use:** Reviewing pull requests or checking code quality

- **Code Review** (`/code-review`) — Find bugs and suggest fixes
  - Use `--comment` flag to post findings as PR comments
  - Use `--fix` flag to auto-apply suggestions to working tree

- **Simplify** (`/simplify`) — Reduce code duplication and improve clarity
  - Finds reuse opportunities in changed code
  - Suggests efficiency improvements
  - Focuses on quality, not bugs

- **Security Review** (`/security-review`) — Check for security issues

**Example invocations:**
```bash
/code-review low                  # Quick bug hunt
/code-review medium               # Moderate coverage
/code-review high                 # Thorough review
/code-review ultra                # Deep multi-agent cloud review (billed)
/simplify                         # Clean up changed code
/security-review                  # Check for vulnerabilities
```

### General Purpose Agent
**When to use:** Multi-step tasks, research, or complex questions

- Handles tasks that don't fit other specialized agents
- Good for coordinating work across multiple files
- Can search, read, and analyze in depth
- Adds to changelog in README.md whenever a git commit is made.

**Example invocations:**
- "Audit all blocks for accessibility issues" → General agent
- "Find and fix all deprecated WordPress API calls" → General agent
- "Migrate all meta-blocks to a new attribute structure" → General agent
- "Update changelog" → General agent

**Note**: If blocks use custom post types or ACF structures from the theme, check [theme documentation](../../../../wp-content/themes/chance-ollie/AGENTS.md) if those structures change — custom post types may affect block functionality.

## WordPress-Specific Skills

### wp-plugin-dev Skill
Explains WordPress plugin development concepts and references documentation.

**Refer to:**
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)

**Use when:**
- Asking "How does this work?" about WordPress plugin patterns
- Need guidance on WordPress hooks, actions, filters
- Learning about block registration or REST endpoints

**Example:**
```
/wp-plugin-dev "How do block variations work?"
```

### wp-standards Skill
Compares code against WordPress coding standards and best practices.

**Refer to:**
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/)
- [Accessibility](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/)
- [CSS](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- [HTML](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/)
- [JavaScript](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [PHP](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)

**Use when:**
- Code reviewing for WordPress compliance
- Refactoring to meet WordPress standards
- Asking about WordPress best practices

**Example:**
```
/wp-standards
# Reviews the diff on the current branch for WordPress standards compliance
```

### wp-theme-json Skill
Merges exported `wp_global_styles` JSON into `theme.json`.

**Refer to:**
- [theme.json Handbook](https://developer.wordpress.org/block-editor/reference-guides/theme-json/)
- [Theme.json Version 3 Reference (latest)](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/)
- [JSON schema WordPress 7.0](https://raw.githubusercontent.com/WordPress/gutenberg/wp/7.0/schemas/json/theme.json)
**Use when:**
- Merging style exports from the Site Editor
- Updating theme.json with new color/typography settings

### changelog Skill
Updates the changelog section in README.md each time a git commit is made, following the Keep a Changelog format using semantic versioning.

**Refer to:**
- [Changelog Template](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/)

**Use when:**
- After making a git commit, to automatically update the changelog with the commit message and categorize it as Added, Changed, Fixed, etc.

### wp-cli Skill
Builds WP-CLI commands based on user descriptions, offers suggestions when WP-CLI may be useful. Does NOT run WP-CLI commands directly.
**Refer to:**
- [WP-CLI Documentation](https://wp-cli.org/)
**Use when:**
- Only when asked to generate a WP-CLI command
**Example:**
```
/wp-cli "list all the posts"
```

## Common Workflows

### Adding a New Block

1. **Plan the architecture** — Use Plan agent to design the block
   ```bash
   /plan "Design a new X block with these features..."
   ```

2. **Scaffold the block** — Generate using wp-scripts
   ```bash
   npm run start
   npx @wordpress/create-block@latest --variant=dynamic --slug=my-block
   ```

3. **Implement and review** — Code review as you go
   ```bash
   /code-review low
   ```

4. **Check WordPress standards** — Ensure compliance
   ```bash
   /wp-standards
   ```

5. **Register in main plugin** — Add to `theatrum-blocks.php`

### Refactoring Block Pattern

1. **Explore impact** — Find all affected blocks
   ```bash
   /explore "Find all blocks that use pattern X"
   ```

2. **Plan the migration** — Design the refactor
   ```bash
   /plan "Migrate 10 meta-blocks to new pattern X"
   ```

3. **Review each change** — Quality gate
   ```bash
   /code-review medium --fix
   ```

4. **Security check** — Ensure no vulnerabilities
   ```bash
   /security-review
   ```

### Auditing Blocks

1. **Find patterns** — Search across all blocks
   ```bash
   /explore "very thorough" "Find all render.php files with security-sensitive operations"
   ```

2. **Audit the results** — Use general agent for analysis
   - Security vulnerabilities
   - Performance issues
   - Accessibility compliance

3. **Fix issues** — Coordinate fixes across multiple blocks

### Code Review Before Deployment

```bash
# Quick quality check
/code-review low

# Thorough review with fixes applied
/code-review high --fix

# Security audit
/security-review

# Check WordPress standards
/wp-standards
```

## Agent Configuration

To configure agents for this project, edit `.claude/settings.json` (if present) or project-level Claude Code settings:

- Specify default agent types for certain tasks
- Set up hooks to run agents automatically
- Configure permissions for agent operations

See `/help` for documentation on Claude Code agent configuration.

## Tips for Effective Agent Use

1. **Be specific** — "Find all blocks using X pattern" is better than "Find blocks"
2. **Use exploration first** — Run Explore before making broad changes
3. **Plan major changes** — Use Plan agent to design before implementing
4. **Iterate small** — Use Code Review agents frequently, don't wait until end
5. **Chain workflows** — Plan → Explore → Code Review → Security Review
6. **Use agent results wisely** — Agents provide suggestions; you decide

## Disabled/Unavailable

The following agent workflows are **not applicable** to this project:
- Desktop app building agents (this is a PHP/WordPress plugin)
- Mobile development agents
- Data pipeline agents
- Cloud infrastructure agents

## Related Documentation

**Plugin coordination:** This plugin operates independently but coordinates with the chance-ollie theme and wp_root project:
- **Theme docs:** See `../../themes/chance-ollie/AGENTS.md` for similar agent workflows
- **wp_root docs:** See `../../AGENTS.md` (the wp_root project agent documentation)
- **Build reference:** See `../../../../.build/blocks.md` for block development workflows
- **Deployment:** See `../../../../.deploy/deploy.md` for the git push → SSH pull deployment workflow

When updating this AGENTS.md, consider whether changes should be reflected in the theme or wp_root project docs to keep agent workflows in sync across projects.
