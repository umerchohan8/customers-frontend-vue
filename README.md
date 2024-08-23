
# Vue.js Customers Listing Frontend

This is a Vue.js application that provides a user interface for viewing customer data. The application fetches data from the Laravel backend API and displays it in a sortable, paginated table.

## Prerequisites

- Node.js >= 12.x
- npm

## Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/umerchohan8/customers-frontend-vue
   cd customers-frontend-vue
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**

   Define your API endpoint in apiUrl constant in src/config.js file:

   ```bash
   export const apiUrl = 'http://localhost:8000/api';
   ```

4. **Run the Application:**

   Start the development server:

   ```bash
   npm run dev
   ```

   The application should now be accessible at your local endpoint.


5. **Features:**

   - **Sortable Table**: Click on the headers to sort the customer data.
   - **Pagination**: Navigate through pages of customer data.
   - **Dynamic Pie Charts**: Visual representation of customer scores.
