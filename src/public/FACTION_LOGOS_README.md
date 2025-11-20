# Faction Logos

Replace the placeholder logos in the FactionsPage component with your local logo files.

## Required Logo Files

Place the following logo files in the `/public/` folder:

1. **rebel-alliance-logo.png** - Rebel Alliance faction logo
2. **galactic-empire-logo.png** - Galactic Empire faction logo  
3. **galactic-republic-logo.png** - Galactic Republic faction logo
4. **cis-logo.png** - CIS (Confederacy of Independent Systems) faction logo

## Recommended Specifications

- Format: PNG (with transparent background recommended)
- Size: 200x200 pixels minimum
- Aspect Ratio: Square (1:1)

## How to Update

After placing your logo files in `/public/`, update the `getFactionLogo()` function in `/components/FactionsPage.tsx`:

```typescript
const getFactionLogo = (faction: string) => {
  switch (faction) {
    case 'Rebel Alliance':
      return '/rebel-alliance-logo.png';
    case 'Galactic Empire':
      return '/galactic-empire-logo.png';
    case 'Galactic Republic':
      return '/galactic-republic-logo.png';
    case 'CIS':
      return '/cis-logo.png';
    default:
      return '/rebel-alliance-logo.png';
  }
};
```
