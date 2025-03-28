# Pilot Salary Calculator

A professional calculator application for pilots to estimate their salary based on their position, airline, and flight sectors.

## Features

- Select between different airlines (Yellow Tail, Blue Tail)
- Choose position (First Officer, Captain)
- Enter flight sectors with both manual input and screenshot upload options
- Detailed salary breakdown with interactive charts
- Mobile-responsive design
- Double salary calculation option
- Beautiful animations powered by Framer Motion

## Mobile-Responsive Design

The application is fully optimized for mobile devices with:
- Properly sized touch targets (minimum 44px)
- Responsive layouts that adapt to different screen sizes
- Font size adjustments for readability
- Optimized spacing and padding for mobile screens
- Custom styles for extra small devices

## Deployment to Azure

### Prerequisites

1. An Azure account with an active subscription
2. A GitHub account for CI/CD deployment
3. Azure CLI installed (for local deployment options)

### Method 1: Deploy with Azure Static Web Apps

#### Step 1: Create a Static Web App in Azure

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Search for "Static Web Apps" and select it
3. Click "Create"
4. Fill in the details:
   - Subscription: Your subscription
   - Resource Group: Create new or select existing
   - Name: pilotpro-calculator
   - Region: Select a region close to your users
   - SKU: Free or Standard
   - Source: GitHub
   - GitHub Account: Sign in and authorize
   - Organization: Your GitHub organization
   - Repository: Select your repository
   - Branch: main
   - Build Presets: Vite
   - App location: /
   - Output location: dist
   - API location: api (leave empty if not using)
5. Click "Review + Create" and then "Create"

#### Step 2: Configure GitHub Actions

The deployment will automatically set up a GitHub Actions workflow in your repository, but we've already prepared it. Just make sure to:

1. Set up the GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN_PILOT_SALARY_CALCULATOR` in your repository:
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Create a new repository secret with the name above and paste the deployment token from Azure

#### Step 3: Trigger Deployment

1. Push changes to your main branch
2. GitHub Actions will automatically build and deploy your app to Azure

### Testing on Mobile Devices

Once deployed, your app will be accessible at a URL like:
`https://[unique-name].azurestaticapps.net`

To test mobile responsiveness:
1. Open the URL on your mobile device
2. Test all features, especially:
   - Flight sector inputs (both manual and upload)
   - Navigation between steps
   - Chart visibility and interaction
   - Form inputs and buttons

You can also use the browser's developer tools to simulate different mobile devices.

## Environment Variables

For local development, create a `.env` file with:

```
VITE_OPENAI_API_KEY=your_openai_api_key
```

For Azure deployment, add this as an application setting in your Static Web App.

## Further Improvements

- Add detailed unit and integration tests
- Implement browser storage for saved calculations
- Enhance offline capabilities with service workers
- Add more airline options and calculation factors
