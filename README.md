# Customer Information Management System

A full-stack web application for managing customer information and financial details, built with Python (FastAPI), MongoDB (NoSQL), and React.js. The application features a responsive design that works seamlessly on desktop, tablet, and mobile devices.

## Features

### Customer Management
- ✅ Create, read, update, and delete customer profiles
- ✅ Store detailed customer information (name, email, phone, address, etc.)
- ✅ View comprehensive customer details

### Financial Details Management
- ✅ Manage multiple financial accounts per customer
- ✅ Track account types (checking, savings, credit)
- ✅ Monitor account balances and credit limits
- ✅ Record employment status and monthly income

### Transaction Tracking
- ✅ Record customer transactions (credit/debit)
- ✅ Categorize transactions
- ✅ View transaction history

### Responsive Design
- ✅ Mobile-first responsive design
- ✅ Works on all devices (desktop, tablet, mobile)
- ✅ Optimized user experience across screen sizes

## Technology Stack

### Backend
- **Python 3.11+**
- **FastAPI** - Modern, fast web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation

### Frontend
- **React 19** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Responsive styling

## Project Structure

```
TestProject/
├── backend/
│   ├── main.py           # FastAPI application and routes
│   ├── models.py         # Pydantic models/schemas
│   ├── database.py       # MongoDB connection
│   ├── config.py         # Configuration settings
│   ├── requirements.txt  # Python dependencies
│   ├── Dockerfile        # Backend Docker configuration
│   └── .env.example      # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── App.jsx       # Main App component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   ├── package.json      # Node dependencies
│   └── Dockerfile        # Frontend Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # This file
```

## Getting Started

### Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Python 3.11+**
- **Node.js 18+**
- **MongoDB 5.0+**

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshal11869/TestProject.git
   cd TestProject
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Stop the services**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your MongoDB connection string if needed
   ```

5. **Start MongoDB** (if not using Docker)
   ```bash
   # Make sure MongoDB is running on localhost:27017
   mongod
   ```

6. **Run the backend server**
   ```bash
   python main.py
   # OR
   uvicorn main:app --reload
   ```

   The backend will be available at http://localhost:8000

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

## API Documentation

Once the backend is running, you can access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main API Endpoints

#### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

#### Financial Details
- `GET /api/financial-details/customer/{customer_id}` - Get financial details by customer
- `POST /api/financial-details` - Create financial details
- `PUT /api/financial-details/{id}` - Update financial details
- `DELETE /api/financial-details/{id}` - Delete financial details

#### Transactions
- `GET /api/transactions/customer/{customer_id}` - Get customer transactions
- `POST /api/transactions` - Create transaction

## Usage Guide

### Adding a New Customer

1. Navigate to **"Add Customer"** from the navigation menu
2. Fill in the customer details:
   - First Name, Last Name
   - Email, Phone
   - Address, City, State, ZIP Code, Country
3. Click **"Create Customer"**

### Managing Financial Details

1. Click on a customer from the customer list
2. Navigate to the **"Financial Overview"** tab
3. Click **"Manage Financial Details"**
4. Add account information:
   - Account Number
   - Account Type (Checking, Savings, Credit)
   - Balance
   - Credit Limit (optional)
   - Monthly Income (optional)
   - Employment Status

### Adding Transactions

1. Go to a customer's financial details page
2. Click **"Add Transaction"**
3. Enter transaction details:
   - Transaction Type (Credit/Debit)
   - Amount
   - Category
   - Description

## Responsive Design

The application is fully responsive and optimized for:
- 📱 **Mobile devices** (320px - 480px)
- 📱 **Tablets** (481px - 768px)
- 💻 **Desktop** (769px and above)

Features adapt based on screen size:
- Navigation collapses on mobile
- Tables scroll horizontally on small screens
- Forms stack vertically on mobile
- Buttons expand to full width on small screens

## Development

### Running Tests

```bash
# Backend tests (if implemented)
cd backend
pytest

# Frontend tests (if implemented)
cd frontend
npm test
```

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist/`

#### Backend
The backend can be deployed using Docker or any Python WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check the MongoDB connection string in `.env`
- Verify all dependencies are installed: `pip install -r requirements.txt`

### Frontend won't start
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check that the backend is running on port 8000
- Clear browser cache

### CORS errors
- Ensure the backend CORS settings in `config.py` include your frontend URL
- Check that both frontend and backend are running

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Python, MongoDB, and React**