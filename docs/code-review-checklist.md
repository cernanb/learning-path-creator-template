# Code Review Checklist

Use this checklist when reviewing your own code before submitting a PR, and when reviewing others' code.

## 🎯 Purpose & Scope

- [ ] **Clear purpose**: The PR has a clear, focused purpose (one feature or fix)
- [ ] **Reasonable size**: Changes are small enough to review thoroughly (< 400 lines ideal)
- [ ] **Related changes**: All changes in the PR are related to the stated purpose

## ✅ Code Quality

### Functionality

- [ ] **Works as intended**: Code accomplishes what it's supposed to do
- [ ] **Edge cases handled**: Considers null/undefined, empty arrays, errors, etc.
- [ ] **No console logs**: Debug statements removed (except intentional logging)
- [ ] **No commented code**: Old code removed, not just commented out

### TypeScript

- [ ] **Proper types**: No `any` types (or `// @ts-ignore`) without justification
- [ ] **Type safety**: Inputs and outputs are properly typed
- [ ] **Interfaces/Types**: Reusable types defined in appropriate files
- [ ] **Type exports**: Types exported when needed by other modules

### React Best Practices

- [ ] **Proper hooks usage**: Hooks follow the rules (not in conditionals, loops, etc.)
- [ ] **Dependencies arrays**: useEffect/useCallback/useMemo have correct dependencies
- [ ] **Key props**: List items have unique, stable keys (not index)
- [ ] **Component structure**: Components are appropriately sized and focused

### Readability

- [ ] **Clear naming**: Variables, functions, components have descriptive names
- [ ] **Consistent naming**: Follows team conventions (camelCase, PascalCase, etc.)
- [ ] **Comments where needed**: Complex logic is explained
- [ ] **No over-commenting**: Code is self-documenting where possible

### Performance

- [ ] **No unnecessary re-renders**: Components properly memoized if needed
- [ ] **Async operations**: Properly handled with loading states
- [ ] **Database queries**: Efficient (proper indexes, limits, pagination)

## 🔒 Security

- [ ] **Input validation**: All user input validated (Zod schemas)
- [ ] **No secrets**: API keys, passwords not hardcoded
- [ ] **SQL injection safe**: Using parameterized queries or ORM
- [ ] **XSS safe**: User input properly escaped (React does this by default)
- [ ] **Authentication checked**: Protected routes verify user auth

## 🧪 Testing

- [ ] **Tests included**: New features have tests
- [ ] **Tests pass**: All tests run successfully
- [ ] **Good coverage**: Key functionality is covered
- [ ] **Meaningful tests**: Tests verify behavior, not implementation

## 📚 Documentation

- [ ] **README updated**: If adding new features or setup steps
- [ ] **API documented**: New endpoints documented in comments or API docs
- [ ] **Complex logic**: Has explanatory comments
- [ ] **Breaking changes**: Noted in PR description

## 🎨 UI/UX (if applicable)

- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **Accessible**: Semantic HTML, keyboard navigation, ARIA labels
- [ ] **Loading states**: Show feedback during async operations
- [ ] **Error states**: Display helpful error messages
- [ ] **Consistent styling**: Matches existing design system

## 🔧 Technical Debt

- [ ] **No new debt**: Doesn't add technical debt without plan to address
- [ ] **Refactoring**: Improves code structure where possible
- [ ] **TODOs**: Any TODOs are tracked (issue created)

## 📦 Dependencies

- [ ] **Necessary**: New dependencies are actually needed
- [ ] **Well-maintained**: Libraries are actively maintained
- [ ] **Small bundle**: Doesn't bloat bundle size unnecessarily
- [ ] **License compatible**: License is compatible with project

## 🚀 Deployment

- [ ] **Environment variables**: New env vars documented in .env.example
- [ ] **Migrations**: Database changes have migrations
- [ ] **Backwards compatible**: Changes don't break existing features
- [ ] **Rollback plan**: Can safely revert if issues arise

---

## Common Issues to Watch For

### Performance Red Flags

- Queries in loops (N+1 problem)
- Large files loaded entirely into memory
- Unnecessary API calls
- Missing indexes on database queries

### Security Red Flags

- User input directly in SQL queries
- API keys in frontend code
- No authentication checks on protected routes
- Storing sensitive data in localStorage

### Code Smell Red Flags

- Functions longer than 50 lines
- Deeply nested conditionals (> 3 levels)
- Duplicate code
- Magic numbers/strings

---

## Questions to Ask During Review

1. **What problem does this solve?** Is it clear why these changes are needed?
2. **Could this be simpler?** Is there a more straightforward approach?
3. **What could go wrong?** What edge cases might break this?
4. **Is this testable?** Can this code be easily tested?
5. **Will this scale?** How does this perform with more data/users?

---

## How to Give Feedback

### Good Feedback

✅ "Consider extracting this logic into a separate function for reusability"
✅ "This works, but we should add validation to prevent negative numbers"
✅ "Nice solution! Small suggestion: using `Array.filter()` might be more readable here"

### Poor Feedback

❌ "This is wrong"
❌ "Why didn't you do it this way?"
❌ "I would have done this differently" (without explaining why)

### Remember

- Be kind and constructive
- Explain _why_ something should change
- Acknowledge good work
- Ask questions if unclear
- Suggest, don't demand

---

## Approving a PR

Only approve if:

1. You understand what the code does
2. You've verified it meets the checklist
3. You're confident it won't break existing functionality
4. Tests pass and coverage is adequate

If you have suggestions but the PR is acceptable, approve with comments.
If you have concerns that need addressing, request changes with clear explanation.

---

## Self-Review Before Submitting

Before creating a PR, review your own code:

1. Read through every changed line
2. Remove debug code and comments
3. Ensure tests pass
4. Check this checklist
5. Write a clear PR description

**Good PR Title:**
`[Feature] Add user profile management`
`[Fix] Resolve authentication token expiry`
`[Refactor] Improve database query performance`

**Good PR Description:**

```
## What does this PR do?
Adds AI-powered profile suggestions feature.

## Why is this needed?
Helps users get personalized learning recommendations.

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Refactoring

## Testing Done
- [x] Manual testing completed
- [x] Unit tests added
- [x] Integration tests pass

## Screenshots
[Add if UI changes]

## Related Issues
Closes #123
```

---

**Remember: Code review is a learning opportunity for both reviewer and reviewee!**
