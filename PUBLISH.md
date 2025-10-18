# Publishing simple-cache-mongoose to NPM

## Prerequisites

1. **Create an NPM account** at https://www.npmjs.com/signup if you don't have one
2. **Login to NPM** in your terminal:
   ```bash
   npm login
   ```

## Steps to Publish

### 1. Update package.json with your details

Replace placeholders in `package.json`:

- Change `"author": "your-name"` to your actual name or npm username
- Update repository URLs from `"your-username"` to your actual GitHub username
- Verify the version number (currently set to 1.0.0)

### 2. Create a GitHub repository

1. Create a new repository on GitHub named `simple-cache-mongoose`
2. Initialize git and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: simple-cache-mongoose v1.0.0"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/simple-cache-mongoose.git
   git push -u origin main
   ```

### 3. Final checks before publishing

1. **Build the package:**

   ```bash
   npm run build
   ```

2. **Run tests:**

   ```bash
   npm test
   ```

3. **Check what will be published:**
   ```bash
   npm pack --dry-run
   ```

### 4. Publish to NPM

1. **First time publishing:**

   ```bash
   npm publish
   ```

2. **For updates (increment version first):**
   ```bash
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   npm publish
   ```

## Important Notes

- **Package name availability**: Make sure `simple-cache-mongoose` is available on NPM
- **Semver**: Follow semantic versioning for updates
- **License**: The package uses MIT license
- **Dependencies**: All dependencies are properly configured in package.json

## Verification

After publishing, verify your package:

1. Visit https://www.npmjs.com/package/simple-cache-mongoose
2. Test installation: `npm install simple-cache-mongoose`

## Updating

For future updates:

1. Make your changes
2. Update version: `npm version [patch|minor|major]`
3. Build: `npm run build`
4. Test: `npm test`
5. Publish: `npm publish`
6. Push git changes: `git push && git push --tags`
