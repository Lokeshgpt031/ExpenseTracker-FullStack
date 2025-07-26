# Earning Tracker UI

This is the Angular frontend application for the Earning Tracker project.

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Angular CLI

## Installation

1. Install Node.js from [https://nodejs.org/](https://nodejs.org/)

2. Install Angular CLI globally:
   ```bash
   npm install -g @angular/cli
   ```

3. Navigate to the project directory:
   ```bash
   cd EarningTracker.UI
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

## Development Server

Run the development server:

```bash
ng serve
```

Or alternatively:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
ng build
```

For production build:

```bash
ng build --configuration production
```

## Features

- **Expense Tracking**: Add, view, and delete expenses with categorization
- **Earning Management**: Track income from various sources
- **Analytics Dashboard**: Visual charts and summaries of financial data
- **Responsive Design**: Works on desktop and mobile devices

## API Configuration

The application is configured to connect to the backend API at `https://localhost:7267`. 

To change the API URL, update the `apiUrl` property in the service files:
- `src/app/services/auth.service.ts`
- `src/app/services/expense.service.ts`
- `src/app/services/earning.service.ts`
- `src/app/services/analytics.service.ts`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/
│   │   ├── expenses/
│   │   ├── earnings/
│   │   └── analytics/
│   ├── models/
│   ├── services/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.css
├── index.html
└── main.ts
```

## Technologies Used

- Angular 18
- TypeScript
- CSS3
- RxJS for HTTP requests
- Standalone components architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
