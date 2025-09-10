# QuickNet - Client Management & Payment Processing System

A modern, full-featured client management and payment processing application built with React, TypeScript, and Supabase. Features role-based authentication, real-time data synchronization, and comprehensive business management tools.

## Features

### Authentication & Authorization
- **User Registration & Login**: Secure authentication with Supabase Auth
- **Role-Based Access Control**: Admin and regular user roles with different permissions
- **Auto Admin Assignment**: First registered user automatically becomes admin
- **Protected Routes**: Route-level access control based on user roles
- **Session Management**: Persistent login sessions with automatic token refresh

### Dashboard
- **Business Overview**: Key metrics and statistics at a glance
- **Total Clients**: Track your client base growth
- **Payment Analytics**: Monitor payment trends and totals
- **Recent Activity**: Latest payments and client additions
- **Top Clients**: Identify clients with highest outstanding balances
- **Quick Actions**: Fast access to common tasks

### Client Management
- **Client Registration**: Add clients with invoice numbers, names, phone, and ID
- **Client Cards**: Visual display of client information and balances
- **Search & Filter**: Find clients quickly with real-time search
- **Balance Tracking**: Automatic balance calculations and updates
- **Client History**: Track client creation dates and payment history

### Payment Processing
- **Payment Interface**: User-friendly payment processing modal
- **Receipt Generation**: Automatic receipt creation with payment details
- **Balance Updates**: Real-time balance adjustments after payments
- **Payment History**: Complete audit trail of all transactions
- **Partial Payments**: Support for partial payment processing

### Role-Based Features
- **Admin Access**: Full system access including payment management
- **User Restrictions**: Regular users limited to their own clients
- **Permission Enforcement**: UI and API-level access controls
- **Admin Badge**: Visual indication of admin status

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth with Row Level Security
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Charts**: Recharts for data visualization

## Project Structure

\`\`\`
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AuthProvider.tsx # Authentication context
│   ├── ProtectedRoute.tsx # Route protection
│   ├── Layout.tsx       # Main app layout
│   ├── LoginForm.tsx    # Authentication form
│   ├── ClientCard.tsx   # Client display component
│   ├── AddClientForm.tsx # Client creation form
│   ├── PaymentModal.tsx # Payment processing
│   ├── ReceiptModal.tsx # Payment receipts
│   ├── SearchBar.tsx    # Client search
│   └── StatsCards.tsx   # Dashboard statistics
├── pages/               # Application pages
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Clients.tsx      # Client management
│   ├── Payments.tsx     # Payment history (admin)
│   └── Index.tsx        # App entry point
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication logic
│   ├── useClients.ts    # Client management
│   └── use-toast.ts     # Toast notifications
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Supabase client config
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
│   └── index.ts         # Application types
└── App.tsx              # Main application component
\`\`\`

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `is_admin` (Boolean, Default: false)
- `created_at` (Timestamp)

### Clients Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Users)
- `invoice_number` (String)
- `client_name` (String)
- `phone` (String)
- `id_number` (String)
- `balance` (Decimal)
- `created_at` (Timestamp)

### Payments Table
- `id` (UUID, Primary Key)
- `client_id` (UUID, Foreign Key to Clients)
- `amount` (Decimal)
- `created_at` (Timestamp)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <YOUR_GIT_URL>
   cd quicknet
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## 🔧 Configuration

### Environment Variables
The following environment variables are automatically configured when using Supabase integration:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key


## 👤 User Roles & Permissions

### Admin Users
- ✅ View all clients across the system
- ✅ Access payment history and analytics
- ✅ Full dashboard access
- ✅ User management capabilities

### Regular Users
- ✅ View and manage their own clients only
- ✅ Process payments for their clients
- ✅ Limited dashboard view
- ❌ Cannot access system-wide payment data

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: UI and API-level permission enforcement
- **Data Isolation**: Users can only access their own data
- **Secure API Calls**: All database operations are authenticated

## Responsive Design

The application is fully responsive and works seamlessly across:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop computers (1024px+)
- Large screens (1440px+)

## UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Theme switching support
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Keyboard Navigation**: Full accessibility support

### Manual Deployment
\`\`\`bash
npm run build
# Deploy the dist/ folder to your hosting provider
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details

## Version History

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added role-based access control
- **v1.2.0**: Implemented payment processing
- **v1.3.0**: Added React Query for better state management

---

Built with ❤️ using React, TypeScript, and Supabase by Mahmoud Faour
